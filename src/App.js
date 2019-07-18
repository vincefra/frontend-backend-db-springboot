import React from 'react';
import VizCircle from './components/vizCircle/VizCircle';
import Legend from './components/legend/Legend';
import Dialogue from './components/dialogue/Dialogue';
import TimeLine from './components/vizTimeline/TimeLine';
import Header from './components/header/Header';
import Loader from './components/loader/Loader';
import { load } from './components/general';
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
      isLoading: false,
      isMobileView: false,
    };

    this.showProjectInfo = (id) => {
      this.getProjectById(id);
      this.highLightProject(id);
    };

    this.unHighLightProject = () => {
      console.log("hey")
      const highLightProjects = this.state.projects.map(d => {
        d.highlight = true;
        return d;
      });
      this.setState({ projects: highLightProjects });
    };

  }

  getProjectById(id) {
    // const project = this.state.projects.filter(d => d.id === id ? d : null); //get project id
    //TO DO: unhighlight previus items
    //modify the project highlight state in the projects array to true

  }

  //modifies the highlight state  of the projects to TRUE
  //modifies previous highlight projects to FALSE
  highLightProject(id) {
    const highLightProjects = this.state.projects.map(d => {
      if (d.id === id) {
        d.highlight = true;
      } else {
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

    return (
      <React.Fragment>
        {this.state.isMobileView ? mobileView : this.state.isLoading ? <Loader /> :
          <React.Fragment>
            <Header />
            <Legend
              clients={this.state.clients}
              projects={this.state.projects}
              employees={this.state.employees}
              skills={this.state.skills}
            />
            <Dialogue />
            <TimeLine
              projects={this.state.projects}
              size={this.state.size}
              selectProject={this.showProjectInfo}
              mouseOutProject={this.unHighLightProject}
            />
            <VizCircle
              clients={this.state.clients}
              employees={this.state.employees}
              size={this.state.size}
              skills={this.state.skills}
            />

          </React.Fragment>
        }
      </React.Fragment>
    );
  }
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
      img: 'img/Anki_Andersson.jpg'
    },
    {
      id: 1,
      name: 'Dag Rende',
      highlight: true,
      img: 'img/Bjorn_Arnelid.jpg'
    },
    {
      id: 2,
      name: 'Fredik Ejhed',
      highlight: true,
      img: 'img/Christopher_Saarinen_Big.jpg'
    },
    {
      id: 3,
      name: 'Staffan Nystrom',
      highlight: true,
      img: 'img/cynthia_smith.jpg'
    },
    {
      id: 4,
      name: 'Malin Pålsson',
      highlight: true,
      img: 'img/dag.jpg'
    },
    {
      id: 5,
      name: 'Andreas	Arledal',
      highlight: true,
      img: 'img/David_Kupersmidt.jpg'
    },
    {
      id: 0,
      name: 'Peter Roos',
      highlight: true,
      img: 'img/Anki_Andersson.jpg'
    },
    {
      id: 1,
      name: 'Dag Rende',
      highlight: true,
      img: 'img/Bjorn_Arnelid.jpg'
    },
    {
      id: 2,
      name: 'Fredik Ejhed',
      highlight: true,
      img: 'img/Christopher_Saarinen_Big.jpg'
    },
    {
      id: 3,
      name: 'Staffan Nystrom',
      highlight: true,
      img: 'img/cynthia_smith.jpg'
    },
    {
      id: 4,
      name: 'Malin Pålsson',
      highlight: true,
      img: 'img/dag.jpg'
    },
    {
      id: 5,
      name: 'Andreas	Arledal',
      highlight: true,
      img: 'img/David_Kupersmidt.jpg'
    },
    {
      id: 0,
      name: 'Peter Roos',
      highlight: true,
      img: 'img/Anki_Andersson.jpg'
    },
    {
      id: 1,
      name: 'Dag Rende',
      highlight: true,
      img: 'img/Bjorn_Arnelid.jpg'
    },
    {
      id: 2,
      name: 'Fredik Ejhed',
      highlight: true,
      img: 'img/Christopher_Saarinen_Big.jpg'
    },
    {
      id: 3,
      name: 'Staffan Nystrom',
      highlight: true,
      img: 'img/cynthia_smith.jpg'
    },
    {
      id: 4,
      name: 'Malin Pålsson',
      highlight: true,
      img: 'img/dag.jpg'
    },
    {
      id: 5,
      name: 'Andreas	Arledal',
      highlight: true,
      img: 'img/David_Kupersmidt.jpg'
    },
    {
      id: 0,
      name: 'Peter Roos',
      highlight: true,
      img: 'img/Anki_Andersson.jpg'
    },
    {
      id: 1,
      name: 'Dag Rende',
      highlight: true,
      img: 'img/Bjorn_Arnelid.jpg'
    },
    {
      id: 2,
      name: 'Fredik Ejhed',
      highlight: true,
      img: 'img/Christopher_Saarinen_Big.jpg'
    },
    {
      id: 3,
      name: 'Staffan Nystrom',
      highlight: true,
      img: 'img/cynthia_smith.jpg'
    },
    {
      id: 4,
      name: 'Malin Pålsson',
      highlight: true,
      img: 'img/dag.jpg'
    },
    {
      id: 5,
      name: 'Andreas	Arledal',
      highlight: true,
      img: 'img/David_Kupersmidt.jpg'
    },
    {
      id: 0,
      name: 'Peter Roos',
      highlight: true,
      img: 'img/Anki_Andersson.jpg'
    },
    {
      id: 1,
      name: 'Dag Rende',
      highlight: true,
      img: 'img/Bjorn_Arnelid.jpg'
    },
    {
      id: 2,
      name: 'Fredik Ejhed',
      highlight: true,
      img: 'img/Christopher_Saarinen_Big.jpg'
    },
    {
      id: 3,
      name: 'Staffan Nystrom',
      highlight: true,
      img: 'img/cynthia_smith.jpg'
    },
    {
      id: 4,
      name: 'Malin Pålsson',
      highlight: true,
      img: 'img/dag.jpg'
    },
    {
      id: 5,
      name: 'Andreas	Arledal',
      highlight: true,
      img: 'img/David_Kupersmidt.jpg'
    }
  ]
};

const clients = [
  {
    name: 'H&M',
    hours: 2704659,
    color: '#e00026',
    logo: '/img/logos/h&m.png',
    highlight: true,
    projects: [
      {
        name: 'name',
        dateInit: new Date('2004/01/01'),
        dateEnd: new Date('2004/01/01'),
        hours: 10
      },
      {
        name: 'name',
        dateInit: new Date('2004/01/01'),
        dateEnd: new Date('2004/01/01'),
        hours: 10
      }
    ]
  },
  {
    name: 'Ericcson',
    hours: 4499890,
    color: '#002661',
    logo: '/img/logos/ericsson.png',
    highlight: true,
    projects: [
      {
        name: 'name',
        dateInit: new Date('2004/01/01'),
        dateEnd: new Date('2004/01/01'),
        hours: 20
      },
      {
        name: 'name',
        dateInit: new Date('2004/01/01'),
        dateEnd: new Date('2004/01/01'),
        hours: 90
      }
    ]
  },
  {
    name: 'Atlas',
    hours: 2159981,
    color: '#0098be',
    logo: '/img/logos/Atlas_Copco.png',
    highlight: true,
    projects: [
      {
        name: 'name',
        dateInit: new Date('2004/01/01'),
        dateEnd: new Date('2004/04/01'),
        hours: 100
      },
      {
        name: 'name',
        dateInit: new Date('2004/03/01'),
        dateEnd: new Date('2004/06/01'),
        hours: 100
      }
    ]
  },
  {
    name: 'Thales',
    hours: 3853788,
    color: '#242a75',
    logo: '/img/logos/maquet.png',
    highlight: true,
    projects: [
      {
        name: 'name',
        dateInit: new Date('2004/06/01'),
        dateEnd: new Date('2004/12/01'),
        hours: 10
      },
      {
        name: 'name',
        dateInit: new Date('2005/01/01'),
        dateEnd: new Date('2005/04/01'),
        hours: 50
      }
    ]
  },
  {
    name: 'Maquet',
    hours: 14106543,
    color: '#005aaa',
    logo: '/img/logos/maquet.png',
    highlight: true,
    projects: [
      {
        name: 'name',
        dateInit: new Date('2005/02/01'),
        dateEnd: new Date('2005/08/01'),
        hours: 300
      },
      {
        name: 'name',
        dateInit: new Date('2005/07/01'),
        dateEnd: new Date('2005/12/01'),
        hours: 140
      }
    ]
  },
  {
    name: 'Tele2',
    hours: 8819342,
    color: '#141414',
    logo: '/img/logos/tele2.png',
    highlight: true,
    projects: [
      {
        name: 'name',
        dateInit: new Date('2006/01/01'),
        dateEnd: new Date('2006/12/01'),
        hours: 40
      },
      {
        name: 'name',
        dateInit: new Date('2007/01/01'),
        dateEnd: new Date('2007/03/01'),
        hours: 200
      }
    ]
  },
  {
    name: 'Thales',
    hours: 4499890,
    color: '#00009f',
    logo: '/img/logos/thales.png',
    highlight: true,
    projects: [
      {
        name: 'name',
        dateInit: new Date('2007/03/01'),
        dateEnd: new Date('2007/05/01'),
        hours: 80
      },
      {
        name: 'name',
        dateInit: new Date('2007/06/01'),
        dateEnd: new Date('2007/09/01'),
        hours: 10
      }
    ]
  },
  {
    name: 'Saab',
    hours: 6122463,
    color: '#a20031',
    logo: '/img/logos/saab.png',
    highlight: true,
    projects: [
      {
        name: 'name',
        dateInit: new Date('2007/01/01'),
        dateEnd: new Date('2007/03/01'),
        hours: 100
      },
      {
        name: 'name',
        dateInit: new Date('2007/02/01'),
        dateEnd: new Date('2007/04/01'),
        hours: 100
      }
    ]
  }
];
const projects = [
  {
    id: 1,
    color: '#e00026',
    name: 'name',
    dateInit: new Date('2004-01-01'),
    dateEnd: new Date('2004-03-01'),
    hours: 10,
    highlight: true
  },
  {
    id: 2,
    color: '#e00026',
    name: 'name',
    dateInit: new Date('2004-01-01'),
    dateEnd: new Date('2004-04-01'),
    hours: 10,
    highlight: true
  },
  {
    id: 3,
    color: '#002661',
    name: 'name',
    dateInit: new Date('2004-04-01'),
    dateEnd: new Date('2004-06-01'),
    hours: 20,
    highlight: true
  },
  {
    id: 4,
    color: '#002661',
    name: 'name',
    dateInit: new Date('2004-06-01'),
    dateEnd: new Date('2004-10-01'),
    hours: 90,
    highlight: true
  },
  {
    id: 5,
    color: '#0098be',
    name: 'name',
    dateInit: new Date('2004-01-01'),
    dateEnd: new Date('2004-04-01'),
    hours: 100,
    highlight: true
  },
  {
    id: 6,
    name: 'name',
    color: '#0098be',
    dateInit: new Date('2004-03-01'),
    dateEnd: new Date('2004-06-01'),
    hours: 100,
    highlight: true
  },
  {
    id: 7,
    color: '#242a75',
    name: 'name',
    dateInit: new Date('2004-06-01'),
    dateEnd: new Date('2004-12-01'),
    hours: 10,
    highlight: true
  },
  {
    id: 8,
    name: 'name',
    color: '#242a75',
    dateInit: new Date('2005-01-01'),
    dateEnd: new Date('2005-04-01'),
    hours: 50,
    highlight: true
  },
  {
    id: 9,
    color: '#005aaa',
    name: 'name',
    dateInit: new Date('2005-02-01'),
    dateEnd: new Date('2005-08-01'),
    hours: 300,
    highlight: true
  },
  {
    id: 10,
    name: 'name',
    color: '#005aaa',
    dateInit: new Date('2005-07-01'),
    dateEnd: new Date('2005-12-01'),
    hours: 140,
    highlight: true
  },
  {
    id: 11,
    color: '#141414',
    name: 'name',
    dateInit: new Date('2006-01-01'),
    dateEnd: new Date('2006-12-01'),
    hours: 40,
    highlight: true
  },
  {
    id: 12,
    name: 'name',
    color: '#141414',
    dateInit: new Date('2007-01-01'),
    dateEnd: new Date('2007-03-01'),
    hours: 200,
    highlight: true
  },
  {
    id: 13,
    color: '#00009f',
    name: 'name',
    dateInit: new Date('2007-03-01'),
    dateEnd: new Date('2007-05-01'),
    hours: 80,
    highlight: true
  },
  {
    id: 14,
    name: 'name',
    color: '#00009f',
    dateInit: new Date('2007-06-01'),
    dateEnd: new Date('2007-09-01'),
    hours: 10,
    highlight: true
  },
  {
    id: 15,
    color: '#a20031',
    name: 'name',
    dateInit: new Date('2007-01-01'),
    dateEnd: new Date('2007-03-01'),
    hours: 100,
    highlight: true
  },
  {
    id: 16,
    name: 'name',
    color: '#a20031',
    dateInit: new Date('2007-02-01'),
    dateEnd: new Date('2007-04-01'),
    hours: 100,
    highlight: true
  }
];


export default App;
