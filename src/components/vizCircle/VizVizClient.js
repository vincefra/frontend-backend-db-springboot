import React from "react";
import * as d3 from "d3";

let radius = 0;
const sliceHeight = 80;
const projectHeight = sliceHeight / 2;
const projectPadding = (2 * Math.PI) / 180;
const clientArcPadding = (1.2 * Math.PI) / 180;
const colors = [
  "#98abc5",
  "#8a89a6",
  "#7b6888",
  "#6b486b",
  "#a05d56",
  "#d0743c",
  "#ff8c00",
  "#8a89a6",
  "#8a89a6",
  "#7b6888",
  "#6b486b",
  "#a05d56",
  "#d0743c"
];

class VizClient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientSlice: [], //array of svg path commands, repepresenting each client
      projectSlice: [] //array of svg path commands, representing projects,
    };
  }

  componentDidMount() {
    const height = this.props.size[1];
    radius = height - height * 0.6;
    this.calculatePieClient(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.calculatePieClient(nextProps);
  }

  //Create a pie chart with the clients total time in a project
  calculatePieClient(props) {
    //arc generator for clients
    const arcGenerator = d3
      .arc()
      .padAngle(clientArcPadding) //pad angle defines the distance between each arc
      .cornerRadius(4); //cornerRadius

    //arc generator for the Text labels
    const labelArcGenerator = d3
      .arc()
      .outerRadius(radius + 50)
      .innerRadius(radius + 50);

    //PIE object to calculate the arc distribution
    const pie = d3
      .pie()
      .sort(null)
      .value(function(d) {
        return d.population;
      });

    //arc array with the position and information in the pie
    const arcs = pie(props.clients);
    //Add to the information the fill of each one
    arcs.forEach((d, i) => {
      d.fill = colors[i];
    });
    //create an object SLICES in order to update the state
    //contains all the information one slice needs in order to be rendered
    let projectSlice = [];
    const slices = arcs.map((d, i) => {
      const path = arcGenerator({
        startAngle: d.startAngle,
        endAngle: d.endAngle,
        innerRadius: radius - sliceHeight,
        outerRadius: radius
      });

      const centroid = labelArcGenerator.centroid(d);
      const label = {
        centroid: centroid,
        text: d.data.age
      };

      const projectSlices = this.calculatePieProject(
        d.startAngle + projectPadding,
        d.endAngle - projectPadding,
        d.data.projects
      );
      projectSlice = projectSlice.concat(projectSlices);

      // d3.xml(
      //   "d3.svg",
      //   "https://upload.wikimedia.org/wikipedia/commons/e/e9/Ericsson_logo.svg",
      //   function(xml) {
      //     const importedNode = document.importNode(xml.documentElement, true);
      //     console.log(importedNode);
      //   }
      // );

      return {
        path,
        fill: colors[i],
        label
      };
    });
    this.setState({ clientSlice: slices, projectSlice: projectSlice });
  }

  //add to the state slices of clients to draw
  calculatePieProject(initAngle, endAngle, projects) {
    const angleScale = d3
      .scaleLinear()
      .domain([0, 2 * Math.PI])
      .range([initAngle, endAngle]);
    //arc generator for clients
    const arcGenerator = d3
      .arc()
      .padAngle(0.013) //pad angle defines the distance between each arc
      .cornerRadius(50); //cornerRadius
    //PIE object to calculate the arc distribution
    const pie = d3
      .pie()
      .sort(null)
      .value(function(d) {
        return d.hours;
      });

    //arc array with the position and information in the pie
    const arcs = pie(projects);
    // //Add to the information the fill of each one
    arcs.forEach((d, i) => {
      d.fill = "#FF00FF";
    });
    //create an object SLICES in order to update the state
    //contains all the information one slice needs in order to be rendered
    const slices = arcs.map((d, i) => {
      const path = arcGenerator({
        startAngle: angleScale(d.startAngle),
        endAngle: angleScale(d.endAngle),
        innerRadius: radius - projectHeight,
        outerRadius: radius - projectHeight + 10,
        fill: d.fill
      });

      return {
        path,
        fill: "#FFFFFF"
      };
    });
    return slices;
  }

  calculateDate(props) {}

  render() {
    const width = this.props.size[0];
    const height = this.props.size[1];

    return (
      <g>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {this.state.clientSlice.map((d, i) => (
            <path key={i} d={d.path} fill={d.fill} />
          ))}
        </g>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {this.state.projectSlice.map((d, i) => (
            <path key={i} d={d.path} fill={d.fill} />
          ))}
        </g>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {this.state.clientSlice.map((d, i) => (
            <text
              key={i}
              x={d.label.centroid[0]}
              y={d.label.centroid[1]}
              className="small"
            >
              {/* {d.label.text} */}
            </text>
          ))}
        </g>
      </g>
    );
  }
}
export default VizClient;
