import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  TouchableHighlight,
  FlatList,
  ToastAndroid,
} from 'react-native';
import Prompt from 'react-native-input-prompt';
import { FloatingAction } from 'react-native-floating-action';

const actions = [
  {
    text: 'Add',
    icon: require('../../assets/icons/create.png'),
    name: 'add',
    position: 1,
  },
];

let config = require('../../Config');

type Props = {};
export default class CategoryScreen extends Component {
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
    let url = config.settings.serverPath + '/api/category';
    this.setState({ isFetching: true });
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
        this.setState({ categories });
        //update the dictionary
        this.setState({ isFetching: false });
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
        let url = config.settings.serverPath + '/api/category';
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

        <View style={{ flex: 1, width: '100%' }}>
          <FlatList style={styles2.flatlist}
            data={this.state.categories}
            extraData={this.state}
            showsVerticalScrollIndicator={true}
            renderItem={({ item }) => {
              return (
                <TouchableHighlight
                  style={styles2.item}
                  onPress={() => {
                    if (item.category_id != 1) {
                      //prevent user to edit the defualt category
                      this.props.navigation.navigate('EditCategories', {
                        id: item.category_id,
                        name: item.category_name,
                        refresh: this._selectAllCategory,
                      });
                    } else {
                      ToastAndroid.showWithGravityAndOffset(
                        'Cannot modify default category.',
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50,
                      );
                    }
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
            color={'#6775c2'}
            onPressItem={() => {
              this.setState({ prompt_visible: true });
            }}
          />
        </View>
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
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#edf5ff',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 18,
  },
  item: {
    paddingTop: 10,
  },
});
