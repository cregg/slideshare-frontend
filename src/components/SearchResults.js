import React from 'react';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import LinearProgress from 'material-ui/lib/linear-progress';
import Snackbar from 'material-ui/lib/snackbar';
import config from 'webpack.config.js'


const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    maxHeight: '75%'
  },
  gridList: {
    width: '80%',
    height: '80%',
    overflowY: 'auto',
    marginBottom: 24
  }
};

export default class SearchResults extends React.Component {
  static propTypes = {
    name: React.PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      state_text : "",
      docs: [],
      visible_comps: {}
    };
  }

  componentWillReceiveProps(next_props) {
    if(next_props.search_url === null){
      return;
    }
    let thisComponent = this; 
    setInterval(function(){
      let full_url = 'https://slideshare-backend.herokuapp.com/search/' + next_props.search_url;
      fetch(full_url, {
        method: 'get'
      }).then(function(response){
        return response.json();
      }).then(function(items_plus_status_object){
        if(items_plus_status_object["items"] === null){
          thisComponent.setState({state_text: items_plus_status_object["status"]});
          return;
        }
        let array_of_docs = JSON.parse(items_plus_status_object["items"]);
        thisComponent.setState({
          docs: array_of_docs.filter((doc) => (doc.rating > 0)),
          state_text: items_plus_status_object["status"]
        });
      });
    }, 20000);
  }

  render() {
    return (
      <div style={styles.root}>
        <div>
        {config.api}
        {this.state.state_text}</div>
        <GridList 
          cellHeight={200}
          style={styles.gridList}
          cols={4}
        >
          {this.state.docs.map((doc) => (
            <GridTile 
              key={doc["ID"]}
              title={doc["Title"]}
              subtitle={"Keywords: " + doc["found_terms"].map((word) =>  (word + ", "))}
            >
              <a href={doc["URL"]} target="_blank" title={"Rating: " + Math.round(doc["rating"] * 100) + "%"}> 
                <img src={doc["ThumbnailXLargeURL"]} />
              </a>
            </GridTile>
          ))}
        </GridList>
      </div>
    );
  }
}
