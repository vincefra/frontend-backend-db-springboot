import React from "react";
import "./Legend.scss";

class Legend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="legend">
        <ul>
          <li className="legend-item">
            <a>
              <div>
                <div>{/* SPACE FOR ICON */}</div>
              </div>
              25 Employees
            </a>
          </li>
          <li className="legend-item">
            <a>
              <div>
                <div>{/* SPACE FOR ICON */}</div>
              </div>
              25 Clients
            </a>
          </li>
          <li className="legend-item">
            <a>
              <div>
                <div>{/* SPACE FOR ICON */}</div>
              </div>
              45 Projects
            </a>
          </li>
          <li className="legend-item">
            <a>
              <div>
                <div>{/* SPACE FOR ICON */}</div>
              </div>
              40 Skills
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export default Legend;
