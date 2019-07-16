import React from 'react';
import VizCircle from 'components/vizCircle/VizCircle';
import Legend from 'components/legend/Legend';
import Dialogue from 'components/dialogue/Dialogue';
import Loader from 'components/loader/Loader';
import {load} from 'components/general';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isMobileView: false
    };
  }

  async componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
    this.setState({ isLoading: true });
    await load();
    this.setState({ isLoading: false });
  }

  resize() {
    this.setState({ isMobileView : window.innerWidth <= 1180 });
  }

  render() {
    const mobileView = (
      <div className='mobile-message'>
        <div className='logo d-flex large'>
          <div className='spacing-h small' />
          <h1>FindOut Visualization</h1>
        </div>
        <div className='spacing' />
        <p>
          Please visit us from a desktop, this visualization is not
          responsive....
        </p>
      </div>
    );

    return (
      <React.Fragment>
        { this.state.isMobileView ? mobileView : this.state.isLoading ? <Loader /> : 
          <div>
            <Legend />
            <Dialogue />
            <VizCircle />
          </div>
        }
      </React.Fragment>
    );
  }
}

export default App;
