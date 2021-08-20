import React, {useState, Component} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import CategoryButton from '../../component/CategoryButton';
import {bold} from 'jest-matcher-utils/node_modules/chalk';
import {styles} from 'ansi-colors';
import {NavigationContainer} from '@react-navigation/native';
import {InputWithLabel, AppButton} from './UI';

type Props = {};
export default class EditCategories extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      cat_id: 1, //this.props.navigation.getParam('id'),
      name: 'temp', //this.props.navigation.getParam('name'),
    };

    this._updateSingleCategory = this._updateSingleCategory.bind(this);
    this._deleteSingleCategory = this._deleteSingleCategory.bind(this);
  }

  _updateSingleCategory() {
    //configure the URL to point to the placeID to be updated
    let url = 'http://192.168.1.192:5000/api/category/' + this.state.cat_id;
    // invoke the ‘PUT http request to server part
    fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      //data is to be in JSON format
      body: JSON.stringify({
        category_id: this.state.cat_id,
        category_name: this.state.name,
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
          Alert.alert('Record Updated');
        } else {
          Alert.alert('Error updating record');
        }
        this.props.navigation.getParam('refresh')();
        this.props.navigation.goBack();
      })
      .catch(error => {
        console.error(error);
      });
  }

  _deleteSingleCategory() {
    Alert.alert(
      'Confirm Deletion',
      'Delete `' + this.state.name + '`?',
      [
        {
          text: 'No',
          onPress: () => {},
        },
        {
          text: 'Yes',
          onPress: () => {
            //configure the URL to point to the placeID to be deleted
            let url =
              'http://192.168.1.192:5000/api/category/' + this.state.cat_id;
            //invoke the ‘DELETE’ http request to server part
            fetch(url, {
              method: 'DELETE',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              //data is to be in JSON format
              body: JSON.stringify({category_id: this.state.cat_id}),
            })
              .then(response => {
                if (!response.ok) {
                  Alert.alert('Error', response.status.toString());
                  throw Error('Error ' + response.status);
                }
                return response.json();
              })
              .then(responseJson => {
                if (responseJson.affected == 0) {
                  Alert.alert('Error deleting record');
                }
                this.props.navigation.getParam('refresh')();
                this.props.navigation.goBack();
              })
              .catch(error => {
                console.error(error);
              });
          },
        },
      ],
      {cancelable: false},
    );
  }

  render() {
    return (
      <SafeAreaView style={styles2.Space}>
        <InputWithLabel
          style={styles.input}
          label={'Category Name'}
          value={this.state.category_name}
          onChangeText={category_name => {
            this.setState({category_name});
          }}
          orientation={'vertical'}
        />
        <AppButton
          style={styles.button}
          title={'Save'}
          theme={'primary'}
          onPress={() => {
            this._updateSingleCategory();
          }}
        />
        <AppButton
          style={styles.button}
          title={'Delete Category'}
          theme={'primary'}
          onPress={() => {
            this._deleteSingleCategory();
          }}
        />
        <Text>
          ***this page is fixed on editing category id:1 for demo purpose, cause
          the getParam at (line 24-25) wont work.***
        </Text>
      </SafeAreaView>
    );
  }
}

const styles2 = StyleSheet.create({
  Space: {
    flex: 1.0,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
});
