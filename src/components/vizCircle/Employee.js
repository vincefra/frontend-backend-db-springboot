import React from 'react';
import { calculateEmployee, getInitials } from './actions';

class Employee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState({ circle: calculateEmployee() });
  }

  render() {
    const circle = this.state.circle ? this.state.circle : null;
    //create a unique id for each image mask
    const maskName = 'mask' + this.props.id;
    const fillMask = 'url(#mask' + this.props.id + ')';
    const image = !this.props.img ? 
      <text 
        textAnchor='middle'
        x={this.props.pX}
        y={this.props.pY + 1}
        dominantBaseline='middle'
        fontSize={this.props.radius}
      > 
        {getInitials(this.props.name)}
      </text> :
      <circle
        r={this.props.radius}
        cy={this.props.pY}
        cx={this.props.pX}
        fill={fillMask}
      />;

    return (
      <g>
        {circle ? (
          <g
            onMouseOver={() => this.props.mouseOnEmployee(this.props.id)}
            onMouseOut={() => this.props.mouseOutEmployee()}
            opacity={this.props.opacity}
          >
            <circle
              cx={this.props.pX}
              cy={this.props.pY}
              r={this.props.radius}
              fill={circle.circle.fill}
            />

            <g>
              <defs id='imgdefs'>
                <pattern id={maskName} height='1' width='1' x='0' y='0'>
                  <image
                    height={this.props.radius * 2}
                    width={this.props.radius * 2}
                    xlinkHref={this.props.img}
                  />
                </pattern>
              </defs>
              {image}
            </g>
          </g>
        ) : (
          <h4>No image</h4>
        )}
      </g>
    );
  }
}

export default Employee;
