import React from 'react';

class Dialogue extends React.Component {
  render() {
    return (
      <div className='dialogue'>
        <div className='identification'>
          <img src='/img/Anki_Andersson.jpg' alt='' />
          <div>
            <h2>Emma Lindgren</h2>
            <p>Software Developer</p>
          </div>
        </div>
        <div className='information'>
          <div>
            <div className='dialogue-label'>Date Init</div>
            <div className='date-input'>04-08-2014</div>
          </div>
          <div>
            <div className='dialogue-label'>Date Init</div>
            <div className='date-input'>04-08-2014</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dialogue;
