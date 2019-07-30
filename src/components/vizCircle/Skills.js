import React from 'react';
import { calculateLinks } from './actions';

class Skills extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: {}
    };
  }

  componentDidMount() {
    this.setState({ nodes: calculateLinks(this.props) });
  }

  componentWillReceiveProps(props) {
    this.setState({ nodes: calculateLinks(props) });
  }

  render() {
    const width = this.props.size[0];
    const height = this.props.size[1];
    const radius = (height - height * 0.15) / 2;
    return (
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {this.state.nodes.children !== undefined ? (
          this.state.nodes.children.map((d, i) => {
            return (
              <g
                className='skills'
                key={i}
                transform={`rotate(${d.angle}) translate(${radius})`}
                opacity={d.data.highlight ? '1' : '0'}
                onMouseOver={() => this.props.mouseOnSKill(d.data.id)}
                onMouseOut={() => this.props.mouseOutSkill()}
              >
                <circle
                  r="2.5"
                  opacity={!d.data.highlight ? '1' : '0'}
                ></circle>
                <text
                  key={i}
                  x={d.txtPosX}
                  dy=".31em"
                  transform={`rotate(${d.textRotation}) `}
                  textAnchor={d.anchorText}
                >
                  {d.data.name}
                </text>
              </g>
            );
          })
        ) : (
          <g />
        )}
      </g>
    );
  }
}

export default Skills;
