import React, { Component } from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

class Filter extends Component {
  formatDate(value) {
    return 'hello';
  }

  render() {
    return (
      <div className="filter">
        <Range
          min={this.props.minFilterValue}
          max={this.props.maxFilterValue}
          defaultValue={[this.props.defaultValueMin, this.props.defaultValueMax]}
          steps={1}
          onChange={(value) => this.props.afterChangeFunction(value[0], value[1])}
        />
      </div>
    );
  }
}

export default Filter;