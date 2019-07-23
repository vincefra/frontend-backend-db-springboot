import React from 'react';
import VizCircle from './components/vizCircle/VizCircle';
import Legend from './components/legend/Legend';
import Dialogue from './components/dialogue/Dialogue';
import TimeLine from './components/vizTimeline/TimeLine';
import Header from './components/header/Header';
import Loader from './components/loader/Loader';
import { load } from './components/general';
import * as d3 from 'd3';
//width and height of the SVG visualization
const width = window.innerWidth;
const height = window.innerHeight;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: clients,
      projects: projects,
      employees: employees,
      skills: skills,
      size: [width, height],
      isLoading: true,
      isMobileView: false,
      dialogueIsShown: false,
      range: []
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


    };

    this.showEmployee = (id) => {
      this.highLightEmployee([id]);
      this.showEmployeeInfo(id);
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

    this.modifyRange = (initDate, endDate) => {

      console.log(initDate, endDate);
    };

    this.HighlightElements = (name) => {
      switch (name) {
        case 'EMPLOYEES':
          console.log('show employees');
          this.unhightLightElements('CLIENTS');
          this.unhightLightElements('PROJECTS');
          this.unhightLightElements('SKILLS');
          console.log(clients);
          break;
        case 'CLIENTS':
          console.log('show clients');
          this.unhightLightElements('EMPLOYEES');
          this.unhightLightElements('PROJECTS');
          this.unhightLightElements('SKILLS');
          break;
        case 'PROJECTS':
          console.log('show projects');
          this.unhightLightElements('EMPLOYEES');
          this.unhightLightElements('SKILLS');
          break;
        case 'SKILLS':
          console.log('show skills');
          this.unhightLightElements('EMPLOYEES');
          this.unhightLightElements('CLIENTS');
          this.unhightLightElements('PROJECTS');
          break;
        default:
          console.log('nothing to show');
          this.unHighlightElements();
      }

    };
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


  showEmployeeInfo(id) {
    console.log('show this guy info');
  }

  getEmployeeById(id) {
    const employee = this.state.employees.children.filter(d => d.id === id ? d : null)[0]; //get client id
    return employee;
  }

  getClientById(id) {
    const client = this.state.clients.filter(d => d.id === id ? d : null)[0]; //get client id
    return client;
  }

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
    const projects = this.state.projects;
    const min = d3.min(projects, d => d.dateInit);
    const max = d3.max(projects, d => d.dateEnd);
    const selectedRange = [min, max];
    this.setState({ range: selectedRange });

    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
    this.setState({ isLoading: true });
    await load();
    this.setState({ isLoading: false });


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

    const header = <Header />;
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
    />;
    const timeline = <TimeLine
      projects={this.state.projects}
      size={this.state.size}
      selectProject={this.showProject}
      mouseOutProject={this.unHighlightElements}
      modifyRange={this.modifyRange}
      range={this.state.range}

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

function randomSKills(num) {
  let randomNums = [];
  for (let i = 0; i < num; i++) {

    const randNum = Math.floor(Math.random() * 57) + 1;
    randomNums.push(randNum);
  }
  return randomNums;
}

const skills = {
  name: 'Front-End',
  children: [
    {
      id: 0,
      highlight: true,
      name: 'Java'
    },
    {
      id: 1,
      highlight: true,
      name: 'Angular'
    },
    {
      id: 3,
      highlight: true,
      name: 'jQuery'
    },
    {
      id: 4,
      highlight: true,
      name: 'Underscore'
    },
    {
      id: 5,
      highlight: true,
      name: 'Hibernate'
    },
    {
      id: 6,
      highlight: true,
      name: 'MySQL'
    },
    {
      id: 7,
      highlight: true,
      name: 'Python'
    },
    {
      id: 8,
      highlight: true,
      name: 'REST'
    },
    {
      id: 9,
      highlight: true,
      name: 'Git'
    },
    {
      id: 10,
      highlight: true,
      name: 'test automation'
    },
    {
      id: 11,
      highlight: true,
      name: 'Jenkins'
    },
    {
      id: 12,
      highlight: true,
      name: 'GORM'
    },
    {
      id: 13,
      highlight: true,
      name: 'MongoDB'
    },
    {
      id: 14,
      highlight: true,
      name: 'Spock'
    },
    {
      id: 15,
      highlight: true,
      name: 'pivotaltracker'
    },
    {
      id: 16,
      highlight: true,
      name: 'Subversion'
    },
    {
      id: 17,
      highlight: true,
      name: 'IntelliJ IDEA'
    },
    {
      id: 18,
      highlight: true,
      name: 'Slack'
    },
    {
      id: 19,
      highlight: true,
      name: 'MAMP'
    },
    {
      id: 20,
      highlight: true,
      name: 'Postman'
    },
    {
      id: 21,
      highlight: true,
      name: 'Trello'
    },
    {
      id: 22,
      highlight: true,
      name: 'MySQL'
    },
    {
      id: 23,
      highlight: true,
      name: 'workbench'
    },
    {
      id: 24,
      highlight: true,
      name: 'Java SE'
    },
    {
      id: 25,
      highlight: true,
      name: 'Springboot'
    },
    {
      id: 26,
      highlight: true,
      name: 'JPA (Hibernate)'
    },
    {
      id: 27,
      highlight: true,
      name: 'Vue.js'
    },
    {
      id: 28,
      highlight: true,
      name: 'Vuetify.js'
    },
    {
      id: 29,
      highlight: true,
      name: 'MySQL'
    },
    {
      id: 30,
      highlight: true,
      name: 'Vuex'
    },
    {
      id: 31,
      highlight: true,
      name: 'Travis CI'
    },
    {
      id: 32,
      highlight: true,
      name: 'Maven'
    },
    {
      id: 33,
      highlight: true,
      name: 'Bash'
    },
    {
      id: 34,
      highlight: true,
      name: 'Atlassian SDK'
    },
    {
      id: 35,
      highlight: true,
      name: 'GORM'
    },
    {
      id: 36,
      highlight: true,
      name: 'MongoDB'
    },
    {
      id: 37,
      highlight: true,
      name: 'Spock'
    },
    {
      id: 38,
      highlight: true,
      name: 'pivotaltracker'
    },
    {
      id: 39,
      highlight: true,
      name: 'Subversion'
    },
    {
      id: 40,
      highlight: true,
      name: 'IntelliJ IDEA'
    },
    {
      id: 41,
      highlight: true,
      name: 'Slack'
    },
    {
      id: 42,
      highlight: true,
      name: 'MAMP'
    },
    {
      id: 43,
      highlight: true,
      name: 'Postman'
    },
    {
      id: 44,
      highlight: true,
      name: 'Trello'
    },
    {
      id: 45,
      highlight: true,
      name: 'MySQL'
    },
    {
      id: 46,
      highlight: true,
      name: 'workbench'
    },
    {
      id: 47,
      highlight: true,
      name: 'Java SE'
    },
    {
      id: 48,
      highlight: true,
      name: 'Springboot'
    },
    {
      id: 49,
      highlight: true,
      name: 'JPA (Hibernate)'
    },
    {
      id: 50,
      highlight: true,
      name: 'Vue.js'
    },
    {
      id: 51,
      highlight: true,
      name: 'Vuetify.js'
    },
    {
      id: 52,
      highlight: true,
      name: 'MySQL'
    },
    {
      id: 53,
      highlight: true,
      name: 'Vuex'
    },
    {
      id: 54,
      highlight: true,
      name: 'Travis CI'
    },
    {
      id: 55,
      highlight: true,
      name: 'Maven'
    },
    {
      id: 56,
      highlight: true,
      name: 'Bash'
    },
    {
      id: 57,
      highlight: true,
      name: 'Atlassian SDK'
    }
  ]
};

const employees = {
  name: 'employees',
  children: [
    {
      id: 0,
      name: 'Peter Roos',
      highlight: true,
      roll: 'Management',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/Anki_Andersson.jpg'
    },
    {
      id: 1,
      name: 'Dag Rende',
      highlight: true,
      roll: 'Management',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/Bjorn_Arnelid.jpg'
    },
    {
      id: 2,
      name: 'Fredik Ejhed',
      highlight: true,
      roll: 'Management',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/Christopher_Saarinen_Big.jpg'
    },
    {
      id: 3,
      name: 'Staffan Nystrom',
      highlight: true,
      roll: 'Management',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/cynthia_smith.jpg'
    },
    {
      id: 4,
      name: 'Malin Pålsson',
      highlight: true,
      roll: 'Management',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/dag.jpg'
    },
    {
      id: 5,
      name: 'Andreas	Arledal',
      highlight: true,
      roll: 'Management',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/David_Kupersmidt.jpg'
    },
    {
      id: 6,
      name: 'Peter Roos',
      highlight: true,
      roll: 'Management',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/Anki_Andersson.jpg'
    },
    {
      id: 7,
      name: 'Dag Rende',
      highlight: true,
      roll: 'Management',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/Bjorn_Arnelid.jpg'
    },
    {
      id: 8,
      name: 'Fredik Ejhed',
      highlight: true,
      roll: 'Management',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/Christopher_Saarinen_Big.jpg'
    },
    {
      id: 9,
      name: 'Staffan Nystrom',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/cynthia_smith.jpg'
    },
    {
      id: 10,
      name: 'Malin Pålsson',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/dag.jpg'
    },
    {
      id: 11,
      name: 'Andreas	Arledal',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/David_Kupersmidt.jpg'
    },
    {
      id: 12,
      name: 'Peter Roos',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/Anki_Andersson.jpg'
    },
    {
      id: 13,
      name: 'Dag Rende',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/Bjorn_Arnelid.jpg'
    },
    {
      id: 14,
      name: 'Fredik Ejhed',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/Christopher_Saarinen_Big.jpg'
    },
    {
      id: 15,
      name: 'Staffan Nystrom',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/cynthia_smith.jpg'
    },
    {
      id: 16,
      name: 'Malin Pålsson',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/dag.jpg'
    },
    {
      id: 17,
      name: 'Andreas	Arledal',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/David_Kupersmidt.jpg'
    },
    {
      id: 18,
      name: 'Peter Roos',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/Anki_Andersson.jpg'
    },
    {
      id: 19,
      name: 'Dag Rende',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/Bjorn_Arnelid.jpg'
    },
    {
      id: 20,
      name: 'Fredik Ejhed',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/Christopher_Saarinen_Big.jpg'
    },
    {
      id: 21,
      name: 'Staffan Nystrom',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/cynthia_smith.jpg'
    },
    {
      id: 22,
      name: 'Malin Pålsson',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/dag.jpg'
    },
    {
      id: 23,
      name: 'Andreas	Arledal',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/David_Kupersmidt.jpg'
    },
    {
      id: 24,
      name: 'Peter Roos',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/Anki_Andersson.jpg'
    },
    {
      id: 25,
      name: 'Dag Rende',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/Bjorn_Arnelid.jpg'
    },
    {
      id: 26,
      name: 'Fredik Ejhed',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/Christopher_Saarinen_Big.jpg'
    },
    {
      id: 27,
      name: 'Staffan Nystrom',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/cynthia_smith.jpg'
    },
    {
      id: 28,
      name: 'Malin Pålsson',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/dag.jpg'
    },
    {
      id: 29,
      name: 'Andreas	Arledal',
      highlight: true,
      roll: 'Konsulter',
      skills: randomSKills(Math.floor(Math.random() * 20)),
      img: 'img/David_Kupersmidt.jpg'
    }
  ]
};

const clients = [
  {
    id: 1,
    name: 'H&M',
    hours: 2704659,
    color: '#e00026',
    logo: '/img/logos/h&m.png',
    highlight: true,
    projects: [1, 2]
  },
  {
    id: 2,
    name: 'Ericcson',
    hours: 4499890,
    color: '#002661',
    logo: '/img/logos/ericsson.png',
    highlight: true,
    projects: [3, 4]
  },
  {
    id: 3,
    name: 'Atlas',
    hours: 2159981,
    color: '#0098be',
    logo: '/img/logos/Atlas_Copco.png',
    highlight: true,
    projects: [5, 6]
  },
  {
    id: 4,
    name: 'Thales',
    hours: 3853788,
    color: '#242a75',
    logo: '/img/logos/maquet.png',
    highlight: true,
    projects: [7, 8]
  },
  {
    id: 5,
    name: 'Maquet',
    hours: 14106543,
    color: '#005aaa',
    logo: '/img/logos/maquet.png',
    highlight: true,
    projects: [9, 10]
  },
  {
    id: 6,
    name: 'Tele2',
    hours: 8819342,
    color: '#141414',
    logo: '/img/logos/tele2.png',
    highlight: true,
    projects: [11, 12]
  },
  {
    id: 7,
    name: 'Thales',
    hours: 4499890,
    color: '#00009f',
    logo: '/img/logos/thales.png',
    highlight: true,
    projects: [13, 14]
  },
  {
    id: 8,
    name: 'Saab',
    hours: 6122463,
    color: '#a20031',
    logo: '/img/logos/saab.png',
    highlight: true,
    projects: [15, 16]
  }
];
const projects = [
  {
    id: 1,
    clientId: 1,
    employeeId: [1, 2, 3],
    color: '#e00026',
    name: 'name',
    dateInit: new Date('2004-01-01'),
    dateEnd: new Date('2004-03-01'),
    hours: 10,
    skills: randomSKills(Math.floor(Math.random() * 20)),
    highlight: true
  },
  {
    id: 2,
    clientId: 1,
    employeeId: [1, 5, 8, 2, 3],
    color: '#e00026',
    name: 'name',
    dateInit: new Date('2004-01-01'),
    dateEnd: new Date('2004-04-01'),
    hours: 10,
    skills: randomSKills(Math.floor(Math.random() * 20)),
    highlight: true
  },
  {
    id: 3,
    clientId: 2,
    employeeId: [1],
    color: '#002661',
    name: 'name',
    dateInit: new Date('2004-04-01'),
    dateEnd: new Date('2004-06-01'),
    hours: 20,
    skills: randomSKills(Math.floor(Math.random() * 20)),
    highlight: true
  },
  {
    id: 4,
    clientId: 2,
    employeeId: [10, 6, 5],
    color: '#002661',
    name: 'name',
    dateInit: new Date('2004-06-01'),
    dateEnd: new Date('2004-10-01'),
    hours: 90,
    skills: randomSKills(Math.floor(Math.random() * 20)),
    highlight: true
  },
  {
    id: 5,
    clientId: 3,
    employeeId: [11, 12, 3],
    color: '#0098be',
    name: 'name',
    dateInit: new Date('2004-01-01'),
    dateEnd: new Date('2004-04-01'),
    hours: 100,
    skills: randomSKills(Math.floor(Math.random() * 20)),
    highlight: true
  },
  {
    id: 6,
    clientId: 3,
    employeeId: [29, 14, 20],
    name: 'name',
    color: '#0098be',
    dateInit: new Date('2004-03-01'),
    dateEnd: new Date('2004-06-01'),
    hours: 100,
    skills: randomSKills(Math.floor(Math.random() * 20)),
    highlight: true
  },
  {
    id: 7,
    clientId: 4,
    employeeId: [12, 28, 15],
    color: '#242a75',
    name: 'name',
    dateInit: new Date('2004-06-01'),
    dateEnd: new Date('2004-12-01'),
    hours: 10,
    skills: randomSKills(Math.floor(Math.random() * 20)),
    highlight: true
  },
  {
    id: 8,
    clientId: 4,
    employeeId: [15],
    name: 'name',
    color: '#242a75',
    dateInit: new Date('2005-01-01'),
    dateEnd: new Date('2005-04-01'),
    hours: 50,
    skills: randomSKills(Math.floor(Math.random() * 20)),
    highlight: true
  },
  {
    id: 9,
    clientId: 5,
    employeeId: [29, 1, 15],
    color: '#005aaa',
    name: 'name',
    dateInit: new Date('2005-02-01'),
    dateEnd: new Date('2005-08-01'),
    hours: 300,
    skills: randomSKills(Math.floor(Math.random() * 20)),
    highlight: true
  },
  {
    id: 10,
    clientId: 5,
    employeeId: [28, 25, 1, 4, 5, 7, 8, 9],
    name: 'name',
    color: '#005aaa',
    dateInit: new Date('2005-07-01'),
    dateEnd: new Date('2005-12-01'),
    hours: 140,
    skills: randomSKills(Math.floor(Math.random() * 20)),
    highlight: true
  },
  {
    id: 11,
    clientId: 6,
    employeeId: [1, 2, 3, 15, 16, 18],
    color: '#141414',
    name: 'name',
    dateInit: new Date('2006-01-01'),
    dateEnd: new Date('2006-12-01'),
    hours: 40,
    skills: randomSKills(Math.floor(Math.random() * 20)),
    highlight: true
  },
  {
    id: 12,
    clientId: 6,
    employeeId: [1, 2, 3, 9, 4, 19],
    name: 'name',
    color: '#141414',
    dateInit: new Date('2007-01-01'),
    dateEnd: new Date('2007-03-01'),
    hours: 200,
    skills: randomSKills(Math.floor(Math.random() * 20)),
    highlight: true
  },
  {
    id: 13,
    clientId: 7,
    employeeId: [14, 9, 13],
    color: '#00009f',
    name: 'name',
    dateInit: new Date('2007-03-01'),
    dateEnd: new Date('2007-05-01'),
    hours: 80,
    skills: randomSKills(Math.floor(Math.random() * 20)),
    highlight: true
  },
  {
    id: 14,
    clientId: 7,
    employeeId: [29, 5],
    name: 'name',
    color: '#00009f',
    dateInit: new Date('2007-06-01'),
    dateEnd: new Date('2007-09-01'),
    hours: 10,
    skills: randomSKills(Math.floor(Math.random() * 20)),
    highlight: true
  },
  {
    id: 15,
    clientId: 8,
    employeeId: [6, 12, 15, 18, 21],
    color: '#a20031',
    name: 'name',
    dateInit: new Date('2007-01-01'),
    dateEnd: new Date('2007-03-01'),
    hours: 100,
    skills: randomSKills(Math.floor(Math.random() * 20)),
    highlight: true
  },
  {
    id: 16,
    clientId: 8,
    employeeId: [1],
    name: 'name',
    color: '#a20031',
    dateInit: new Date('2007-02-01'),
    dateEnd: new Date('2007-04-01'),
    hours: 100,
    skills: randomSKills(Math.floor(Math.random() * 20)),
    highlight: true
  }
];


export default App;
