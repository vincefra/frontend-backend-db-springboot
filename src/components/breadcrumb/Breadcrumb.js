import React from 'react';

class Breadcrumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      crumbs: []
    };
  }

  handleClick(index) {
    if (index + 1 === this.state.crumbs.length) return;
    const client = this.state.crumbs[index];
    this.resetHighlight(client);
    this.props.breadcrumbClick(client);
    const crumbs = this.state.crumbs.slice(0, index + 1);
    this.setState({ crumbs });
  }

  componentDidMount() {
    this.setState({ crumbs: [this.props.clickedClient] });
  }

  isEqual(previousList, nextList) {
    if (previousList.length !== nextList.length) return false;
    const previousIds = previousList.map(client => client.id);
    const nextIds = nextList.map(client => client.id);
    return previousIds.filter(x => !nextIds.includes(x)).length === 0;
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (this.props.clickedClient.length === 0) return;
    const nextClients = this.props.clickedClient.list;
    if (!this.isEqual(prevProps.clickedClient.list, nextClients) && nextClients.length.list !== 0) {
      const crumbs = [...prevState.crumbs, this.props.clickedClient];
      this.setState({ crumbs });
    }
  }

  resetHighlight(clients) {
    clients.list.forEach(client => client.highlight = true);
    return clients;
  }

  render() {
    const crumbs = this.state.crumbs.map((_, i) => (
      <span className='crumb' onClick={this.handleClick.bind(this, i)} key={i} />
    ));
    return (
      <div className='breadcrumbs'>
        {crumbs}
      </div>
    );
  }
}

export default Breadcrumb;