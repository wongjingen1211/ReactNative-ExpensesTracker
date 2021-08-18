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
import Prompt from 'react-native-input-prompt';
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
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      isFetching: false,
      prompt_visible: false,
    };

    this._selectAllCategory = this._selectAllCategory.bind(this);
    this._insertSingleTransaction = this._insertSingleTransaction.bind(this);
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

  _insertSingleTransaction(newName) {
    let newCategoryName = newName;
    if (newCategoryName != '') {
      //check the input is empty or not
      let duplicateFlag = false;
      for (var [idex, item] of Object.entries(this.state.categories)) {
        //check the input is duplicated or not
        if (
          String(item.category_name).toLowerCase().trim() ===
          newCategoryName.toLowerCase().trim()
        ) {
          duplicateFlag = true;
          break;
        }
      }
      if (!duplicateFlag) {
        console.log('Added category: ' + newCategoryName);
        //configure the URL to point to the places table
        let url = 'http://192.168.1.192:5000/api/category';
        // invoke the ‘POST’ http request to server part
        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          //data is to be in JSON format
          body: JSON.stringify({
            category_name: newCategoryName,
          }),
        })
          .then(response => {
            if (!response.ok) {
              Alert.alert('Error', response.status.toString());
              throw Error('Error ' + response.status);
            }
            return response.json();
          })
          .then(responseJson => {
            if (responseJson.affected > 0) {
              Alert.alert('New Category Saved');
            } else {
              console.log('respond');
              console.log(responseJson.affected);
              Alert.alert('Error saving record');
            }
            //this.props.navigation.getParam('refresh')();  //all getParam wont work.
            this._selectAllCategory();
          })
          .catch(error => {
            console.error(error);
          });
      } else Alert.alert('Duplicated category name.');
    } else Alert.alert('Please insert a name for new category.');
  }

  render() {
    console.log('Screen Loading');
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
                <Text style={styles2.text}>{item.category_name}</Text>
              </TouchableHighlight>
            );
          }}
          keyExtractor={item => {
            item.category_id.toString();
          }}
        />

        <Prompt
          visible={this.state.prompt_visible}
          title="Input New Category"
          placeholder="Type the category name"
          onCancel={() =>
            this.setState({
              prompt_visible: !this.state.prompt_visible,
            })
          }
          onSubmit={text => {
            this.setState({
              prompt_visible: !this.state.prompt_visible,
            });
            this._insertSingleTransaction(text);
          }}
        />

        <FloatingAction
          actions={actions}
          color={'lightblue'}
          onPressItem={() => {
            this.setState({prompt_visible: true});
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
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#e7e7e7',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 18,
  },
});
