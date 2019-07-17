import React from 'react';
import * as d3 from 'd3';

let radius = 0;
const sliceHeight = 50;
const projectHeight = 10;
const projectRadius = sliceHeight / 2;
const vizHeight = 0.67;
const imageSize = 50;
const imageDistance = 10;

const projectPadding = (2 * Math.PI) / 180;
const clientArcPadding = (1.2 * Math.PI) / 180;

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
    radius = height - height * vizHeight;
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
    const LogoArcGenerator = d3
      .arc()
      .outerRadius(radius + imageDistance)
      .innerRadius(radius + imageDistance);

    //PIE object to calculate the arc distribution
    const pie = d3
      .pie()
      .sort(null)
      .value(function (d) {
        return d.hours;
      });

    //arc array with the position and information in the pie
    const arcs = pie(props.clients);

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

      const centroid = LogoArcGenerator.centroid(d);
      //calculate the anchor point of the image depending on its position on the center
      let anchor = centroid;
      if (anchor[0] > 0 && anchor[1] < 0) {
        anchor = [centroid[0], centroid[1] - imageSize];
      } else if (anchor[0] < 0 && anchor[1] < 0) {
        anchor = [centroid[0] - imageSize, centroid[1] - imageSize];
      } else if (anchor[0] < 0 && anchor[1] > 0) {
        anchor = [centroid[0] - imageSize, centroid[1]];
      } else if (anchor[0] > 0 && anchor[1] > 0) {
        anchor = [centroid[0], centroid[1]];
      }

      const logo = {
        centroid: anchor
      };

      const projectSlices = this.calculatePieProject(
        d.startAngle + projectPadding,
        d.endAngle - projectPadding,
        d.data.projects
      );
      projectSlice = projectSlice.concat(projectSlices);

      return {
        path,
        fill: d.data.color,
        logo,
        img: d.data.logo
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
      .value(function (d) {
        return d.hours;
      });

    //arc array with the position and information in the pie
    const arcs = pie(projects);
    // //Add to the information the fill of each one
    arcs.forEach((d, i) => {
      d.fill = '#FF00FF';
    });
    //create an object SLICES in order to update the state
    //contains all the information one slice needs in order to be rendered
    const slices = arcs.map((d, i) => {
      const path = arcGenerator({
        startAngle: angleScale(d.startAngle),
        endAngle: angleScale(d.endAngle),
        innerRadius: radius - projectRadius - projectHeight / 2,
        outerRadius: radius - projectRadius + projectHeight / 2,
        fill: d.fill
      });

      return {
        path
      };
    });
    return slices;
  }

  calculateDate(props) { }

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
            <path key={i} d={d.path} fill="#FFFFFF" />
          ))}
        </g>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {this.state.clientSlice.map((d, i) => (
            <image
              key={i}
              width={imageSize}
              height={imageSize}
              x={d.logo.centroid[0]}
              y={d.logo.centroid[1]}
              xlinkHref={d.img}
              textAnchor={d.anchor}
            />
          ))}
        </g>
      </g>
    );
  }
}
export default VizClient;
