import React, { Component } from 'react';
import { Navbar, Form, Button } from 'react-bootstrap';
import Search from 'components/search/Search';
import Breadcrumb from 'components/breadcrumb/Breadcrumb';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Navbar className="fixed-top header" variant="header" expand="lg">
        <Navbar.Brand className="brandLogo">
          <img src='img/logos/findOut.png' alt='FindOut'></img>
        </Navbar.Brand>

        <Form inline className="searchForm" onSubmit={e => { e.preventDefault(); }}>
          <Search
            clients={this.props.clients}
            projects={this.props.projects}
            employees={this.props.employees}
            skills={this.props.skills}
            showProject={this.props.showProject}
            showEmployee={this.props.showEmployee}
            showSkill={this.props.showSkill}
            showClient={this.props.showClient}
            unHighlightElements={this.props.unHighlightElements}
          />
          {/* <FormControl type="text" placeholder="Search" className="mr-sm-2" /> */}
        </Form>
        <div className='right'>
          <Breadcrumb  
            clickedClient={this.props.clickedClient}
            breadcrumbClick={this.props.breadcrumbClick}
          />
          <Button className="ml-auto p-2" variant="light">
            <i className="far fa-question-circle"></i>
          </Button>
        </div>

      </Navbar>
    );
  }
}

export default Header;