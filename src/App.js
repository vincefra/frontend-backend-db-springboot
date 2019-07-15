import React from 'react';
import VizCircle from './components/vizCircle/VizCircle';
import Legend from './components/legend/Legend';
import Dialogue from './components/dialogue/Dialogue';
import {load} from './components/general';

class App extends React.Component {
  componentDidMount() {
    load();
  }

  state = {};

  render() {
    return (
      <div>
        <div className='mobile-message'>
          <div className='logo d-flex large'>
            <div className='spacing-h small' />
            <h1>Find Out Visualization</h1>
          </div>
          <div className='spacing' />
          <p>
            Please visit us from a desktop, this visualization is not
            responsive....
          </p>
        </div>
        <Legend />
        <Dialogue />
        <VizCircle />
      </div>
    );
  }
}

export default App;
