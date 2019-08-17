import React from 'react';
import { calculatePieClient } from './actions';

const vizHeight = 0.67;
const imageSize = 50;

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
    const radius = height - height * vizHeight;
    const { clientSlice, projectSlice } = calculatePieClient(this.props, radius);
    this.setState({ clientSlice, projectSlice, radius });
  }

  componentDidUpdate(prevProps) {
    const prevClientIds = prevProps.clients.map(p => p.id);
    const clientIds = this.props.clients.map(p => p.id);
    const isSame = prevClientIds.filter(id => !clientIds.includes(id)).length === 0;
    if (prevClientIds.length !== clientIds.length || !isSame) {
      const { clientSlice, projectSlice } = calculatePieClient(this.props, this.state.radius);
      this.setState({ clientSlice, projectSlice });
    }
  }

  render() {
    const width = this.props.size[0];
    const height = this.props.size[1];
    const clients = <g transform={`translate(${width / 2}, ${height / 2})`}>
      {this.state.clientSlice.map((d, i) => (
        <path
          key={i}
          d={d.path}
          fill={d.fill}
          opacity={d.highlight ? '1' : '0.2'}
          onMouseOver={() => { this.props.mouseOnClient(d.id); }}
          onMouseOut={() => this.props.mouseOutClient()}
          onClick={() => this.props.clientClick(d.data)}
        />
      ))}
    </g>;
    const projects = <g transform={`translate(${width / 2}, ${height / 2})`}>
      {this.state.projectSlice.map((d, i) => (
        <path
          key={i}
          d={d.d.path}
          fill='#FFFFFF'
          opacity={d.d.data.brushedDisplay ? '0.2' : d.d.data.highlight ? '1' : '0.2'}
          onMouseOver={() => this.props.mouseOnProject(d.d.data.id)} //TO DO:organize DATA array 
          onMouseOut={() => this.props.mouseOutProject()}
        />
      ))}
    </g>;
    const clientLogos = <g transform={`translate(${width / 2}, ${height / 2})`}>
      {this.state.clientSlice.map((d, i) => {
        const text = d.data.type === 'category' || d.data.type === 'more' ? <text
          x={d.textPos[0]}
          y={d.textPos[1]}
          opacity={d.data.textHighlight ? '1' : '0'}
          textAnchor={d.textAnchor}
          fill={d.fill}
          onMouseOver={() => { this.props.mouseOnClient(d.id); }}
          onMouseOut={() => this.props.mouseOutClient()}
          onClick={() => this.props.clientClick(d.data)}
        >
          {d.data.name}
        </text> : <g></g>;
        return <g key={i}>
          < image
            key={i}
            width={imageSize}
            height={imageSize}
            x={d.logo.centroid[0]}
            y={d.logo.centroid[1]}
            xlinkHref={d.img}
            opacity={d.highlight ? '1' : '0.2'}
            onMouseOver={() => { this.props.mouseOnClient(d.id); }}
            onMouseOut={() => this.props.mouseOutClient()}
            onClick={() => this.props.clientClick(d.data)}
          />
          {text}
        </g>;
      })}
    </g>;
    return (
      <React.Fragment>
        {clients}
        {clientLogos}
        {projects}
      </React.Fragment>
    );
  }
}
export default VizClient;
