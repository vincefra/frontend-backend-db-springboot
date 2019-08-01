import React from 'react';
import VizCircle from './components/vizCircle/VizCircle';
import Legend from './components/legend/Legend';
import Dialogue from './components/dialogue/Dialogue';
import VizTimeline from './components/vizTimeline/VizTimeline';

import Header from './components/header/Header';
import Loader from './components/loader/Loader';
import { load, getLargestClients, getEmployeeObjs } from './components/general';
import {
  setHighlight,
  setHightLightElement,
  hightLightElementWithSkill,
  highLightProjectWithEmployeeId,
  getElementById,
  getSkillsIDsFromProject,
  getSkills,
  getEmployees,
  typeSelected
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
      employees: {},
      skills: {},
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
      dialogueInfo: {
        image: '',
        name: '',
        type: '',
        children: ''
      },
      elementOver: {
        type: 'none',
        info: null
      }
    };


    this.showSkill = (id) => {
      //hightlight projects and get clients from that project
      const ans = hightLightElementWithSkill(id, this.state.projects);
      const highLightClient = setHightLightElement(false, ans[0], this.state.clients, false);
      const employeesHighLight = hightLightElementWithSkill(id, this.state.employees.children);
      const highLightSkills = setHightLightElement(true, [id], this.state.skills.children, true);

      let employees = this.state.employees;
      employees.children = employeesHighLight;

      let skills = this.state.skills;
      skills.children = highLightSkills;
      this.setState({
        skills: skills,
        projects: ans[1],
        clients: highLightClient,
        employees: employees
      });
    };

    /**
     * 
     */
    this.showProject = (id) => {
      const project = getElementById(id, this.state.projects);
      const highLightEmployees = setHightLightElement(false, project.employeeId, this.state.employees.children, false);
      const highLightProjects = setHightLightElement(false, [id], this.state.projects, false);
      const highLightClient = setHightLightElement(false, [project.clientId], this.state.clients, false);
      const highLightSkills = getSkills(project.skills, this.state.skills.children);

      let employees = this.state.employees;
      employees.children = highLightEmployees;

      let skills = this.state.filteredSkills;
      skills.children = highLightSkills;


      this.setState({
        clients: highLightClient,
        filteredSkills: skills,
        projects: highLightProjects,
        employees: employees,
        elementOver: typeSelected['PRO']
      });


      const client = getElementById(project.clientId, this.state.clients);
      const children = <div>
        <p><span>Client: </span><br></br>{client.name}</p>
        <p><span>Starting date: </span><br></br>{project.dateInit.getDate() + '-' + (project.dateInit.getMonth() + 1) + '-' + project.dateInit.getFullYear()}</p>
        <p><span>Finishing date: </span><br></br>{project.dateEnd.getDate() + '-' + (project.dateEnd.getMonth() + 1) + '-' + project.dateEnd.getFullYear()}</p>
        <p><span>Description: </span>{project.description}</p>
      </div>;

      this.toggleDialogue();
      this.modifyDialogueInfo(null, project.name, project.type, children);

    };
    /**
     * 
     */
    this.showEmployee = (id) => {
      const employee = getElementById(id, this.state.employees.children);
      const highLightEmployees = setHightLightElement(false, [id], this.state.employees.children, false);
      const ans = highLightProjectWithEmployeeId(id, this.state.projects);
      const highLightClient = setHightLightElement(false, ans[0], this.state.clients, false);

      let employees = this.state.employees;
      employees.children = highLightEmployees;


      this.toggleDialogue();

      this.setState({
        employees: employees,
        projects: ans[1],
        clients: highLightClient,
        elementOver: typeSelected['EMP']
      });


      //get employee
      const children = <div>
        <p><span>Date in: </span><br></br>{employee.initDate}</p>
        <p><span>Date out: </span><br></br>{employee.endDate}</p>
      </div>;

      this.modifyDialogueInfo(employee.img, employee.name, employee.roll, children);
    };
    /**
     * 
     */
    this.showClient = (id) => {
      this.newMethod(id);
      this.toggleDialogue();

      const client = getElementById(id, this.state.clients);
      const clientEmployees = getEmployees(client.projects, this.state.projects, this.state.employees);
      const highLightClient = setHightLightElement(false, [id], this.state.clients, false);
      const highLightEmployees = setHightLightElement(false, clientEmployees, this.state.employees.children, false);
      const highlightProjects = setHightLightElement(false, client.projects, this.state.projects, false);
      const skillsId = getSkillsIDsFromProject(id, this.state.projects, client);
      const highLightSkills = getSkills(skillsId, this.state.skills.children);

      let employees = this.state.employees;
      employees.children = highLightEmployees;

      let skills = this.state.filteredSkills;
      skills.children = highLightSkills;
      this.setState({
        // filteredSkills: skills,
        employees: employees,
        projects: highlightProjects,
        clients: highLightClient,
        elementOver: typeSelected['CLI']
      });


      const children = <div>
        <p><span>Location: </span><br></br>{client.location}</p>
        <p><span>Description: </span><br></br>{client.description}</p>
      </div>;

      this.modifyDialogueInfo(client.logo, client.name, client.type, children);
    };



    this.unHighlightElements = () => {
      if (this.state.dialogueIsShown) this.toggleDialogue();
      const unHighlightClients = setHighlight(true, this.state.clients);
      const unHighLightProject = setHighlight(true, this.state.projects);
      const highLightEmployees = setHighlight(true, this.state.employees.children);

      let employees = this.state.employees;
      employees.children = highLightEmployees;
      let skills = this.state.filteredSkills;
      skills.children = [];

      this.setState({
        clients: unHighlightClients,
        filteredSkills: skills,
        projects: unHighLightProject,
        employees: employees,
        elementOver: typeSelected['NON']
      });
    };

    this.toggleDialogue = () => {
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
    this.brushDates = (initWeek, endWeek) => {
      const brushDate = new Date(this.state.initialDates[0]);

      const initalDate = new Date(brushDate.setMonth(brushDate.getMonth() + initWeek));
      const endingDate = new Date(brushDate.setMonth(brushDate.getMonth() + endWeek));
      this.setState({
        datesBrushed: [initalDate, endingDate]
      });

      const brushedProjects = this.state.projects.map(project => {
        project.inTimeRange = this.checkInTimeRange(project.dateInit, project.dateEnd, initalDate, endingDate);
        return project;
      });


      this.setState({
        datesBrushed: [initalDate, endingDate],
        projects: brushedProjects
      });
    };

    this.HighlightElements = (name) => {
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

  }

  newMethod(id) {
    // console.log(id);
  }

  checkInTimeRange(prjInitDate, prjEndDate, brushInit, brushEnd) {
    // const inRange = (prjInitDate.getTime() >= brushInit.getTime() && prjInitDate.getTime() <= brushEnd.getTime()) ? true : false;
    const endRange = prjEndDate.getTime() <= brushEnd.getTime() ? true : false;
    // console.log(prjInitDate.getTime(), brushInit.getTime(), prjInitDate.getTime() >= brushInit.getTime());
    // console.log(prjInitDate.getMonth(), brushInit.getMonth(), prjInitDate.getMonth() >= brushInit.getMonth());

    // const inRange = (objRange[0].getTime() >= this.state.datesBrushed[0].getTime() && objRange[0].getTime() <= this.state.datesBrushed[1].getTime())
    //   && (objRange[1].getTime() <= this.state.datesBrushed[1].getTime() && objRange[1].getTime() >= this.state.datesBrushed[0].getTime()) ? true : false;
    return endRange;

  }


  unhightLightElements(name) {
    if (name === 'EMPLOYEES') {
      const children = setHighlight(false, this.state.employees.children);
      const employees = this.state.employees;
      employees.children = children;
      this.setState({ employees: employees });
    } else if (name === 'CLIENTS') {
      const clients = setHighlight(false, this.state.clients);
      this.setState({ clients: clients });
    } else if (name === 'PROJECTS') {
      const projects = setHighlight(false, this.state.projects);
      this.setState({ projects: projects });
    } else if (name === 'SKILLS') {
      const children = setHighlight(false, this.state.skills.children);
      const skills = this.state.skills;
      skills.children = children;
      this.setState({ skills: skills });
    }
  }

  modifyDialogueInfo(image, name, typeWork, children) {
    const dialogueInfo = {
      image: image === null ? null : image,
      name: name,
      type: typeWork,
      children: children
    };

    this.setState({ dialogueInfo: dialogueInfo });

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
    //{TO DO} TAKE THIS CALCULATION AOUTISDE
    const min = d3.min(projectList, d => d.dateInit);
    const max = d3.max(projectList, d => d.dateEnd);
    const selectedRange = [min, max];
    let totalMonths = d3.timeMonth.count(min, max);
    console.log(employeeList);
    this.setState({
      initialDates: selectedRange,
      datesBrushed: selectedRange,
      totalProjectsMonths: totalMonths, //SET UP INITIAL DATA FILTER
      isLoading: false,
      clients: categories,
      projects: projectList,
      employees: {
        name: 'employees',
        children: employeeList
      },
      skills: {
        name: 'Front-End',
        children: technologyList
      },
      filteredClients: clientList,
      filteredProjects: [],
      filteredEmployees: {
        name: 'employees',
        children: employeeList
      },
      filteredSkills: [],
      range: selectedRange,
      clickedClient: categories
    });
  }

  resize() {
    this.setState({ isMobileView: window.innerWidth <= 1180 });
  }

  breadcrumbClick = clients => {
    this.setState({
      clients,
      clickedClient: []
    });
  }

  clientClick = client => { 
    const employees = getEmployeeObjs(client.employees, this.state.employees.children);
    if (client.type === 'client') 
      this.setState({ 
        clients: [client], 
        clickedClient: [client],
        filteredEmployees: {
          name: 'employees',
          children: employees
        } 
      });
    else {
      const clientList = getLargestClients(client.list);
      this.setState({ 
        clients: clientList, 
        clickedClient: clientList,
        filteredEmployees: {
          name: 'employees',
          children: employees
        } 
      });
    }
    console.log(client);
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
      breadcrumbClick={this.breadcrumbClick}
    />;
    const legend = <Legend
      clients={this.state.clients}
      projects={this.state.projects}
      employees={this.state.filteredEmployees}
      skills={this.state.skills}
      overEvent={this.HighlightElements}
      outEvent={this.unHighlightElements}
    />;
    const dialogue = <Dialogue
      dialogueIsShown={this.state.dialogueIsShown}
      toggleDialogue={this.toggleDialogue}
      image={this.state.dialogueInfo.image}
      name={this.state.dialogueInfo.name}
      type={this.state.dialogueInfo.type}
      childrenInfo={this.state.dialogueInfo.children}
    />;
    const timeline = <VizTimeline
      projects={this.state.projects}
      size={this.state.size}
      selectProject={this.showProject}
      mouseOutProject={this.unHighlightElements}
      modifyRange={this.brushDates}
      ranges={this.state.initialDates}
      totalProjectsMonths={this.state.totalProjectsMonths}

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
      clientClick={this.clientClick}
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
