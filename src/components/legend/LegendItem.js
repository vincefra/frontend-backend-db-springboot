import React from 'react';

class LegendItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: 0,
      text: '',
      isHovered: false,
      label: ''
    };
  }

  componentDidMount() {
    this.setState({
      type: this.props.type,
      text: this.setText(this.props.data, this.props.label)
    });
  }

  handleHover() {
    this.setState({
      isHovered: true
    });
    this.props.overEvent(this.props.type);
  }

  setText(data, label) {
    let text = `${data} ${label}`;
    if (data !== 1) 
      if (label.charAt(label.length - 1) === 's') text += '\'';
      else text += 's'; 
    return text;
  } 

  handleUnHover() {
    this.setState({
      isHovered: false
    });
    this.props.outEvent();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) 
      this.setState({
        text: this.setText(this.props.data, this.props.label)
      });
  }

  render() {
    return (
      <li className='legend-item'>
        <div
          role="menuitem"
          className={'thing'}
          onMouseEnter={() => this.handleHover()}
          onMouseLeave={() => this.handleUnHover()}
        >
          {this.state.text}
        </div>
      </li>
    );
  }
}

export default LegendItem;