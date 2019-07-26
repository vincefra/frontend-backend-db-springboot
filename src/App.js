import React from 'react';
import VizCircle from 'components/vizCircle/VizCircle';
import Legend from 'components/legend/Legend';
import Dialogue from 'components/dialogue/Dialogue';
import VizTimeline from 'components/vizTimeline/VizTimeline';
import Header from 'components/header/Header';
import Loader from 'components/loader/Loader';
import { load } from 'components/general';
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
      }
    };

    this.showSkill = (id) => {
      this.highLightSkills([id]);
      this.hightLightProjectsWithSkill(id);
      this.hightEmployeesWithSkills(id);
      //hightlight employees with that skill
    };

    this.showProject = (id) => {
      const project = this.getProjectById(id);
      this.highLightEmployee(project.employeeId);
      this.highLightClient([project.clientId]);
      this.highLightSkills(project.skills);
      this.highLightProject([id]);
      this.toggleDialogue();

      const client = this.getClientById(project.clientId);
      const children = <div>
        <p><span>Client: </span><br></br>{client.name}</p>
        <p><span>Starting date: </span><br></br>{project.dateInit.getDate() + '-' + (project.dateInit.getMonth() + 1) + '-' + project.dateInit.getFullYear()}</p>
        <p><span>Finishing date: </span><br></br>{project.dateEnd.getDate() + '-' + (project.dateEnd.getMonth() + 1) + '-' + project.dateEnd.getFullYear()}</p>
        <p><span>Description: </span>{project.description}</p>
      </div>;


      this.modifyDialogueInfo(null, project.name, project.type, children);

    };

    this.showEmployee = (id) => {
      this.highLightEmployee([id]);
      this.toggleDialogue();
      //highlight projects where the employee is in
      let clients = [];
      const projects = this.state.projects.map(d => {
        if (!d.employeeId.includes(id)) {
          d.highlight = false;
        } else {
          clients.push(d.clientId);
        }
        return d;
      });
      const uniqueClientsSet = new Set(clients);
      clients = [...uniqueClientsSet];
      this.setState({ projects: projects });

      //TO DO highlight clientes where the employee is in
      this.highLightClient(clients);
      //TO DO hightlights employee skills
      //get employee
      const employee = this.getEmployeeById(id);

      const children = <div>
        <p><span>Date in: </span><br></br>{employee.initDate}</p>
        <p><span>Date out: </span><br></br>{employee.endDate}</p>
      </div>;

      this.modifyDialogueInfo(employee.img, employee.name, employee.roll, children);
      this.highLightSkills(employee.skills);
    };

    this.showClient = (id) => {
      this.highLightClient([id]);
      this.toggleDialogue();

      //hightlight all the projects related to the client
      const client = this.getClientById(id);
      this.highLightProject(client.projects);

      //highlight all the employees related to the client
      let employeesId = [];
      let skillsId = [];
      const projects = this.state.projects.filter(prj => {
        return ~client.projects.indexOf(prj.id);
      });
      //get the employeesId from the project and add it to the array of employeesId of the client
      for (let i in projects) {
        skillsId = skillsId.concat(projects[i].skills);
        employeesId = employeesId.concat(projects[i].employeeId);
      }
      skillsId = [...new Set(skillsId)];
      this.highLightSkills(skillsId);
      //highlight employeesId
      this.highLightEmployee(employeesId);
      //show client information
      const children = <div>
        <p><span>Location: </span><br></br>{client.location}</p>
        <p><span>Description: </span><br></br>{client.description}</p>
      </div>;

      this.modifyDialogueInfo(client.logo, client.name, client.type, children);
    };

    this.unHighlightElements = () => {
      this.unHighLightEmployees();
      this.unHighLightProject();
      this.unHighlightClients();
      if (this.state.dialogueIsShown) this.toggleDialogue();
      this.unHighlightSKills();
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

  checkInTimeRange(prjInitDate, prjEndDate, brushInit, brushEnd) {
    const inRange = (prjInitDate.getTime() >= brushInit.getTime() && prjInitDate.getTime() <= brushEnd.getTime()) ? true : false;
    const endRange = prjEndDate.getTime() <= brushEnd.getTime() ? true : false;
    // console.log(prjInitDate.getTime(), brushInit.getTime(), prjInitDate.getTime() >= brushInit.getTime());
    // console.log(prjInitDate.getMonth(), brushInit.getMonth(), prjInitDate.getMonth() >= brushInit.getMonth());

    // const inRange = (objRange[0].getTime() >= this.state.datesBrushed[0].getTime() && objRange[0].getTime() <= this.state.datesBrushed[1].getTime())
    //   && (objRange[1].getTime() <= this.state.datesBrushed[1].getTime() && objRange[1].getTime() >= this.state.datesBrushed[0].getTime()) ? true : false;
    return endRange;

  }


  unhightLightElements(name) {
    if (name === 'EMPLOYEES') {
      const children = this.state.employees.children.map(d => {
        d.highlight = false;
        return d;
      });
      const employees = this.state.employees;
      employees.children = children;
      this.setState({ employees: employees });
    } else if (name === 'CLIENTS') {
      const clients = this.state.clients.map(d => {
        d.highlight = false;
        return d;
      });
      this.setState({ clients: clients });
    } else if (name === 'PROJECTS') {
      const projects = this.state.projects.map(d => {
        d.highlight = false;
        return d;
      });
      this.setState({ projects: projects });
    } else if (name === 'SKILLS') {
      const children = this.state.skills.children.map(d => {
        d.highlight = false;
        return d;
      });
      const skills = this.state.skills;
      skills.children = children;
      this.setState({ skills: skills });
    }
  }

  hightEmployeesWithSkills(id) {
    let employees = this.state.employees;
    const employeesHighLight = employees.children.map(d => {
      if (d.skills.includes(id)) {
        d.highlight = true;
      } else {
        d.highlight = false;
      }
      return d;
    });

    employees.children = employeesHighLight;
    this.setState({ employees: employees });
  }
  hightLightProjectsWithSkill(id) {
    let clients = [];
    //modify all projects with id
    const projectsHighLight = this.state.projects.map(d => {
      if (d.skills.includes(id)) {
        d.highlight = true;
        if (!clients.includes(d.clientId)) clients.push(d.clientId);
      } else {
        d.highlight = false;
      }
      return d;
    });
    this.setState({ projects: projectsHighLight });
    //hightlight clients with that skill in
    this.highLightClient(clients);
  }
  unHighlightSKills() {
    const highLightSkills = this.state.skills.children.map(d => {
      d.highlight = true;
      return d;
    });
    this.setState({ skill: highLightSkills });
  }

  unHighlightClients() {
    const highLightClients = this.state.clients.map(d => {
      d.highlight = true;
      return d;
    });
    this.setState({ clients: highLightClients });
  }

  unHighLightEmployees() {
    const highLightEmployees = this.state.employees.children.map(d => {
      d.highlight = true;
      return d;
    });
    let employees = this.state.employees;
    employees.children = highLightEmployees;
    this.setState({ employees: employees });
  }

  unHighLightProject() {
    const highLightProjects = this.state.projects.map(d => {
      d.highlight = true;
      return d;
    });
    this.setState({ projects: highLightProjects });
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

  getEmployeeById(id) {
    const employee = this.state.employees.children.filter(d => d.id === id ? d : null)[0]; //get client id
    return employee;
  }

  getClientById(id) {
    const client = this.state.clients.filter(d => d.id === id ? d : null)[0]; //get client id
    return client;
  }
  /**
   * Return a project from the state if it matches the given ID
   *
   * @param id The number of ID to compare 
   */
  getProjectById(id) {
    const project = this.state.projects.filter(d => d.id === id ? d : null)[0]; //get project id
    return project;
  }

  highLightClient(idArray) {
    const highLightClients = this.state.clients.map(d => {
      if (!idArray.includes(d.id)) {
        d.highlight = false;
      }
      return d;
    });

    this.setState({ clients: highLightClients });
  }

  highLightEmployee(idArray) {
    const highLightEmployees = this.state.employees.children.map(d => {
      if (!idArray.includes(d.id)) {
        d.highlight = false;
      }
      return d;
    });
    let employees = this.state.employees;
    employees.children = highLightEmployees;
    this.setState({ employees: employees });

  }

  highLightSkills(idArray) {
    const highLightSkills = this.state.skills.children.map(d => {
      if (!idArray.includes(d.id)) {
        d.highlight = false;
      }
      return d;
    });
    let skills = this.state.skills;
    skills.children = highLightSkills;
    this.setState({ skills: skills });
  }

  //modifies the highlight state  of the projects to TRUE
  //modifies previous highlight projects to FALSE
  highLightProject(idArray) {
    const highLightProjects = this.state.projects.map(d => {
      if (!idArray.includes(d.id)) {
        d.highlight = false;
      }
      return d;
    });
    this.setState({ projects: highLightProjects });
  }



  async componentDidMount() {


    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
    this.setState({ isLoading: true });
    const data = await load();
    const projects = data.projectList;
    const min = d3.min(projects, d => d.dateInit);
    const max = d3.max(projects, d => d.dateEnd);
    const selectedRange = [min, max];
    let totalMonths = d3.timeMonth.count(min, max);
    this.setState({
      initialDates: selectedRange,
      datesBrushed: selectedRange,
      totalProjectsMonths: totalMonths
    });

    this.setState({
      isLoading: false,
      clients: data.clientList,
      projects: data.projectList,
      employees: {
        name: 'employees',
        children: data.employeeList
      },
      skills: {
        name: 'Front-End',
        children: data.technologyList
      },
      range: selectedRange
    });
    // await load();
    // this.setState({ isLoading: false });


  }

  resize() {
    this.setState({ isMobileView: window.innerWidth <= 1180 });
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
    />;
    const legend = <Legend
      clients={this.state.clients}
      projects={this.state.projects}
      employees={this.state.employees}
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
      employees={this.state.employees}
      projects={this.state.projects}
      size={this.state.size}
      skills={this.state.skills}
      mouseOnClient={this.showClient}
      mouseOnEmployee={this.showEmployee}
      mouseOnProject={this.showProject}
      mouseOnSKill={this.showSkill}
      unHighlightElements={this.unHighlightElements}
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
