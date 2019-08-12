import React from 'react';
import VizCircle from './components/vizCircle/VizCircle';
import Legend from './components/legend/Legend';
import Dialogue from './components/dialogue/Dialogue';
import VizTimeline from './components/vizTimeline/VizTimeline';
import Header from './components/header/Header';
import Loader from './components/loader/Loader';
import { 
  load, 
  getLargestClients, 
  getEmployeeObjs, 
  getProjectObjs, 
  getNumberOfClients 
} from './components/general';
import {
  setHighlight,
  setHighlightElement,
  highlightElementWithSkill,
  getElementById,
  getSkillsIDsFromProject,
  getSkills,
  brushProjects,
  getDateRange,
  setHighlightText,
  unHighlightText,
  getDateFromStep,
  getMonthsDifference,
  resetBrushedDisplay,
  getIdsByEmployeeId
} from './components/interaction';
//width and height of the SVG visualization
const width = window.innerWidth;
const height = window.innerHeight;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: [],
      projects: [],
      employees: [],
      skills: [],
      filteredClients: [],
      filteredProjects: [],
      filteredEmployees: [],
      filteredSkills: [],
      size: [width, height],
      isLoading: true,
      isMobileView: false,
      dialogueIsShown: false,
      initialDates: [],
      datesBrushed: [],
      totalProjectsMonths: 0,
      elementOver: {
        type: 'none',
        info: null
      },
      dialogueInfo: {},
      displayTimeline: false,
      filterPosition: [],
      highlightedClient: null,
      highlightedProject: null,
      highlightedEmployee: null,
      refreshLegends: false
    };
  }

  async componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
    this.setState({ isLoading: true });
    const {
      categories,
      projectList,
      employeeList,
      technologyList,
      clientList
    } = await load();
    const selectedRange = getDateRange(projectList);
    let totalMonths = getMonthsDifference(selectedRange[0], selectedRange[1]);

    this.setState({
      initialDates: selectedRange,
      datesBrushed: selectedRange,
      totalProjectsMonths: totalMonths,
      isLoading: false,
      clients: categories.list,
      projects: projectList,
      employees: employeeList,
      skills: technologyList,
      filteredClients: clientList,
      filteredProjects: projectList,
      filteredEmployees: employeeList,
      filteredSkills: technologyList,
      range: selectedRange,
      clickedClient: categories,
      filterPosition: [0, totalMonths]
    });
  }


  showSkill = id => {
    const ans = highlightElementWithSkill(id, this.state.projects);
    const highlightedClients = setHighlightElement(false, ans[0], this.state.clients, false);
    const highlightedEmployees = highlightElementWithSkill(id, this.state.filteredEmployees);
    const highlightedSkills = setHighlightElement(true, [id], this.state.skills, true);

    this.setState({
      skills: highlightedSkills,
      projects: ans[1],
      clients: highlightedClients,
      filteredEmployees: highlightedEmployees
    });
  };

  showProject = id => {
    const project = getElementById(id, this.state.projects);
    const highlightedEmployees = setHighlightElement(false, project.employees, this.state.filteredEmployees, false);
    const highlightedProjects = setHighlightElement(false, [id], this.state.projects, false);
    const highlightedClients = setHighlightElement(false, [project.clientId], this.state.clients, false);
    const highlightedSkills = setHighlightElement(true, project.skills, this.state.filteredSkills, true);

    this.setState({
      clients: highlightedClients,
      filteredSkills: highlightedSkills,
      projects: highlightedProjects,
      filteredEmployees: highlightedEmployees,
      highlightedProject: project
    });

    const client = getElementById(project.clientId, this.state.clients);
    this.toggleDialogue();
    this.modifyDialogueInfo({ ...project, clientName: client.name, logo: client.logo }, 'PROJECT');
  };

  showEmployee = id => {
    const employee = getElementById(id, this.state.filteredEmployees);
    const projectIds = getIdsByEmployeeId(id, this.state.filteredProjects);
    const clientIds = getIdsByEmployeeId(id, this.state.clients);
    const highlightedEmployees = setHighlightElement(false, [id], this.state.filteredEmployees, false);
    const highlightedClients = setHighlightElement(false, clientIds, this.state.clients, false);
    const highlightedProjects = setHighlightElement(false, projectIds, this.state.filteredProjects, false);
    const highlightedSkills = setHighlightElement(true, employee.skills, this.state.filteredSkills, true);

    this.setState({
      filteredEmployees: highlightedEmployees,
      filteredProjects: highlightedProjects,
      clients: highlightedClients,
      filteredSkills: highlightedSkills,
      highlightedEmployee: employee
    });
    this.toggleDialogue();
    this.modifyDialogueInfo(employee, 'EMPLOYEE');
  };


  showClient = (id) => {
    const client = getElementById(id, this.state.clients);
    let highlightedClients = setHighlightElement(false, [id], this.state.clients, false);
    highlightedClients = client.type !== 'client' ? setHighlightText(true, [id], highlightedClients, true) : highlightedClients;
    const highlightedEmployees = setHighlightElement(false, client.employees, this.state.filteredEmployees, false);
    const highlightedProjects = setHighlightElement(false, client.projects, this.state.projects, false);
    let highlightedSkills = this.state.filteredSkills;
    if (client.type === 'client') {
      const skillsIds = getSkillsIDsFromProject(this.state.projects, client);
      highlightedSkills = setHighlightElement(true, skillsIds, this.state.filteredSkills, true);
    }

    this.setState({
      filteredSkills: highlightedSkills,
      filteredEmployees: highlightedEmployees,
      projects: highlightedProjects,
      clients: highlightedClients,
      highlightedClient: client
    });

    if (client.type === 'client') {
      this.toggleDialogue();
      this.modifyDialogueInfo(client, 'CLIENT');
    }
  };

  unHighlightElements = (clients, projects, employees, skills) => {
    clients = clients || this.state.clients;
    projects = projects || this.state.filteredProjects;
    employees = employees || this.state.filteredEmployees;
    skills = skills || this.state.filteredSkills;
    if (this.state.dialogueIsShown) this.toggleDialogue();
    let unHighlightedClients = setHighlight(true, clients);
    unHighlightedClients = unHighlightText(unHighlightedClients);
    const unHighlightedProjects = setHighlight(true, projects);
    const unHighlightedEmployees = setHighlight(true, employees);
    const unHighlightedSkills = setHighlight(false, skills);

    this.setState({
      clients: unHighlightedClients,
      filteredSkills: unHighlightedSkills,
      filteredProjects: unHighlightedProjects,
      filteredEmployees: unHighlightedEmployees,
      highlightedClient: null,
      highlightedProject: null,
      highlightedEmployee: null
    });
  };

  toggleDialogue = () => {
    const showDialogue = this.state.dialogueIsShown ? false : true;
    this.setState({ dialogueIsShown: showDialogue });
  };

  /**
 * Recieves an initial and ending date in number of months.  
 * Returns the range in full date object
 *
 * @param initMonth the initial number of the month in the initial full date
 * @param enMonth the ending number of the month in the end full date 
 */
  brushDates = (initMonth, enMonth) => {
    const brushedProjects = brushProjects(this.state.filteredProjects, this.state.datesBrushed[0], initMonth, enMonth);
    this.setState({
      filteredProjects: brushedProjects,
      filterPosition: [initMonth, enMonth]
    });
  };

  getDateFormated = (month) => {
    return getDateFromStep(month, this.state.datesBrushed[0]);
  }

  highlightElements = name => {
    let clients = this.state.clients;
    let filteredEmployees = this.state.filteredEmployees;
    let filteredProjects = this.state.filteredProjects;
    let filteredSkills = this.state.filteredSkills;
    switch (name) {
      case 'EMPLOYEES':
        clients = setHighlight(false, clients);
        filteredProjects = setHighlight(false, filteredProjects);
        break;
      case 'CLIENTS':
        filteredEmployees = setHighlight(false, filteredEmployees);
        filteredProjects = setHighlight(false, filteredProjects);
        break;
      case 'PROJECTS':
        clients = setHighlight(false, clients);
        filteredEmployees = setHighlight(false, filteredEmployees);
        break;
      case 'SKILLS':
        clients = setHighlight(false, clients);
        filteredProjects = setHighlight(false, filteredProjects);
        filteredEmployees = setHighlight(false, filteredEmployees);
        filteredSkills = setHighlight(true, filteredSkills);
        break;
      default:
    }

    this.setState({
      clients,
      filteredProjects,
      filteredEmployees,
      filteredSkills
    });
  };

  modifyDialogueInfo(data, type) {
    this.setState({ dialogueInfo: { data, type } });
  }

  resize() {
    this.setState({ isMobileView: window.innerWidth <= 1180 });
  }

  handleClick = (client, resetClickedClient = false) => {
    const employees = getEmployeeObjs(client.employees, this.state.employees);
    const clients = client.list.length === 0 ? [client] : getLargestClients(client.list);
    const projects = client.type === 'root' ? this.state.projects : 
      getProjectObjs(client.projects, this.state.projects);
    const skills = client.type === 'root' ? this.state.skills : 
      getSkills(getSkillsIDsFromProject(this.state.projects, client), this.state.skills);
    const clickedClient = resetClickedClient ? { id: '', name: '', type: '', list: [] } : client;
    const rangeBrushed = getDateRange(projects);
    const totalMonths = getMonthsDifference(rangeBrushed[0], rangeBrushed[1]);
    const displayTimeline = projects.length <= 1 ? false : true;
    const filterPosition = [0, totalMonths];
    resetBrushedDisplay(projects);
    this.setState({
      clickedClient,
      displayTimeline: displayTimeline,
      datesBrushed: rangeBrushed,
      totalProjectsMonths: totalMonths,
      filterPosition: filterPosition,
      refreshLegends: resetClickedClient ? !this.state.refreshLegends : this.state.refreshLegends
    });
    this.unHighlightElements(clients, projects, employees, skills);
  }

  render() {
    const mobileView = (
      <div className='mobile-message'>
        <div className='logo d-flex large'>
          <div className='spacing-h small' />
          <h1>FindOut Visualization</h1>
        </div>
        <div className='spacing' />
        <p>
          Please visit us from a desktop, this visualization is not
          responsive....
        </p>
      </div >
    );

    const header = <Header
      clients={this.state.clients}
      projects={this.state.projects}
      employees={this.state.employees}
      skills={this.state.skills}
      showProject={this.showProject}
      showEmployee={this.showEmployee}
      showSkill={this.showSkill}
      showClient={this.showClient}
      unHighlightElements={this.unHighlightElements}
      clickedClient={this.state.clickedClient}
      breadcrumbClick={this.handleClick}
    />;
    const legend = <Legend
      clients={this.state.clients}
      projects={this.state.filteredProjects}
      employees={this.state.filteredEmployees}
      skills={this.state.filteredSkills}
      client={this.state.highlightedClient}
      project={this.state.highlightedProject}
      employee={this.state.highlightedEmployee}
      overEvent={this.highlightElements}
      outEvent={this.unHighlightElements}
      refreshLegends={this.state.refreshLegends}
    />;
    const dialogue = <Dialogue
      dialogueIsShown={this.state.dialogueIsShown}
      toggleDialogue={this.toggleDialogue}
      dialogueInfo={this.state.dialogueInfo}
    />;
    const timeline = <VizTimeline
      projects={this.state.filteredProjects}
      size={this.state.size}
      selectProject={this.showProject}
      mouseOutProject={this.unHighlightElements}
      modifyRange={this.brushDates}
      totalProjectsMonths={this.state.totalProjectsMonths}
      displayTimeline={this.state.displayTimeline}
      filterPosition={this.state.filterPosition}
      formatDate={this.getDateFormated}

    />;
    const vizCircle = <VizCircle
      clients={this.state.clients}
      employees={this.state.filteredEmployees}
      projects={this.state.projects}
      size={this.state.size}
      skills={this.state.filteredSkills}
      mouseOnClient={this.showClient}
      mouseOnEmployee={this.showEmployee}
      mouseOnProject={this.showProject}
      unHighlightElements={this.unHighlightElements}
      clientClick={this.handleClick}
    />;
    return (
      <React.Fragment>
        {this.state.isMobileView ? mobileView : this.state.isLoading ? <Loader /> :
          <React.Fragment>
            {header}
            {legend}
            {dialogue}
            {timeline}
            {vizCircle}
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

export default App;