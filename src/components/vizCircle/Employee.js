import React from 'react';

class Employee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const circle = this.calculateEmployee();
    this.setState({ circle: circle });
  }

  componentWillReceiveProps(nextProps) {
    const circl = this.calculateEmployee();
    this.setState({ circle: circl });
  }

  calculateEmployee() {
    const circle = {
      radius: '28',
      fill: '#98abc5',
      x: '0',
      y: '0'
    };

    return {
      circle
    };
  }
  render() {
    const circle = this.state.circle !== undefined ? this.state.circle : null;
    //create a unique id for each image mask
    const maskName = 'mask' + this.props.id;
    const fillMask = 'url(#mask' + this.props.id + ')';

    return (
      <g>
        {circle ? (
          <g>
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
                    xlinkHref='http://www.find-out.se/wp-content/uploads/2018/04/F_Brady_Ledger_FINDOUT_19_2_2284_sRGB_600px.jpg'
                  />
                </pattern>
              </defs>
              <circle
                r={this.props.radius}
                cy={this.props.pY}
                cx={this.props.pX}
                fill={fillMask}
              />
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
