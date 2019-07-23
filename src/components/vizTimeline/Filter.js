import React, { Component } from 'react';
// import Slider from 'rc-slider';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';


// const createSliderWithTooltip = Slider.createSliderWithTooltip;
// const Range = createSliderWithTooltip(Slider.Range);

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
          onChange={(value) => this.props.afterChangeFunction(value[0], value[1])} //TO-DO: Call proper function from here
        />
      </div>
    );
  }
}

export default Filter;