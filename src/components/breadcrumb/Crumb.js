import React from 'react';

class Crumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: props.clients
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onNavigate(this.state.clients);
  }

  render() {
    return (
      <span className='crumb' onClick={this.handleClick}/>
    );
  }
}

export default Crumb;