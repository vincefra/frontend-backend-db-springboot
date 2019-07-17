import React, { Component } from 'react';
import Filter from './Filter';
import * as d3 from 'd3';

const margin = { top: 20, right: 50, bottom: 30, left: 50 };
const height = 100;
const heightProject = 10;


class VizTimeline extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  xAxis = d3.axisBottom();
  monthAxis = d3.axisTop();
  topAxis = d3.axisTop();


  handleDateChange = (values) => {
    // console.log('values changes', values);
  }

  componentDidMount() {
    this.setState({
      clients: this.props.clients,
      size: this.props.size
    });


  }

  //create all the data necessary for the timeline visualization and set it up in the state
  static getDerivedStateFromProps(nextProps, prevState) {
    const { projects, size } = nextProps;
    if (!projects) return {};
    const min = d3.min(projects, d => d.dateInit);
    const max = d3.max(projects, d => d.dateEnd);
    const range = [min.getFullYear(), max.getFullYear()];
    const extent = d3.extent([min, max]);
    let stepsInMonths = ((max.getFullYear() - min.getFullYear()) * 12) + 1;
    stepsInMonths -= min.getMonth() + 1;
    stepsInMonths += max.getMonth();
    const xScale = d3
      .scaleTime()
      .domain(extent)
      .range([0, size[0] - margin.right - margin.left]);


    //calculate all the bars 
    const bars = projects.map(d => {
      return {
        x: margin.left + xScale(new Date(d.dateInit)),
        y: height - margin.bottom,
        width: (xScale(d.dateEnd) - xScale(d.dateInit)),
        height: heightProject,
        fill: d.color,
        level: 0
      };
    });
    let numLevels = 0;
    // organize the projects so they do not overlap
    for (let i = 0; i < bars.length; i++) {
      const element = bars[i];
      let level = element.level;
      for (let j = i - 1; j >= 0; j--) {
        const subElement = bars[j];
        if (element.x <= subElement.width + subElement.x) {
          //check if the elements overlaps with the subelement 
          //and push it a level up
          if (level === subElement.level) {
            level += 1;
          } else if (subElement.level > level) {
            level = subElement.level + 1;
          }
          element.level = level;
          numLevels = Math.max(level, numLevels);
        }
      }
    }
    const appSize = [size[0], size[1]];
    const dates = [min, max];

    return { bars, xScale, appSize, numLevels, range, stepsInMonths, dates };

  }
  //add the axis of the visualization directly with d3
  componentDidUpdate() {
    this.xAxis.ticks(d3.timeYear.every(1));
    this.xAxis.scale(this.state.xScale);
    this.xAxis.tickPadding(10);
    this.xAxis.tickSize(0);


    this.monthAxis.tickFormat('');
    this.monthAxis.tickSize(height - margin.bottom);
    this.monthAxis.ticks(d3.timeMonth.every(1));
    this.monthAxis.scale(this.state.xScale);

    this.topAxis.scale(this.state.xScale);
    this.topAxis.tickFormat('');
    this.topAxis.tickSize(0);

    // this.setState({ stepsInMonths: setpsMonths });
    d3.select(this.refs.topAxis).call(this.topAxis);
    d3.select(this.refs.xAxis).call(this.xAxis);
    d3.select(this.refs.monthAxis).call(this.monthAxis);
  }



  render() {
    const barHeight = (height - margin.bottom) / (this.state.numLevels + 1);
    // const barHeight = height / level;
    const content =
      <React.Fragment >
        <svg width={this.state.appSize[0]} height={height}>
          <g className='axisMonths' ref="monthAxis" transform={`translate(${margin.left}, ${height - margin.bottom})`} />
          <g className='topAxis' ref="topAxis" transform={`translate(${margin.left}, ${0})`} />

          {this.state.bars.map((d, i) => (
            <rect
              key={i}
              x={d.x}
              y={d.y - barHeight - (barHeight * d.level)}
              rx="5"
              ry="5"
              width={d.width}
              height={barHeight}
              fill={d.fill}
              fillOpacity='0.5' />
          ))}

          <g ref="xAxis" transform={`translate(${margin.left}, ${height - margin.bottom})`} />
          <g ref="brush" />
        </svg>
        <Filter
          beforeVal=""
          afterVal=""
          filterName="Time"
          filterLeftValue=""
          filterRightValue=""
          minFilterValue={0}
          maxFilterValue={this.state.stepsInMonths}
          defaultValueMin={0}
          defaultValueMax={this.state.stepsInMonths}
          step={1}
          afterChangeFunction={this.handleDateChange}
        />
      </React.Fragment>;
    return (
      content
    );
  }
}

export default VizTimeline;