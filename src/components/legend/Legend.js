import React from 'react';

class Legend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const totalEmployees = this.props.employees.children.filter(emp => emp.highlight === true).length;
    const totalClients = this.props.clients.filter(cli => cli.highlight === true).length;
    const totalProjects = this.props.projects.filter(pro => pro.highlight === true).length;
    const totalSkills = this.props.skills.children.filter(ski => ski.highlight === true).length;

    return (
      <div className='legend'>
        <ul>
          <li className='legend-item'>

            <div>
              <div>{/* SPACE FOR ICON */}</div>
            </div>
            {totalEmployees} Employees

          </li>
          <li className='legend-item'>

            <div>
              <div>{/* SPACE FOR ICON */}</div>
            </div>
            {totalClients} Clients

          </li>
          <li className='legend-item'>

            <div>
              <div>{/* SPACE FOR ICON */}</div>
            </div>
            {totalProjects} Projects

          </li>
          <li className='legend-item'>

            <div>
              <div>{/* SPACE FOR ICON */}</div>
            </div>
            {totalSkills} Skills

          </li>
        </ul>
      </div>
    );
  }
}

export default Legend;
