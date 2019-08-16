import React from 'react';

class Title extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: ''
    };
  }
  componentDidMount() {
    this.setState({ title: this.props.title });
  }

  render() {
    return (
      <div>
        {this.state.title}
      </div>);
  }
}

export default Title;