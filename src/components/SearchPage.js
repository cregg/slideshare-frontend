import React from 'react';
import SearchBar from './searchBar';

export default class SearchPage extends React.Component {
  static propTypes = {
    name: React.PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <SearchBar/>
      </div>
    );
  }
}
