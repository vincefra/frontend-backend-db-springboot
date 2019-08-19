import React from 'react';
import VizCircle from 'components/vizCircle/VizCircle';
import Legend from 'components/legend/Legend';
import Dialogue from 'components/dialogue/Dialogue';
import VizTimeline from 'components/vizTimeline/VizTimeline';
import Header from 'components/header/Header';
import Loader from 'components/loader/Loader';
import Title from 'components/title/Title';
import { load, getLargestClients } from './data';
import { getObjects } from 'components/general';
import {
  setHighlight,
  setHighlightElement,
  highlightElementWithSkill,
  getElementById,
  brushProjects,
  getDateRange,
  setHighlightText,
  unHighlightText,
  getDateFromStep,
  getMonthsDifference,
  resetBrushedDisplay,
  getIdsByEmployeeId
} from 'components/interactions';
//width and height of the SVG visualization
const width = window.innerWidth;
const height = window.innerHeight;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: [],
      unsortedClients: [],
      clickedClient: [],
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
      clientList,
      unsortedClients
    } = await load();
    const selectedRange = getDateRange(projectList);
    let totalMonths = getMonthsDifference(selectedRange[0], selectedRange[1]);

    this.setState({
      initialDates: selectedRange,
      datesBrushed: selectedRange,
      totalProjectsMonths: totalMonths,
      isLoading: false,
      clients: clientList,
      unsortedClients,
      projects: projectList,
      employees: employeeList,
      skills: technologyList,
      filteredClients: clientList,
      filteredProjects: projectList,
      filteredEmployees: employeeList,
      filteredSkills: technologyList,
      range: selectedRange,
      clickedClient: categories,
      filterPosition: [0, totalMonths],
      annularSectors: categories.list,
      currentView: categories.name
    });
  }


  showSkill = id => {
    const ans = highlightElementWithSkill(id, this.state.projects);
    const highlightedSectors = setHighlightElement(false, ans[0], this.state.annularSectors, false);
    const highlightedEmployees = highlightElementWithSkill(id, this.state.filteredEmployees);
    const highlightedSkills = setHighlightElement(true, [id], this.state.skills, true);

    this.setState({
      skills: highlightedSkills,
      projects: ans[1],
      annularSectors: highlightedSectors,
      filteredEmployees: highlightedEmployees
    });
  };

  showProject = id => {
    const project = getElementById(id, this.state.projects);
    const highlightedEmployees = setHighlightElement(false, project.employees, this.state.filteredEmployees, false);
    const highlightedProjects = setHighlightElement(false, [id], this.state.filteredProjects, false);
    const highligtedSectors = setHighlightElement(false, [project.clientId], this.state.annularSectors, false);
    const highlightedSkills = setHighlightElement(true, project.skills, this.state.filteredSkills, true);

    this.setState({
      annularSectors: highligtedSectors,
      filteredSkills: highlightedSkills,
      filteredProjects: highlightedProjects,
      filteredEmployees: highlightedEmployees,
      highlightedProject: project
    });

    const client = getElementById(project.clientId, this.state.annularSectors);
    this.toggleDialogue();
    this.modifyDialogueInfo({ ...project, clientName: client.name, logo: client.logo }, 'PROJECT');
  };

  showEmployee = id => {
    const employee = getElementById(id, this.state.filteredEmployees);
    const projectIds = getIdsByEmployeeId(id, this.state.filteredProjects);
    const clientIds = getIdsByEmployeeId(id, this.state.annularSectors);
    const highlightedEmployees = setHighlightElement(false, [id], this.state.filteredEmployees, false);
    const highlightedSectors = setHighlightElement(false, clientIds, this.state.annularSectors, false);
    const highlightedProjects = setHighlightElement(false, projectIds, this.state.filteredProjects, false);
    const highlightedSkills = setHighlightElement(true, employee.skills, this.state.filteredSkills, true);

    this.setState({
      annularSectors: highlightedSectors,
      filteredProjects: highlightedProjects,
      filteredEmployees: highlightedEmployees,
      filteredSkills: highlightedSkills,
      highlightedEmployee: employee
    });
    this.toggleDialogue();
    this.modifyDialogueInfo(employee, 'EMPLOYEE');
  };

  showClient = (id) => {
    const client = getElementById(id, this.state.annularSectors);
    let highlightedSectors = setHighlightElement(false, [id], this.state.annularSectors, false);
    highlightedSectors = client.type !== 'client' ? 
      setHighlightText(true, [id], highlightedSectors, true) : highlightedSectors;
    const highlightedEmployees = setHighlightElement(false, client.employees, this.state.filteredEmployees, false);
    const highlightedProjects = setHighlightElement(false, client.projects, this.state.filteredProjects, false);
    let highlightedSkills = client.type === 'client' ? 
      setHighlightElement(true, client.skills, this.state.filteredSkills, true) :
      this.state.filteredSkills;

    this.setState({
      annularSectors: highlightedSectors,
      filteredSkills: highlightedSkills,
      filteredEmployees: highlightedEmployees,
      filteredProjects: highlightedProjects,
      highlightedClient: client
    });

    if (client.type === 'client') {
      this.toggleDialogue();
      this.modifyDialogueInfo(client, 'CLIENT');
    }
  };

  unHighlightElements = (annularSectors, projects, employees, skills) => {
    annularSectors = annularSectors || this.state.annularSectors;
    projects = projects || this.state.filteredProjects;
    employees = employees || this.state.filteredEmployees;
    skills = skills || this.state.filteredSkills;
    if (this.state.dialogueIsShown) this.toggleDialogue();
    let unhighligtedSectors = setHighlight(true, annularSectors);
    unhighligtedSectors = unHighlightText(unhighligtedSectors);
    const unhighlightedProjects = setHighlight(true, projects);
    const unhighlightedEmployees = setHighlight(true, employees);
    const unhighlightedSkills = setHighlight(false, skills);

    this.setState({
      annularSectors: unhighligtedSectors,
      filteredSkills: unhighlightedSkills,
      filteredProjects: unhighlightedProjects,
      filteredEmployees: unhighlightedEmployees,
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
    let clients = this.state.annularSectors;
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

  setClickedClient(client, resetClickedClient) {
    if (resetClickedClient) return { id: '', name: '', type: '', list: [] };
    else if ((client.type === 'category' || client.type === 'more') && client.list.length === 1) 
      return client.list[0];
    else return client;
  }

  containsCategory(client) {
    if (client.type === 'client') return false;
    if (client.type === 'root') return true;
    if (client.list[0].type === 'category') return true;
  }

  handleClick = (client, resetClickedClient = false) => {
    const employees = getObjects(client.employees, this.state.employees);
    const annularSectors = client.list.length === 0 ? [client] : getLargestClients(client.list);
    const filteredClients = client.list.length === 0 ? [] : 
      getObjects(client.clients, this.state.unsortedClients);
    const projects = client.type === 'root' ? this.state.projects : 
      getObjects(client.projects, this.state.projects);
    const skills = client.type === 'root' ? this.state.skills : 
      getObjects(client.skills, this.state.skills);
    const clickedClient = this.setClickedClient(client, resetClickedClient);
    const rangeBrushed = getDateRange(projects);
    const totalMonths = getMonthsDifference(rangeBrushed[0], rangeBrushed[1]);
    const filterPosition = [0, totalMonths];
    const currentView = client.type === 'more' ? this.state.currentView :
      clickedClient.id === '' ? client.name : clickedClient.name;
    resetBrushedDisplay(projects);
    this.setState({
      currentView,
      clickedClient,
      filteredClients,
      datesBrushed: rangeBrushed,
      totalProjectsMonths: totalMonths,
      filterPosition: filterPosition,
      refreshLegends: !this.state.refreshLegends
    });
    this.unHighlightElements(annularSectors, projects, employees, skills);
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
    const title = <Title
      title={this.state.currentView}
      isHighlighted={
        this.state.highlightedClient || 
        this.state.highlightedProject || 
        this.state.highlightedEmployee
      }
    />;
    const legend = <Legend
      clients={this.state.filteredClients}
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
      clients={this.state.clients}
      size={this.state.size}
      selectProject={this.showProject}
      mouseOutProject={this.unHighlightElements}
      modifyRange={this.brushDates}
      totalProjectsMonths={this.state.totalProjectsMonths}
      filterPosition={this.state.filterPosition}
      formatDate={this.getDateFormated}
    />;
    const vizCircle = <VizCircle
      annularSectors={this.state.annularSectors}
      clients={this.state.filteredClients}
      employees={this.state.filteredEmployees}
      projects={this.state.filteredProjects}
      skills={this.state.filteredSkills}
      size={this.state.size}
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
            {title}
            {legend}
            {dialogue}
            {vizCircle}
            {timeline}
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

export default App;