import React, { Component } from 'react';
import { Navbar, Form, FormControl, Button } from 'react-bootstrap';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Navbar className="fixed-top header" variant="header" expand="lg">
        <Navbar.Brand className="brandLogo">
          <img src='img/logos/findOut.png' alt='Find Out'></img>
        </Navbar.Brand>

        <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
        </Form>

        <Button className="ml-auto p-2" variant="light">
          <i className="far fa-question-circle"></i>
        </Button>

      </Navbar>
    );
  }
}

export default Header;