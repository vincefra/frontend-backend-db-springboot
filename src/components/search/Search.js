import React from 'react';
import { FormControl } from 'react-bootstrap';


class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.hightlightElement = (item) => {
      if (item.searchType === 'PROJECT') {
        this.props.showProject(item.id);
      } else if (item.searchType === 'EMPLOYEE') {
        this.props.showEmployee(item.id);
      } else if (item.searchType === 'SKILL') {
        this.props.showSkill(item.id);
      } else if (item.searchType === 'CLIENT') {
        this.props.showClient(item.id);
      }
    };
  }

  handleChange(e) {
    // Variable to hold the filtered list before putting into state
    let newList = [];

    // If the search bar isn't empty
    if (e.target.value !== '' && e.target.value.length >= 3) {
      const { projects, employees, skills, clients } = this.props;

      const srchWord = e.target.value.toLowerCase();
      //search in projects
      const projectResults = projects.filter(project => {
        const name = project.name.toLowerCase();
        if (name.includes(srchWord)) project.searchType = 'PROJECT';
        return name.includes(srchWord);
      });
      //search in results
      const employeesResults = employees.filter(employee => {
        const name = employee.name.toLowerCase();
        if (name.includes(srchWord)) employee.searchType = 'EMPLOYEE';
        return name.includes(srchWord);
      });
      //search in skills
      const skillsResults = skills.children.filter(skill => {
        const name = skill.name.toLowerCase();
        if (name.includes(srchWord)) skill.searchType = 'SKILL';
        return name.includes(srchWord);
      });
      //search in clients
      const clientsResults = clients.filter(client => {
        const name = client.name.toLowerCase();
        if (name.includes(srchWord)) client.searchType = 'CLIENT';
        return name.includes(srchWord);
      });

      newList = newList.concat(projectResults);
      newList = newList.concat(employeesResults);
      newList = newList.concat(skillsResults);
      newList = newList.concat(clientsResults);

    }
    // Set the filtered state based on what our rules added to newList
    this.setState({
      list: newList
    });
  }
  render() {




    return (
      <React.Fragment>
        <FormControl type="text" placeholder="Search" className=" mr-sm-2" onChange={this.handleChange} />
        <div className="results">
          <ul>
            {this.state.list.map(item => (
              <li
                key={item.name + '_' + item.id}
                onMouseOver={() => this.hightlightElement(item)}
                onMouseOut={() => this.props.unHighlightElements()}
              >
                {item.name}

              </li>
            ))}
          </ul>
        </div>
      </React.Fragment>
    );
  }
}

export default Search;