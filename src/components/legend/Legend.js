import React from 'react';
import LegendItem from './LegendItem';
import { getNumberOfClients } from 'components/general';

class Legend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalClients: 0,
      totalProjects: 0,
      totalEmployees: 0,
      totalSkills: 0
    };
  }

  calculateData({ 
    clientId, 
    projectId, 
    employeeId,
    clients,
    projects,
    employees,
    skills
  }) {
    console.log(employeeId);
    if (clientId) 
      this.calculateClient(clientId, clients, projects, employees, skills);
    if (projectId) 
      this.calculateProject(projectId, clients, projects, employees, skills);
    if (employeeId) 
      this.calculateEmployee(employeeId, clients, projects, employees, skills);

  }

  calculateClient(id, clients, projects, employees, skills) {
    console.log(clients);
  }

  calculateEmployee(id, clients, projects, employees, skills) {
    const employee = employees.find(employee => employee.id === id);
    const totalClients = this.getNumberOfClients(id, clients);
    const totalProjects = projects.filter(project => 
      project.employees.includes(id)
    ).length;
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

  calculateProject(id, clinets, projects, employees, skills) {

  }

  getNumberOfClients(id, clients) {  
    let numOfclients = 0;
    for (let client of clients) {
      if (client.type === 'more' || client.type === 'category') 
        numOfclients += getNumberOfClients(id, client.list);
      else if (client.employees.includes(id))
        numOfclients++;
    }
    return numOfclients;
  }

  resetLegends({clients, projects, employees, skills}) {
    this.setState({
      totalClients: clients.length,
      totalProjects: projects.length,
      totalEmployees: employees.length,
      totalSkills: skills.length
    });
  }

  componentDidUpdate(prevProps) {
    console.log(prevProps.clientId, this.props.clientId);
    console.log(prevProps.projectId, this.props.projectId);
    console.log(prevProps.employeeId, this.props.employeeId);

    if (prevProps.clientId !== this.props.clientId || prevProps.projectId !== this.props.projectId || 
      prevProps.employeeId !== this.props.employeeId)
      if (this.props.clientId || this.props.projectId || this.props.employeeId) this.calculateData(this.props); 
      else this.resetLegends(this.props);
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
