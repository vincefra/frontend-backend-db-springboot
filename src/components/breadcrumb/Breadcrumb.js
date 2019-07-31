import React from 'react';
import Crumb from './Crumb';

class Breadcrumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      crumbs: []
    };
  }

  handleClick(index, client) {
    if (index + 1 === this.state.crumbs.length) return;
    this.resetHighlight(client);
    this.props.breadcrumbClick(client);
    const crumbs = this.state.crumbs.slice(0, index + 1);
    this.setState({ crumbs });
  }

  componentDidMount() {
    this.setState({ crumbs: [this.newCrumb(this.props.clickedClient)] });
  }

  isEqual(previousList, nextList) {
    if (previousList.length !== nextList.length) return false;
    let previousIds = previousList.map(client => client.id);
    let nextIds = nextList.map(client => client.id);
    return previousIds.filter(x => !nextIds.includes(x)).length === 0;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.isEqual(prevProps.clickedClient, this.props.clickedClient)) {
      const crumbs = [...prevState.crumbs, this.newCrumb(this.props.clickedClient)];
      this.setState({ crumbs });
    }
  }

  resetHighlight(clients) {
    clients.forEach(client => client.highlight = true);
    return clients;
  }
  newCrumb(clients) {
    return (
      <Crumb 
        handleClick={this.handleClick.bind(this, this.state.crumbs.length)} 
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