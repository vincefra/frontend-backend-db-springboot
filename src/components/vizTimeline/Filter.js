import React, { Component } from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

class Filter extends Component {

  render() {
    const pos0 = this.props.filterPosition[0];
    const pos1 = this.props.filterPosition[1];
    return (
      <div className="filter">
        <Range
          min={this.props.minFilterValue}
          max={this.props.maxFilterValue}
          defaultValue={[this.props.defaultValueMin, this.props.defaultValueMax]}
          value={[pos0, pos1]}
          steps={1}
          onChange={(value) => this.props.afterChangeFunction(value[0], value[1])}
        />
      </div>
    );
  }
}

export default Filter;