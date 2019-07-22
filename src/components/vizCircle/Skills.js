import React from 'react';
import * as d3 from 'd3';

class Skills extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: {}
    };
  }

  componentDidMount(props) {
    this.calculateLinks();
  }

  componentWillReceiveProps(props) {
    this.calculateLinks();
  }

  calculateLinks() {
    //Create a hierarchy and sort it alphabetically
    const data = this.props.skills;
    const root = d3
      .hierarchy(data)
      .sort((a, b) => a.data.name.localeCompare(b.data.name));
    //create a tree layout an process the
    const treeLayout = d3.tree();

    //angle scale to calculate the angle they should be based on their X distance
    const angleScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, 360]);

    const layOut = treeLayout(root);

    for (let i in layOut.children) {
      let node = layOut.children[i];
      node.angle = angleScale(node.x); //set angle in radians
      node.textRotation = -node.angle;
      node.anchorText = node.angle < 90 || node.angle > 270 ? 'start' : 'end';
    }

    this.setState({
      nodes: layOut
    });
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
