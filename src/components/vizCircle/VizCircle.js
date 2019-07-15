import React from "react";
import VizClient from "./VizVizClient";
import VizEmployees from "./VizEmployees";
import Skills from "./Skills";
//width and height of the SVG visualization
const width = window.innerWidth;
const height = window.innerHeight;

//VizCircle is in charge of taking all the raw data and
//calculate with D3 how to draw the visualization in SVG
//renders the SVG visaulization
class VizCircle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: data, //array of svg path commands, representing projects,
      employees: nodes,
      size: [width, height]
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    return (
      <svg className="circle-visualization" width={width} height={height}>
        <VizClient clients={this.state.clients} size={this.state.size} />
        <VizEmployees employees={this.state.employees} size={this.state.size} />
        <Skills skills={skills} size={this.state.size} />
      </svg>
    );
  }
}

const skills = {
  name: "Front-End",
  children: [
    {
      id: 0,
      name: "Java"
    },
    {
      id: 1,
      name: "Angular"
    },
    {
      id: 3,
      name: "jQuery"
    },
    {
      id: 4,
      name: "Underscore"
    },
    {
      id: 5,
      name: "Hibernate"
    },
    {
      id: 6,
      name: "MySQL"
    },
    {
      id: 7,
      name: "Python"
    },
    {
      id: 8,
      name: "REST"
    },
    {
      id: 9,
      name: "Git"
    },
    {
      id: 10,
      name: "test automation"
    },
    {
      id: 11,
      name: "Jenkins"
    },
    {
      id: 12,
      name: "GORM"
    },
    {
      id: 13,
      name: "MongoDB"
    },
    {
      id: 14,
      name: "Spock"
    },
    {
      id: 15,
      name: "pivotaltracker"
    },
    {
      id: 16,
      name: "Subversion"
    },
    {
      id: 17,
      name: "IntelliJ IDEA"
    },
    {
      id: 18,
      name: "Slack"
    },
    {
      id: 19,
      name: "MAMP"
    },
    {
      id: 20,
      name: "Postman"
    },
    {
      id: 21,
      name: "Trello"
    },
    {
      id: 22,
      name: "MySQL"
    },
    {
      id: 23,
      name: "workbench"
    },
    {
      id: 24,
      name: "Java SE"
    },
    {
      id: 25,
      name: "Springboot"
    },
    {
      id: 26,
      name: "JPA (Hibernate)"
    },
    {
      id: 27,
      name: "Vue.js"
    },
    {
      id: 28,
      name: "Vuetify.js"
    },
    {
      id: 29,
      name: "MySQL"
    },
    {
      id: 30,
      name: "Vuex"
    },
    {
      id: 31,
      name: "Travis CI"
    },
    {
      id: 32,
      name: "Maven"
    },
    {
      id: 33,
      name: "Bash"
    },
    {
      id: 34,
      name: "Atlassian SDK"
    },
    {
      id: 12,
      name: "GORM"
    },
    {
      id: 13,
      name: "MongoDB"
    },
    {
      id: 14,
      name: "Spock"
    },
    {
      id: 15,
      name: "pivotaltracker"
    },
    {
      id: 16,
      name: "Subversion"
    },
    {
      id: 17,
      name: "IntelliJ IDEA"
    },
    {
      id: 18,
      name: "Slack"
    },
    {
      id: 19,
      name: "MAMP"
    },
    {
      id: 20,
      name: "Postman"
    },
    {
      id: 21,
      name: "Trello"
    },
    {
      id: 22,
      name: "MySQL"
    },
    {
      id: 23,
      name: "workbench"
    },
    {
      id: 24,
      name: "Java SE"
    },
    {
      id: 25,
      name: "Springboot"
    },
    {
      id: 26,
      name: "JPA (Hibernate)"
    },
    {
      id: 27,
      name: "Vue.js"
    },
    {
      id: 28,
      name: "Vuetify.js"
    },
    {
      id: 29,
      name: "MySQL"
    },
    {
      id: 30,
      name: "Vuex"
    },
    {
      id: 31,
      name: "Travis CI"
    },
    {
      id: 32,
      name: "Maven"
    },
    {
      id: 33,
      name: "Bash"
    },
    {
      id: 34,
      name: "Atlassian SDK"
    }
  ]
};

const nodes = {
  name: "employees",
  children: [
    {
      name: "Peter Roos",
      id: 0,
      img: "img/Anki_Andersson.jpg"
    },
    {
      name: "Dag Rende",
      id: 1,
      img: "img/Bjorn_Arnelid.jpg"
    },
    {
      name: "Fredik Ejhed",
      id: 2,
      img: "img/Christopher_Saarinen_Big.jpg"
    },
    {
      name: "Staffan Nystrom",
      id: 3,
      img: "img/cynthia_smith.jpg"
    },
    {
      name: "Malin Pålsson",
      id: 4,
      img: "img/dag.jpg"
    },
    {
      name: "Andreas	Arledal",
      id: 5,
      img: "img/David_Kupersmidt.jpg"
    },
    {
      name: "Peter Roos",
      id: 0,
      img: "img/Anki_Andersson.jpg"
    },
    {
      name: "Dag Rende",
      id: 1,
      img: "img/Bjorn_Arnelid.jpg"
    },
    {
      name: "Fredik Ejhed",
      id: 2,
      img: "img/Christopher_Saarinen_Big.jpg"
    },
    {
      name: "Staffan Nystrom",
      id: 3,
      img: "img/cynthia_smith.jpg"
    },
    {
      name: "Malin Pålsson",
      id: 4,
      img: "img/dag.jpg"
    },
    {
      name: "Andreas	Arledal",
      id: 5,
      img: "img/David_Kupersmidt.jpg"
    },
    {
      name: "Peter Roos",
      id: 0,
      img: "img/Anki_Andersson.jpg"
    },
    {
      name: "Dag Rende",
      id: 1,
      img: "img/Bjorn_Arnelid.jpg"
    },
    {
      name: "Fredik Ejhed",
      id: 2,
      img: "img/Christopher_Saarinen_Big.jpg"
    },
    {
      name: "Staffan Nystrom",
      id: 3,
      img: "img/cynthia_smith.jpg"
    },
    {
      name: "Malin Pålsson",
      id: 4,
      img: "img/dag.jpg"
    },
    {
      name: "Andreas	Arledal",
      id: 5,
      img: "img/David_Kupersmidt.jpg"
    },
    {
      name: "Peter Roos",
      id: 0,
      img: "img/Anki_Andersson.jpg"
    },
    {
      name: "Dag Rende",
      id: 1,
      img: "img/Bjorn_Arnelid.jpg"
    },
    {
      name: "Fredik Ejhed",
      id: 2,
      img: "img/Christopher_Saarinen_Big.jpg"
    },
    {
      name: "Staffan Nystrom",
      id: 3,
      img: "img/cynthia_smith.jpg"
    },
    {
      name: "Malin Pålsson",
      id: 4,
      img: "img/dag.jpg"
    },
    {
      name: "Andreas	Arledal",
      id: 5,
      img: "img/David_Kupersmidt.jpg"
    },
    {
      name: "Peter Roos",
      id: 0,
      img: "img/Anki_Andersson.jpg"
    },
    {
      name: "Dag Rende",
      id: 1,
      img: "img/Bjorn_Arnelid.jpg"
    },
    {
      name: "Fredik Ejhed",
      id: 2,
      img: "img/Christopher_Saarinen_Big.jpg"
    },
    {
      name: "Staffan Nystrom",
      id: 3,
      img: "img/cynthia_smith.jpg"
    },
    {
      name: "Malin Pålsson",
      id: 4,
      img: "img/dag.jpg"
    },
    {
      name: "Andreas	Arledal",
      id: 5,
      img: "img/David_Kupersmidt.jpg"
    }
  ]
};

const data = [
  {
    name: "H&M",
    hours: 2704659,
    color: "#e00026",
    logo: "/img/logos/h&m.png",
    projects: [
      {
        name: "name",
        dateInit: "01 Jan 2004",
        dateEnd: "01 Jan 2004",
        hours: 10
      },
      {
        name: "name",
        dateInit: "01 Jan 2004",
        dateEnd: "01 Jan 2004",
        hours: 10
      }
    ]
  },
  {
    name: "Ericcson",
    hours: 4499890,
    color: "#002661",
    logo: "/img/logos/ericsson.png",
    projects: [
      {
        name: "name",
        dateInit: "01 Jan 2004",
        dateEnd: "01 Jan 2004",
        hours: 20
      },
      {
        name: "name",
        dateInit: "01 Jan 2004",
        dateEnd: "01 Jan 2004",
        hours: 90
      }
    ]
  },
  {
    name: "Atlas",
    hours: 2159981,
    color: "#0098be",
    logo: "/img/logos/Atlas_Copco.png",
    projects: [
      {
        name: "name",
        dateInit: "01 Jan 2004",
        dateEnd: "01 Jan 2004",
        hours: 100
      },
      {
        name: "name",
        dateInit: "01 Jan 2004",
        dateEnd: "01 Jan 2004",
        hours: 100
      }
    ]
  },
  {
    name: "Thales",
    hours: 3853788,
    color: "#242a75",
    logo: "/img/logos/maquet.png",
    projects: [
      {
        name: "name",
        dateInit: "01 Jan 2004",
        dateEnd: "01 Jan 2004",
        hours: 10
      },
      {
        name: "name",
        dateInit: "01 Jan 2004",
        dateEnd: "01 Jan 2004",
        hours: 50
      }
    ]
  },
  {
    name: "Maquet",
    hours: 14106543,
    color: "#005aaa",
    logo: "/img/logos/maquet.png",
    projects: [
      {
        name: "name",
        dateInit: "01 Jan 2004",
        dateEnd: "01 Jan 2004",
        hours: 300
      },
      {
        name: "name",
        dateInit: "01 Jan 2004",
        dateEnd: "01 Jan 2004",
        hours: 140
      }
    ]
  },
  {
    name: "Tele2",
    hours: 8819342,
    color: "#141414",
    logo: "/img/logos/tele2.png",
    projects: [
      {
        name: "name",
        dateInit: "01 Jan 2004",
        dateEnd: "01 Jan 2004",
        hours: 40
      },
      {
        name: "name",
        dateInit: "01 Jan 2004",
        dateEnd: "01 Jan 2004",
        hours: 200
      }
    ]
  },
  {
    name: "Thales",
    hours: 4499890,
    color: "#00009f",
    logo: "/img/logos/thales.png",
    projects: [
      {
        name: "name",
        dateInit: "01 Jan 2004",
        dateEnd: "01 Jan 2004",
        hours: 80
      },
      {
        name: "name",
        dateInit: "01 Jan 2004",
        dateEnd: "01 Jan 2004",
        hours: 10
      }
    ]
  },
  {
    name: "Saab",
    hours: 6122463,
    color: "#a20031",
    logo: "/img/logos/saab.png",
    projects: [
      {
        name: "name",
        dateInit: "01 Jan 2004",
        dateEnd: "01 Jan 2004",
        hours: 100
      },
      {
        name: "name",
        dateInit: "01 Jan 2004",
        dateEnd: "01 Jan 2004",
        hours: 100
      }
    ]
  }
];

export default VizCircle;
