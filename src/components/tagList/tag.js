import React, { Component } from 'react';

class Tag extends Component {
  state = {
  }

  removeObject = () => {
    this.props.removeSelectedObject(this.props.object);
  }

  render() {
    return (
      <li className="tag">
        <h3>{this.props.name}</h3>
        <i className="fas fa-minus-circle" onMouseDown={() => this.removeObject()}></i>
      </li>
    );
  }
}

export default Tag;