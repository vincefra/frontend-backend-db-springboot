import React from 'react';
import LegendItem from './LegendItem';

class Legend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalClients: 0,
      totalProjects: 0,
      totalEmployees: 0,
      totalSkills: 0,
      refresh: false
    };
  }

  calculateData(props) {
    let { client, project, employee } = props;
    if (client) 
      this.calculateClient(props);
    if (project) 
      this.calculateProject(props);
    if (employee) 
      this.calculateEmployee(props);

  }

  calculateClient({ client, projects }) {
    const totalProjects = client.projects.length;
    const totalEmployees = client.employees.length;
    const totalSkills = this.getSkillsFromProjects(client.projects, projects).length;

    this.setState({
      totalClients: 1,
      totalProjects,
      totalEmployees,
      totalSkills
    });
  }

  calculateEmployee({ employee, clients, projects, skills }) {
    const totalClients = this.getNumberOfClients(clients, employee.id);
    const totalProjects = projects.filter(project => project.employees.includes(employee.id)).length;
    const totalSkills = skills
      .map(skill => skill.id)
      .filter(skillId => employee.skills.includes(skillId))
      .length;
    this.setState({
      totalClients,
      totalProjects,
      totalEmployees: 1,
      totalSkills
    });
  }

  calculateProject({ project }) {
    this.setState({
      totalClients: 1,
      totalProjects: 1,
      totalEmployees: project.employees.length,
      totalSkills: project.skills.length
    });
  }

  getSkillsFromProjects(projectIds, projects) {
    let projectObjs = projectIds.map(id => projects.find(project => project.id === id));
    let skills = [];
    for (let project of projectObjs) {
      skills.push(...project.skills.filter(skillId => !skills.includes(skillId)));
    }
    return skills;
  }

  /*
  * Counts the number of clients which a certain employee has worked with. 
  * If the employeeId is left out, count the total number of clients
  */
  getNumberOfClients(clients, employeeId) { 
    let numOfclients = 0;
    for (let client of clients) {
      if (client.type === 'more' || client.type === 'category') 
        numOfclients += this.getNumberOfClients(client.list, employeeId);
      else if (client.employees.includes(employeeId) || !employeeId)
        numOfclients++;
    }
    return numOfclients;
  }

  resetLegends({clients, projects, employees, skills}) {
    this.setState({
      totalClients: this.getNumberOfClients(clients),
      totalProjects: projects.length,
      totalEmployees: employees.length,
      totalSkills: skills.length
    });
  }

  equal(prev, current) {
    if (prev !== current) return false;
    if (prev === current) return true;
    if (prev.id !== current.id && prev.type !== current.type) return false;
    return true;
  }

  componentDidMount() {
    this.resetLegends(this.props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.refreshLegends !== this.props.refreshLegends) this.resetLegends(this.props);
    if (!this.equal(prevProps.client, this.props.client) || 
    !this.equal(prevProps.project, this.props.project) ||
    !this.equal(prevProps.employee, this.props.employee)) {
      if (this.props.client || this.props.project || this.props.employee)
        this.calculateData(this.props);
      else 
        this.resetLegends(this.props);
    }
  }

  render() {
    let {
      totalEmployees,
      totalClients,
      totalProjects,
      totalSkills
    } = this.state;

    return (
      <div className='legend'>
        <ul>
          <LegendItem
            data={totalClients}
            type='CLIENTS'
            label='client'
            overEvent={this.props.overEvent}
            outEvent={this.props.outEvent}
          />
          <LegendItem
            data={totalProjects}
            type='PROJECTS'
            label='project'
            overEvent={this.props.overEvent}
            outEvent={this.props.outEvent}
          />
          <LegendItem
            data={totalEmployees}
            type='EMPLOYEES'
            label='employee'
            overEvent={this.props.overEvent}
            outEvent={this.props.outEvent}
          />
          <LegendItem
            data={totalSkills}
            type='SKILLS'
            label='skill'
            overEvent={this.props.overEvent}
            outEvent={this.props.outEvent}
          />
        </ul>
      </div>
    );
  }
}

export default Legend;
