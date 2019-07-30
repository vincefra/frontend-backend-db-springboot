import React from 'react';
import Crumb from './Crumb';

class Breadcrumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      crumbs: []//this.props.clients
    };
  }

  onNavigate(index, client) {
    // Return clients of index and remove from index and crumbs.length
  }

  componentDidMount() {
    this.setState({
      crumbs: [this.newCrumb(this.props.clickedClient)]
    });
  }

  isEqual(previousList, nextList) {
    if (previousList.length !== nextList.length) return false;
    let previousIds = previousList.map(client => client.id);
    let nextIds = nextList.map(client => client.id);
    return previousIds.filter(x => !nextIds.includes(x)).length === 0;
  }

  componentDidUpdate(prevProps) {
    if (!this.isEqual(prevProps.clickedClient, this.props.clickedClient)) {
      const crumbs = this.state.crumbs.push(this.newCrumb(this.props.clickedClient));
      return ({ crumbs });
    }
  }

  newCrumb(clients) {
    return (
      <Crumb 
        onNavigate={this.onNavigate.bind(this, this.state.crumbs.length)} 
        clients={clients} 
        key={this.state.crumbs.length}
      />
    );
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