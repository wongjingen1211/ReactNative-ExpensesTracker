import React, {useState, Component} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
  TouchableHighlight,
  FlatList,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import CategoryButton from '../../component/CategoryButton';
import {bold} from 'jest-matcher-utils/node_modules/chalk';
import {styles} from 'ansi-colors';
import {NavigationContainer} from '@react-navigation/native';
import {FloatingAction} from 'react-native-floating-action';

const actions = [
  {
    text: 'Add',
    icon: require('../../assets/icons/create.png'),
    name: 'add',
    position: 1,
  },
];

type Props = {};
export default class EditCategories extends Component {
  static navigationOptions = {
    title: 'City List',
  };
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      isFetching: false,
    };

    this._selectAllCategory = this._selectAllCategory.bind(this);
  }

  componentDidMount() {
    this._selectAllCategory();
  }

  _selectAllCategory() {
    //fetch all category in this function
    let url = 'http://192.168.1.192:5000/api/category';
    this.setState({isFetching: true});
    fetch(url)
      .then(response => {
        if (!response.ok) {
          //catch the responds error status
          Alert.alert('Error', response.status.toString());
          throw Error('Error ' + response.status);
        }
        //respond status e.g., 201 created, 202 OK, 404 no found
        return response.json();
      })
      //after places from server successfully, take the table places as i nput for further execution.
      .then(categories => {
        this.setState({categories});
        //update the dictionary
        this.setState({isFetching: false});
      })
      .catch(error => {
        console.log(error);
      });
  }
  render() {
    return (
      <SafeAreaView style={styles2.Space}>
        <FlatList
          data={this.state.categories}
          extraData={this.state}
          showsVerticalScrollIndicator={true}
          renderItem={({item}) => {
            return (
              <TouchableHighlight
                underlayColor={'#cccccc'}
                onPress={() => {
                  this.props.navigation.navigate('EditCategories', {
                    id: item.category_id,
                    name: item.category_name,
                    refresh: this._selectAllCategory,
                  });
                }}>
                <Text style={styles.text}>{item.category_name}</Text>
              </TouchableHighlight>
            );
          }}
          keyExtractor={item => {
            item.category_id.toString();
          }}
        />
        <FloatingAction
          actions={actions}
          color={'lightblue'}
          onPressItem={() => {
            this.props.navigation.navigate('Reminder', {
              refresh: this._selectAllCategory,
            });
          }}
        />
      </SafeAreaView>
    );
  }
}

const styles2 = StyleSheet.create({
  Space: {
    flex: 1.0,
  },
  Parent: {
    flex: 1.0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginLeft: 5,
  },
});
