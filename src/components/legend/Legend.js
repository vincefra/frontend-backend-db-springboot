import React from 'react';
import LegendItem from './LegendItem';
import { getNumberOfClients } from 'components/general';
import { getSkillsIDsFromProject } from 'components/interaction';

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

  calculateData(props) {
    let { clientId, projectId, employeeId } = props;
    if (clientId) 
      this.calculateClient(props);
    if (projectId) 
      this.calculateProject(props);
    if (employeeId) 
      this.calculateEmployee(props);

  }

  calculateClient({ clientId, clients, projects, employees, skills }) {
    const client = clients.find(client => client.id === clientId);
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

  calculateEmployee({ employeeId, clients, projects, employees, skills }) {
    const employee = employees.find(employee => employee.id === employeeId);
    const totalClients = this.getNumberOfClients(employeeId, clients);
    const totalProjects = projects.filter(project => project.employees.includes(employeeId)).length;
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

  calculateProject({ projectId, clinets, projects, employees, skills }) {

  }

  getSkillsFromProjects(projectIds, projects) {
    let projectObjs = projectIds.map(id => projects.find(project => project.id === id));
    let skills = [];
    for (let project of projectObjs) {
      skills.push(...project.skills.filter(skillId => !skills.includes(skillId)));
    }
    return skills;
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
