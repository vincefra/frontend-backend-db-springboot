import React from 'react';
import LegendItem from './LegendItem';

class Legend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const totalEmployees = this.props.employees.filter(emp => emp.highlight === true).length;
    const totalClients = this.props.clients.filter(cli => cli.highlight === true).length;
    const totalProjects = this.props.isHovered ? 
      this.props.projects.filter(pro => pro.highlight === true).length : this.props.projects.length;
    const totalSkills = this.props.isHovered ? 
      this.props.skills.filter(skill => skill.highlight === true).length : this.props.skills.length;

    return (
      <div className='legend'>
        <ul>
          <LegendItem
            data={totalEmployees}
            type='EMPLOYEES'
            label='employee'
            overEvent={this.props.overEvent}
            outEvent={this.props.outEvent}
          />
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
