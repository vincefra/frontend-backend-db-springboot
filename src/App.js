import React from 'react';
import VizCircle from './components/vizCircle/VizCircle';
import Legend from './components/legend/Legend';
import Dialogue from './components/dialogue/Dialogue';
import TimeLine from './components/vizTimeline/TimeLine';
import Header from './components/header/Header';
//width and height of the SVG visualization
const width = window.innerWidth;
const height = window.innerHeight;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: clients, //array of svg path commands, representing projects,
      employees: employees,
      size: [width, height],
      skills: skills,
      projects: projects
    };
  }

  render() {
    return (
      <div>
        <div className='mobile-message'>
          <div className='logo d-flex large'>
            <div className='spacing-h small' />
            <h1>Find Out Visualization</h1>
          </div>
          <div className='spacing' />
          <p>
            Please visit us from a desktop, this visualization is not
            responsive....
          </p>
        </div>
        <Header />
        <Legend />
        <Dialogue />
        <TimeLine projects={this.state.projects} size={this.state.size} />
        <VizCircle clients={this.state.clients} employees={this.state.employees} size={this.state.size} skills={this.state.skills} />
      </div>
    );
  }
}

const skills = {
  name: 'Front-End',
  children: [
    {
      id: 0,
      name: 'Java'
    },
    {
      id: 1,
      name: 'Angular'
    },
    {
      id: 3,
      name: 'jQuery'
    },
    {
      id: 4,
      name: 'Underscore'
    },
    {
      id: 5,
      name: 'Hibernate'
    },
    {
      id: 6,
      name: 'MySQL'
    },
    {
      id: 7,
      name: 'Python'
    },
    {
      id: 8,
      name: 'REST'
    },
    {
      id: 9,
      name: 'Git'
    },
    {
      id: 10,
      name: 'test automation'
    },
    {
      id: 11,
      name: 'Jenkins'
    },
    {
      id: 12,
      name: 'GORM'
    },
    {
      id: 13,
      name: 'MongoDB'
    },
    {
      id: 14,
      name: 'Spock'
    },
    {
      id: 15,
      name: 'pivotaltracker'
    },
    {
      id: 16,
      name: 'Subversion'
    },
    {
      id: 17,
      name: 'IntelliJ IDEA'
    },
    {
      id: 18,
      name: 'Slack'
    },
    {
      id: 19,
      name: 'MAMP'
    },
    {
      id: 20,
      name: 'Postman'
    },
    {
      id: 21,
      name: 'Trello'
    },
    {
      id: 22,
      name: 'MySQL'
    },
    {
      id: 23,
      name: 'workbench'
    },
    {
      id: 24,
      name: 'Java SE'
    },
    {
      id: 25,
      name: 'Springboot'
    },
    {
      id: 26,
      name: 'JPA (Hibernate)'
    },
    {
      id: 27,
      name: 'Vue.js'
    },
    {
      id: 28,
      name: 'Vuetify.js'
    },
    {
      id: 29,
      name: 'MySQL'
    },
    {
      id: 30,
      name: 'Vuex'
    },
    {
      id: 31,
      name: 'Travis CI'
    },
    {
      id: 32,
      name: 'Maven'
    },
    {
      id: 33,
      name: 'Bash'
    },
    {
      id: 34,
      name: 'Atlassian SDK'
    },
    {
      id: 12,
      name: 'GORM'
    },
    {
      id: 13,
      name: 'MongoDB'
    },
    {
      id: 14,
      name: 'Spock'
    },
    {
      id: 15,
      name: 'pivotaltracker'
    },
    {
      id: 16,
      name: 'Subversion'
    },
    {
      id: 17,
      name: 'IntelliJ IDEA'
    },
    {
      id: 18,
      name: 'Slack'
    },
    {
      id: 19,
      name: 'MAMP'
    },
    {
      id: 20,
      name: 'Postman'
    },
    {
      id: 21,
      name: 'Trello'
    },
    {
      id: 22,
      name: 'MySQL'
    },
    {
      id: 23,
      name: 'workbench'
    },
    {
      id: 24,
      name: 'Java SE'
    },
    {
      id: 25,
      name: 'Springboot'
    },
    {
      id: 26,
      name: 'JPA (Hibernate)'
    },
    {
      id: 27,
      name: 'Vue.js'
    },
    {
      id: 28,
      name: 'Vuetify.js'
    },
    {
      id: 29,
      name: 'MySQL'
    },
    {
      id: 30,
      name: 'Vuex'
    },
    {
      id: 31,
      name: 'Travis CI'
    },
    {
      id: 32,
      name: 'Maven'
    },
    {
      id: 33,
      name: 'Bash'
    },
    {
      id: 34,
      name: 'Atlassian SDK'
    }
  ]
};

const employees = {
  name: 'employees',
  children: [
    {
      name: 'Peter Roos',
      id: 0,
      img: 'img/Anki_Andersson.jpg'
    },
    {
      name: 'Dag Rende',
      id: 1,
      img: 'img/Bjorn_Arnelid.jpg'
    },
    {
      name: 'Fredik Ejhed',
      id: 2,
      img: 'img/Christopher_Saarinen_Big.jpg'
    },
    {
      name: 'Staffan Nystrom',
      id: 3,
      img: 'img/cynthia_smith.jpg'
    },
    {
      name: 'Malin Pålsson',
      id: 4,
      img: 'img/dag.jpg'
    },
    {
      name: 'Andreas	Arledal',
      id: 5,
      img: 'img/David_Kupersmidt.jpg'
    },
    {
      name: 'Peter Roos',
      id: 0,
      img: 'img/Anki_Andersson.jpg'
    },
    {
      name: 'Dag Rende',
      id: 1,
      img: 'img/Bjorn_Arnelid.jpg'
    },
    {
      name: 'Fredik Ejhed',
      id: 2,
      img: 'img/Christopher_Saarinen_Big.jpg'
    },
    {
      name: 'Staffan Nystrom',
      id: 3,
      img: 'img/cynthia_smith.jpg'
    },
    {
      name: 'Malin Pålsson',
      id: 4,
      img: 'img/dag.jpg'
    },
    {
      name: 'Andreas	Arledal',
      id: 5,
      img: 'img/David_Kupersmidt.jpg'
    },
    {
      name: 'Peter Roos',
      id: 0,
      img: 'img/Anki_Andersson.jpg'
    },
    {
      name: 'Dag Rende',
      id: 1,
      img: 'img/Bjorn_Arnelid.jpg'
    },
    {
      name: 'Fredik Ejhed',
      id: 2,
      img: 'img/Christopher_Saarinen_Big.jpg'
    },
    {
      name: 'Staffan Nystrom',
      id: 3,
      img: 'img/cynthia_smith.jpg'
    },
    {
      name: 'Malin Pålsson',
      id: 4,
      img: 'img/dag.jpg'
    },
    {
      name: 'Andreas	Arledal',
      id: 5,
      img: 'img/David_Kupersmidt.jpg'
    },
    {
      name: 'Peter Roos',
      id: 0,
      img: 'img/Anki_Andersson.jpg'
    },
    {
      name: 'Dag Rende',
      id: 1,
      img: 'img/Bjorn_Arnelid.jpg'
    },
    {
      name: 'Fredik Ejhed',
      id: 2,
      img: 'img/Christopher_Saarinen_Big.jpg'
    },
    {
      name: 'Staffan Nystrom',
      id: 3,
      img: 'img/cynthia_smith.jpg'
    },
    {
      name: 'Malin Pålsson',
      id: 4,
      img: 'img/dag.jpg'
    },
    {
      name: 'Andreas	Arledal',
      id: 5,
      img: 'img/David_Kupersmidt.jpg'
    },
    {
      name: 'Peter Roos',
      id: 0,
      img: 'img/Anki_Andersson.jpg'
    },
    {
      name: 'Dag Rende',
      id: 1,
      img: 'img/Bjorn_Arnelid.jpg'
    },
    {
      name: 'Fredik Ejhed',
      id: 2,
      img: 'img/Christopher_Saarinen_Big.jpg'
    },
    {
      name: 'Staffan Nystrom',
      id: 3,
      img: 'img/cynthia_smith.jpg'
    },
    {
      name: 'Malin Pålsson',
      id: 4,
      img: 'img/dag.jpg'
    },
    {
      name: 'Andreas	Arledal',
      id: 5,
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
    color: '#e00026',
    name: 'name',
    dateInit: new Date('2004-01-01'),
    dateEnd: new Date('2004-03-01'),
    hours: 10
  },
  {
    color: '#e00026',
    name: 'name',
    dateInit: new Date('2004-01-01'),
    dateEnd: new Date('2004-04-01'),
    hours: 10
  },
  {
    color: '#002661',
    name: 'name',
    dateInit: new Date('2004-04-01'),
    dateEnd: new Date('2004-06-01'),
    hours: 20
  },
  {
    color: '#002661',
    name: 'name',
    dateInit: new Date('2004-06-01'),
    dateEnd: new Date('2004-10-01'),
    hours: 90
  },
  {
    color: '#0098be',
    name: 'name',
    dateInit: new Date('2004-01-01'),
    dateEnd: new Date('2004-04-01'),
    hours: 100
  },
  {
    name: 'name',
    color: '#0098be',
    dateInit: new Date('2004-03-01'),
    dateEnd: new Date('2004-06-01'),
    hours: 100
  },
  {
    color: '#242a75',
    name: 'name',
    dateInit: new Date('2004-06-01'),
    dateEnd: new Date('2004-12-01'),
    hours: 10
  },
  {
    name: 'name',
    color: '#242a75',
    dateInit: new Date('2005-01-01'),
    dateEnd: new Date('2005-04-01'),
    hours: 50
  },
  {
    color: '#005aaa',
    name: 'name',
    dateInit: new Date('2005-02-01'),
    dateEnd: new Date('2005-08-01'),
    hours: 300
  },
  {
    name: 'name',
    color: '#005aaa',
    dateInit: new Date('2005-07-01'),
    dateEnd: new Date('2005-12-01'),
    hours: 140
  },
  {
    color: '#141414',
    name: 'name',
    dateInit: new Date('2006-01-01'),
    dateEnd: new Date('2006-12-01'),
    hours: 40
  },
  {
    name: 'name',
    color: '#141414',
    dateInit: new Date('2007-01-01'),
    dateEnd: new Date('2007-03-01'),
    hours: 200
  },
  {
    color: '#00009f',
    name: 'name',
    dateInit: new Date('2007-03-01'),
    dateEnd: new Date('2007-05-01'),
    hours: 80
  },
  {
    name: 'name',
    color: '#00009f',
    dateInit: new Date('2007-06-01'),
    dateEnd: new Date('2007-09-01'),
    hours: 10
  },
  {
    color: '#a20031',
    name: 'name',
    dateInit: new Date('2007-01-01'),
    dateEnd: new Date('2007-03-01'),
    hours: 100
  },
  {
    name: 'name',
    color: '#a20031',
    dateInit: new Date('2007-02-01'),
    dateEnd: new Date('2007-04-01'),
    hours: 100
  }
];


export default App;
