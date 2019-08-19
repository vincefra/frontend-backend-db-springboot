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

  calculateData(props) {
    let { client, project, employee } = props;
    if (client) this.calculateClient(props);
    if (project) this.calculateProject(props);
    if (employee) this.calculateEmployee(props);
  }

  calculateClient({ client }) {
    this.setState({
      totalClients: 1,
      totalProjects: client.projects.length,
      totalEmployees: client.employees.length,
      totalSkills: client.skills.length
    });
  }

  calculateEmployee({ employee, clients, projects }) {
    const totalClients = clients ? 
      clients.filter(client => client.employees.includes(employee.id)).length : 1;
    const totalProjects = projects.filter(project => project.employees.includes(employee.id)).length;
    const totalSkills = employee.skills.length;
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

  resetLegends({clients, projects, employees, skills}) {
    this.setState({
      totalClients: clients ? clients.length : 1,
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

  render() {
    let {
      totalEmployees,
      totalClients,
      totalProjects,
      totalSkills,
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
