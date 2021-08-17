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
import {InputWithLabel} from './UI';

type Props = {};
export default class EditCategories extends Component<Props> {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Edit: ' + navigation.getParam('headerTitle'),
    };
  };
  constructor(props) {
    super(props);

    this.state = {
      cat_id: this.props.navigation.getParam('id'),
      name: this.props.navigation.getParam('name'),
    };

    this._updateSingleCategory = this._updateSingleCategory.bind(this);
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
      </SafeAreaView>
    );
  }
}

const styles2 = StyleSheet.create({
  Space: {
    flex: 1.0,
  },
});
