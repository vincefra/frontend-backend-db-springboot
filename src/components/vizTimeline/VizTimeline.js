import React, { Component } from 'react';
import Filter from './Filter';
import * as d3 from 'd3';
import {
  getDateRange
} from '../interaction';

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

  componentDidMount() {
    this.setState({
    });
  }

  //create all the data necessary for the timeline visualization and set it up in the state
  static getDerivedStateFromProps(nextProps, prevState) {
    const { projects, size, ranges } = nextProps;
    if (!projects) return {};

    // const extent = d3.extent([ranges[0], ranges[1]]);
    const extent = getDateRange(projects);
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
        fill: !d.highlight ? '#333333' : d.color,
        level: 0,
        id: d.id,
        opacity: d.highlight ? '1' : '0.2'
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

    return { bars, xScale, numLevels };

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

    d3.select(this.refs.xAxis).call(this.xAxis);
    d3.select(this.refs.monthAxis).call(this.monthAxis);
  }



  render() {
    const barHeight = (height - margin.bottom) / (this.state.numLevels + 1);
    // const barHeight = height / level;
    const content =
      < div className={this.props.displayTimeline ? 'timeLine' : 'timeLine hidden'} >
        <svg width={this.props.size[0]} height={height}>
          <g className='axisMonths' ref="monthAxis" transform={`translate(${margin.left}, ${height - margin.bottom})`} />

          {this.state.bars.map((d) => (
            <rect
              key={d.id}
              x={d.x}
              y={d.y - barHeight - (barHeight * d.level)}
              rx="5"
              ry="5"
              width={d.width}
              height={barHeight}
              fill={d.fill}
              fillOpacity={d.opacity}
              onMouseOver={() => { this.props.selectProject(d.id); }}
              onMouseOut={this.props.mouseOutProject}
            />
          ))}

          <g ref="xAxis" transform={`translate(${margin.left}, ${height - margin.bottom})`} />

        </svg>
        <Filter
          beforeVal=""
          afterVal=""
          filterName="Time"
          filterLeftValue=""
          filterRightValue=""
          minFilterValue={0}
          maxFilterValue={this.props.totalProjectsMonths}
          defaultValueMin={0}
          defaultValueMax={this.props.totalProjectsMonths}
          step={1}
          afterChangeFunction={this.props.modifyRange}
        />
      </div>;

    return (
      content
    );
  }
}

export default VizTimeline;