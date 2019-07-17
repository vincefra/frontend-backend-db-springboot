import React from 'react';
import VizClient from './VizVizClient';
import VizEmployees from './VizEmployees';
import Skills from './Skills';
//width and height of the SVG visualization
const width = window.innerWidth;
const height = window.innerHeight;

//VizCircle is in charge of taking all the raw data and
//calculate with D3 how to draw the visualization in SVG
//renders the SVG visaulization
class VizCircle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  componentDidMount(props) {
    this.setState({
      clients: this.props.clients,
      employees: this.props.employees,
      size: this.props.size,
      skills: this.props.skills,
      isLoading: false
    });
  }

  componentWillReceiveProps(nextProps) { }


  render() {

    const content = !this.state.isLoading ?
      <svg className='circle-visualization' width={width} height={height}>
        <VizClient clients={this.state.clients} size={this.state.size} />
        <VizEmployees employees={this.state.employees} size={this.state.size} />
        <Skills skills={this.state.skills} size={this.state.size} />
      </svg> : <svg></svg>;
    return (
      content
    );
  }
}


export default VizCircle;
