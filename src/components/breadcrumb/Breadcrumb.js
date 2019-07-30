import React from 'react';
import Crumb from './Crumb';

class Breadcrumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      crumbs: [<Crumb onNavigate={this.onNavigate.bind(this, 0)} clients={[1]} key={0}/>]//this.props.clients
    };
  }

  onNavigate(index, client) {
    // Return clients of index and remove from index and crumbs.length
  }


  componentWillReceiveProps(props) {
    this.addCrumb(props.clients);
  }

  addCrumb(clients) {
    let crumb = (
      <Crumb 
        onNavigate={this.onNavigate.bind(this, this.state.crumbs.length)} 
        clients={clients} 
        key={this.state.crumbs.length}
      />
    );

    this.setState({
      crumbs: [...this.state.crumbs, crumb]
    });
  }

  render() {
    return (
      <div className='breadcrumbs'>
        {this.state.crumbs}
      </div>
    );
  }

}

export default Breadcrumb;