import React, { Component, PureComponent } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  FlatList,
  AppState, Image
} from 'react-native';
import { FloatingAction } from 'react-native-floating-action';

let config = require('./Config');

const actions = [{
  text: 'Add',
  icon: require('./images/icon.png'),
  name: 'add',
  position: 1
}];

type Props = {};
export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Visited Places List',

  };

  constructor(props) {
    super(props)

    this.state = {
      places: [],
      isFetching: false,
    };

    this._query = this._query.bind(this);

  }

  componentDidMount() {
    this._query();
  }

  _query() {
    //read config.js for serverPath to complete URL
    let url = config.settings.serverPath + '/api/places';
    this.setState({isFetching: true});//fetching true for Flatlist
    
    fetch(url)
    .then((response) => {
      if(!response.ok) {
        //catch the responds error status
        Alert.alert('Error', response.status.toString());
        throw Error('Error ' + response.status);
      }
      //respond status e.g., 201 created, 202 OK, 404 no found
      return response.json()
    })
    //after places from server successfully, take the table places as input for further execution.
    .then((places) => {
      this.setState({places}); //update the dictionary
      this.setState({isFetching: false});
    })
    .catch((error) => {
      console.log(error)
    });
  }

  render() {
    let place = this.state.place;
    let date = this.state.date;
    return (
      <View style={styles.container}>
        <FlatList
          data={ this.state.places }
          extraData={this.state}
          showsVerticalScrollIndicator={ true }
          renderItem={({item}) => {
            var dateday = new Date(item.date ).getDate(); //take input item.date in milisec
            console.log(item.date )
            var month = new Date(item.date ).getMonth() ;
            var year = new Date(item.date ).getFullYear();
            var day = new Date(item.date ).getDay();
            var daysText = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            var monthsText = [
              'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep', 'Oct','Nov','Dec',];
            var dayName = daysText[day];
            var monthName = monthsText[month];
            var newdate = dayName + ', ' + dateday + ' ' + monthName + ', ' + year;

            return( <TouchableHighlight
              underlayColor={'yellow'}
              onPress={ () => {
                this.props.navigation.navigate('View', {
                  id: item.id,
                  date: item.date,
                  headerTitle: item.name,
                  refresh: this._query,
                })
              }}
            >
              <View style={styles.item}>
                <Text style={styles.itemTitle}>{ item.name }</Text>
                <Text style={styles.itemTitle}>{ item.city }</Text>
                <Text style={styles.itemSubtitle}>{ newdate}</Text>
              </View>
            </TouchableHighlight>);
          }}
          keyExtractor={(item) => {item.id.toString()}}
        />
        <FloatingAction
          actions={actions}
          overrideWithAction={true}
          color={'red'}
          onPressItem={
            () => {
              this.props.navigation.navigate('Create', {
                refresh: this._query,
              })
            }
          }
        />
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  item: {
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#000',

  },
  itemSubtitle: {
    fontSize: 18,
  }
});
