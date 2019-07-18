import React, { Component } from 'react';
import VizTimeLine from './VizTimeline';

class TimeLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentDidMount(props) {
    this.setState({
      isLoading: false,
    });
  }

  render() {
    const content = !this.state.isLoading ?
      < div className="timeLine" >
        <VizTimeLine projects={this.props.projects} size={this.props.size} selectProject={this.props.selectProject} mouseOutProject={this.props.mouseOutProject} />
      </div > : <div></div>;
    return (
      content
    );
  }
}

export default TimeLine;