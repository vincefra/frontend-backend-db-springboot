import React from 'react';

class Legend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className='legend'>
        <ul>
          <li className='legend-item'>

            <div>
              <div>{/* SPACE FOR ICON */}</div>
            </div>
            25 Employees

          </li>
          <li className='legend-item'>

            <div>
              <div>{/* SPACE FOR ICON */}</div>
            </div>
            25 Clients

          </li>
          <li className='legend-item'>

            <div>
              <div>{/* SPACE FOR ICON */}</div>
            </div>
            45 Projects

          </li>
          <li className='legend-item'>

            <div>
              <div>{/* SPACE FOR ICON */}</div>
            </div>
            40 Skills

          </li>
        </ul>
      </div>
    );
  }
}

export default Legend;
