import React from 'react';

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
          <li className='legend-item'>
            <div
              role="menuitem"
              className={'thing'}
              onMouseEnter={() => this.props.overEvent('EMPLOYEES')}
              onMouseLeave={() => this.props.outEvent()}
            >
              {totalEmployees} Employees
            </div>
          </li>
          <li className='legend-item'>
            <div
              role="menuitem"
              className={'thing'}
              onMouseEnter={() => this.props.overEvent('CLIENTS')}
              onMouseLeave={() => this.props.outEvent()}
            >
              {totalClients} Clients
            </div>
          </li>
          <li className='legend-item'>
            <div
              role="menuitem"
              className={'thing'}
              onMouseEnter={() => this.props.overEvent('PROJECTS')}
              onMouseLeave={() => this.props.outEvent()}
            >
              {totalProjects} Projects
            </div>
          </li>
          <li className='legend-item'>
            <div
              role="menuitem"
              className={'thing'}
              onMouseEnter={() => this.props.overEvent('SKILLS')}
              onMouseLeave={() => this.props.outEvent()}
            >
              {totalSkills} Skills
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default Legend;
