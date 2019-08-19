import React, { Component } from 'react';
import { Navbar, Form, Button } from 'react-bootstrap';
import Search from 'components/search/Search';
import Breadcrumb from 'components/breadcrumb/Breadcrumb';
import TagList from 'components/tagList/tagList';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Navbar className="header" variant="header" expand="lg">
        <Navbar.Brand className="brandLogo">
          <img src='img/logos/findOut.png' alt='FindOut'></img>
        </Navbar.Brand>

        <Form inline className="searchForm" onSubmit={e => { e.preventDefault(); }}>
          <Search
            clients={this.props.clients}
            projects={this.props.projects}
            employees={this.props.employees}
            skills={this.props.skills}
            showObjectInformation={this.props.showObjectInformation}
            toggleDialogue={this.props.toggleDialogue}
            addSelectedObject={this.props.addSelectedObject}
            removeSelectedObject={this.props.removeSelectedObject}
            selectedObjects={this.props.selectedObjects}
            getProjectLogo={this.props.getProjectLogo}
          />
        </Form>

        <TagList
          selectedObjects={this.props.selectedObjects}
          removeSelectedObject={this.props.removeSelectedObject}
        />
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