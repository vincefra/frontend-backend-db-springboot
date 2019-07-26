import React from 'react';

class Dialogue extends React.Component {



  render() {
    const { dialogueIsShown, image, name, type, childrenInfo } = this.props;
    const imageDisplay = image === null ? <i className="fas fa-laptop-code"></i> : <img src={image} alt={name} />;
    return (
      <div>
        <div className={dialogueIsShown ? 'dialogue' : 'dialogue hidden'}>
          <div className='identification'>
            {imageDisplay}
            <div className="spacing x-small"></div>
            <h2>{name}</h2>
            <p>{type}</p>
          </div>
          <div className='information'>
            {childrenInfo}
          </div>
        </div>
      </div>
    );
  }
}

export default Dialogue;
