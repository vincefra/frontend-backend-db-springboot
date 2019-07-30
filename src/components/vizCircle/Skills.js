import React from 'react';
import { createLinks } from './data';

const distance = 0.1;

class Skills extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: {}
    };
  }

  componentDidMount(props) {
    const layOut = createLinks(this.props.skills);
    this.setState({
      nodes: layOut
    });
  }

  componentWillReceiveProps(props) {
    const layOut = createLinks(this.props.skills);
    this.setState({
      nodes: layOut
    });
  }

  render() {
    const width = this.props.size[0];
    const height = this.props.size[1];
    const radius = (height - height * distance) / 2;
    return (
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {this.state.nodes.children !== undefined ? (
          this.state.nodes.children.map((d, i) => {
            return (
              <g
                className='skills'
                key={i}
                transform={`rotate(${d.angle}) translate(${radius})`}
              >

                <text
                  key={i}
                  cx={d.txtPosX}
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
