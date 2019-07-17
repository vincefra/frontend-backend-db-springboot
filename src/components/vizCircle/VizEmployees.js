import React from 'react';
import Employee from './Employee';
import * as d3 from 'd3';

const vizHeight = 0.7;

class VizEmployees extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      size: [500, 500]
    };
  }

  componentDidMount(props) {
    this.setLayout();
  }

  //Set a hierarchy to the data
  //creates a PACK Layout, calculates and sets all the atributes for the layout
  //Set the layout in the state
  setLayout() {
    const root = d3.hierarchy(this.props.employees);
    const height = this.props.size[1];
    const width = height - height * vizHeight;

    const packLayout = d3.pack();
    packLayout.size([width, width]);
    packLayout.padding(10);

    root.sum(d => {
      return 50;
    });
    const flayout = packLayout(root);
    this.setState({
      layout: flayout
    });

    return flayout;
  }

  componentWillReceiveProps(nextProps) {
    this.setLayout();
  }

  render() {
    //Get the size and diameter of the viz
    const width = this.props.size[0];
    const height = this.props.size[1];
    const diameter = height - height * vizHeight;

    //Create the Employee object with the photo
    const employeeLayout =
      this.state.layout !== undefined ? (
        this.state.layout.children.map((d, i) => {
          return (
            <Employee
              key={i}
              img={d.data.img}
              radius={d.r}
              pX={d.x}
              pY={d.y}
              id={d.data.id}
            />
          );
        })
      ) : (
          <div />
        );

    //return all the things to render
    return (
      // MOVE the GRAPHIC OBJECT TO THE CENTER
      <g
        ref="employees"
        transform={`translate(${width / 2 - diameter / 2}, ${height / 2 -
          diameter / 2})`}
      >
        {/* BACKGROUND CIRCLE */}
        <g ref='graph'>
          {/* <circle
            r={diameter}
            fill='#eceeef'
            transform={`translate(${diameter}, ${diameter})`}
          /> */}
          {/* ALL EMPLOYEES */}
          {employeeLayout}
        </g>
      </g>
    );
  }
}

export default VizEmployees;
