import React from 'react';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import SearchResults from './searchResults';
import injectTapEventPlugin from 'react-tap-event-plugin';


injectTapEventPlugin();

export default class SearchBar extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      company_name : "",
      company_url : "",
      search_url : null
    };
  } 

  _handleNameChange(event){
    this.setState({company_name : event.target.value});
  }

  _handleUrlChange(event){
    this.setState({company_url : event.target.value});
  }

  _submitSearch(event){
    let searchUrl = 'http://localhost:9000/search/new?company_name=' + this.state.company_name + "&company_url=" + this.state.company_url;
    let component = this;
    fetch(searchUrl , {
      method: 'post'
    }).then(function(response){
      return response.text();
    }).then(function(search_id){
      component.setState({search_url: search_id});
    });
  }

  _checkSearch(event){
    this.setState({search_url: this.refs.hash_code.getValue()});
  }

  render() {
    return (
      <div>
          <div>
            <TextField 
              id="company_name" 
              hintText="Company Name" 
              onChange={this._handleNameChange.bind(this)} 
              value={this.state.company_name}
            />
            <TextField 
              id="company_name" 
              hintText="Company Url" 
              onChange={this._handleUrlChange.bind(this)}
              value={this.state.company_url}
            />
            <RaisedButton 
              label="Search!" 
              primary={true} 
              onTouchTap={this._submitSearch.bind(this)}/>
          </div>
          <div>
          {this.state.search_url === null ? "" : "Use this code in the field below to check up on your search: " + this.state.search_url + ". You can also let the page run in the background. It will poll the server for updates."}
          </div>
          <div>
            <TextField 
              id="find_search" 
              ref="hash_code"
              hintText="Search Code." 
            />
            <RaisedButton 
              label="Get Results!" 
              primary={true} 
              onTouchTap={this._checkSearch.bind(this)}/>
          </div>
          <SearchResults search_url={this.state.search_url} />
      </div>
    );
  }
}
