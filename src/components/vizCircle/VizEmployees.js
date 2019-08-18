import React from 'react';
import Employee from './Employee';
import * as d3 from 'd3';

const vizHeight = 0.58;

class VizEmployees extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
    };
  }

  componentDidMount({ employees } = this.props) {
    this.setLayout(employees);
  }

  //Set a hierarchy to the data
  //creates a PACK Layout, calculates and sets all the atributes for the layout
  //Set the layout in the state

  setLayout(employees) {
    const root = d3.hierarchy({
      name: 'employees',
      children: employees
    });

    const height = this.props.size[1];
    const width = height - height * vizHeight;
    const packLayout = d3.pack();
    packLayout.size([width, width]);
    packLayout.padding(10);
    root.sum(_ => 50);
    const flayout = packLayout(root);
    this.setState({ layout: flayout });
  }


  // componentWillReceiveProps(nextProps) {
  //   this.setLayout();
  // }

  sameEmployees(prevEmpl, nextEmpl) {
    if (prevEmpl.length !== nextEmpl.length) return false;
    let pIds = prevEmpl.map(e => e.id);
    let nIds = prevEmpl.map(e => e.id);
    return pIds.filter(id => !nIds.includes(id)).length === 0;
  }

  componentDidUpdate(prevProps) {
    if (!this.sameEmployees(prevProps.employees, this.props.employees))
      this.setLayout(this.props.employees);
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
              name={d.data.name}
              img={d.data.img}
              radius={d.r}
              selected={d.data.selected}
              pX={d.x}
              pY={d.y}
              id={d.data.id}
              mouseOnEmployee={this.props.mouseOnEmployee}
              mouseOutEmployee={this.props.mouseOutEmployee}
              opacity={d.data.highlight ? '1' : '0.1'}
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
          {employeeLayout}
        </g>
      </g>
    );
  }
}

export default VizEmployees;
