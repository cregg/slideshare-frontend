import React from 'react';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import LinearProgress from 'material-ui/lib/linear-progress';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Subheader from 'material-ui/lib/Subheader';

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
      key_words: [],
      key_people: [],
      show_load: false
    };
  }

  componentWillReceiveProps(next_props) {
    if(next_props.search_url === null){
      return;
    }
    let thisComponent = this; 
    thisComponent.setState({show_load: true});
    setInterval(function(){
      let full_url = 'http://localhost:9000/search/' + next_props.search_url;
      fetch(full_url, {
        method: 'get'
      }).then(function(response){
        return response.json();
      }).then(function(items_plus_status_object){
        if(items_plus_status_object["items"] === null){
          let kw = items_plus_status_object["key_words"] === null ? [] : JSON.parse(items_plus_status_object["key_words"]);
          let kp = items_plus_status_object["key_people"] === null ? [] : JSON.parse(items_plus_status_object["key_people"]);
          thisComponent.setState({
            state_text: items_plus_status_object["status"],
            key_words: kw,
            key_people: kp,
            show_load: false
          });
          return;
        }
        let array_of_docs = JSON.parse(items_plus_status_object["items"]);
        thisComponent.setState({
          docs: array_of_docs.filter((doc) => (doc.rating > 0)),
          state_text: items_plus_status_object["status"],
          key_words: JSON.parse(items_plus_status_object["key_words"]),
          key_people: JSON.parse(items_plus_status_object["key_people"]),
          show_load: false  
        });
      });
    }, 5000);
  }

  render() {
    return (
      <div style={styles.root}>
        <div>
          {this.state.show_load ? <LinearProgress mode="indeterminate"/> : this.state.state_text}
          <List>
            <Subheader>Company Key People</Subheader>
            {this.state.key_people.map((name) => (
              <ListItem primaryText={name}
              />    
            ))}
          </List>
          <List>
            <Subheader>Company Key Words/Products</Subheader>
            {this.state.key_words.map((name) => (
              <ListItem primaryText={name}
              />    
            ))}
          </List>
        </div>
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
