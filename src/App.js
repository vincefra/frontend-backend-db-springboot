import React from 'react';
import VizCircle from './components/vizCircle/VizCircle';
import Legend from './components/legend/Legend';
import Dialogue from './components/dialogue/Dialogue';
import VizTimeline from './components/vizTimeline/VizTimeline';

import Header from './components/header/Header';
import Loader from './components/loader/Loader';
import { load, getLargestClients, getEmployeeObjs, getProjectObjs, resetHighlights } from './components/general';
import {
  setHighlight,
  setHighlightElement,
  highlightElementWithSkill,
  highLightProjectWithEmployeeId,
  getElementById,
  getSkillsIDsFromProject,
  getSkills,
  brushProjects,
  getDateRange,
  setHighlightText,
  unHighlightText
} from './components/interaction';
import * as d3 from 'd3';
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
      filterPosition: []
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
    let totalMonths = d3.timeMonth.count(selectedRange[0], selectedRange[1]);

    this.setState({
      initialDates: selectedRange,
      datesBrushed: selectedRange,
      totalProjectsMonths: totalMonths, //SET UP INITIAL DATA FILTER
      isLoading: false,
      clients: categories.list,
      projects: projectList,
      employees: employeeList,
      skills: technologyList,
      filteredClients: clientList,
      filteredProjects: [],
      filteredEmployees: employeeList,
      filteredSkills: [],
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
    const highlightedEmployees = setHighlightElement(false, project.employeeId, this.state.filteredEmployees, false);
    const highlightedProjects = setHighlightElement(false, [id], this.state.projects, false);
    const highlightedClients = setHighlightElement(false, [project.clientId], this.state.clients, false);
    const highlightedSkills = getSkills(project.skills, this.state.skills);

    this.setState({
      clients: highlightedClients,
      filteredSkills: highlightedSkills,
      projects: highlightedProjects,
      filteredEmployees: highlightedEmployees
    });

    const client = getElementById(project.clientId, this.state.clients);
    this.toggleDialogue();
    this.modifyDialogueInfo({ ...project, clientName: client.name, logo: client.logo }, 'PROJECT');
  };

  showEmployee = (id) => {
    const employee = getElementById(id, this.state.filteredEmployees);
    const highlightedEmployees = setHighlightElement(false, [id], this.state.filteredEmployees, false);
    const ans = highLightProjectWithEmployeeId(id, this.state.projects);
    const highlightedClients = setHighlightElement(false, ans[0], this.state.clients, false);
    const highlightedSkills = getSkills(employee.skills, this.state.skills);
    this.setState({
      filteredEmployees: highlightedEmployees,
      projects: ans[1],
      clients: highlightedClients,
      filteredSkills: highlightedSkills
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
    let highlightedSkills = [];
    if (client.type === 'client') {
      const skillsId = getSkillsIDsFromProject(id, this.state.projects, client);
      highlightedSkills = getSkills(skillsId, this.state.skills);
    }

    this.setState({
      filteredSkills: highlightedSkills,
      filteredEmployees: highlightedEmployees,
      projects: highlightedProjects,
      clients: highlightedClients
    });

    if (client.type === 'client') {
      this.toggleDialogue();
      this.modifyDialogueInfo(client, 'CLIENT');
    }
  };

  unHighlightElements = () => {
    if (this.state.dialogueIsShown) this.toggleDialogue();
    let unhighlightedClients = setHighlight(true, this.state.clients);
    unhighlightedClients = unHighlightText(unhighlightedClients);
    const unHighLightProject = setHighlight(true, this.state.filteredProjects);
    const highlightedEmployees = setHighlight(true, this.state.filteredEmployees);

    this.setState({
      clients: unhighlightedClients,
      filteredSkills: [],
      filteredProjects: unHighLightProject,
      filteredEmployees: highlightedEmployees
    });
  };

  toggleDialogue = () => {
    const showDialogue = this.state.dialogueIsShown ? false : true;
    this.setState({ dialogueIsShown: showDialogue });
  };
  /**
 * Recieves an initial and ending date in number of weeks.  
 * Returns the range in full date object
 *
 * @param initWeek the initial number of the week in the initial full date
 * @param endWeek the ending number of the week in the end full date 
 */
  brushDates = (initWeek, endWeek) => {
    const brushedProjects = brushProjects(this.state.filteredProjects, this.state.datesBrushed[0], initWeek, endWeek);
    this.setState({
      filteredProjects: brushedProjects,
      filterPosition: [initWeek, endWeek]
    });
  };

  HighlightElements = (name) => {
    switch (name) {
      case 'EMPLOYEES':
        this.unhightLightElements('CLIENTS');
        this.unhightLightElements('PROJECTS');
        this.unhightLightElements('SKILLS');
        break;
      case 'CLIENTS':
        this.unhightLightElements('EMPLOYEES');
        this.unhightLightElements('PROJECTS');
        this.unhightLightElements('SKILLS');
        break;
      case 'PROJECTS':
        this.unhightLightElements('EMPLOYEES');
        this.unhightLightElements('SKILLS');
        break;
      case 'SKILLS':
        this.unhightLightElements('EMPLOYEES');
        this.unhightLightElements('CLIENTS');
        this.unhightLightElements('PROJECTS');
        break;
      default:
        this.unHighlightElements();
    }
  };

  modifyDialogueInfo(data, type) {
    this.setState({ dialogueInfo: { data, type } });
  }

  resize() {
    this.setState({ isMobileView: window.innerWidth <= 1180 });
  }

  handleClick = (client, resetClickedClient = false) => {
    const employees = getEmployeeObjs(client.employees, this.state.employees);
    const clientList = client.list.length === 0 ? [client] : getLargestClients(client.list);
    const projectList = getProjectObjs(client.projects, this.state.projects);
    const rangeBrushed = getDateRange(projectList);
    const totalMonths = d3.timeMonth.count(rangeBrushed[0], rangeBrushed[1]);
    const displayTimeline = projectList.length <= 1 ? false : true;
    const filterPosition = [0, totalMonths];
    let clickedClient = resetClickedClient ? {
      id: '',
      name: '',
      type: '',
      list: []
    } : client;

    resetHighlights(clientList);
    resetHighlights(employees);
    this.setState({
      clients: clientList,
      clickedClient: clickedClient,
      filteredEmployees: employees,
      displayTimeline: displayTimeline,
      filteredProjects: projectList,
      datesBrushed: rangeBrushed,
      totalProjectsMonths: totalMonths,
      filterPosition: filterPosition
    });
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
      skills={this.state.skills}
      overEvent={this.HighlightElements}
      outEvent={this.unHighlightElements}
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
