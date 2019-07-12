import React from "react";
import "./App.scss";
import VizCircle from "./components/vizCircle/VizCircle";
import Legend from "./components/legend/Legend";
import Dialogue from "./components/dialogue/Dialogue";

class App extends React.Component {
  state = {};

  render() {
    return (
      <div>
        <div className="mobile-message">
          <div className="logo d-flex large">
            <div className="spacing-h small" />
            <h1>Find Out Visualization</h1>
          </div>
          <div className="spacing" />
          <p>
            Please visit us from a desktop, this visualization is not
            responsive...
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
