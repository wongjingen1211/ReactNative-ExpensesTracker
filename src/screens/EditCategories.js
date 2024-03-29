import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  LogBox, 
} from 'react-native';
import { InputWithLabel, AppButton } from './UI';

let config = require('../../Config');

LogBox.ignoreLogs([
 'Non-serializable values were found in the navigation state',
]);

type Props = {};
export default class EditCategories extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      cat_id: props.route.params.id,
      category_name: props.route.params.name,
    };

    this._updateSingleCategory = this._updateSingleCategory.bind(this);
    this._deleteSingleCategory = this._deleteSingleCategory.bind(this);
  }

  _updateSingleCategory() {
    //configure the URL to point to the placeID to be updated
    let url = config.settings.serverPath + '/api/category/' + this.state.cat_id;
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
        category_name: this.state.category_name,
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
        this.props.route.params.refresh();
        this.props.navigation.goBack();
      })
      .catch(error => {
        console.error(error);
      });
  }

  _deleteSingleCategory() {
    Alert.alert(
      'Confirm Deletion',
      'Delete `' + this.state.category_name + '`?',
      [
        {
          text: 'No',
          onPress: () => { },
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
              body: JSON.stringify({ category_id: this.state.cat_id }),
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
                this.props.route.params.refresh();
                this.props.navigation.goBack();
              })
              .catch(error => {
                console.error(error);
              });
          },
        },
      ],
      { cancelable: false },
    );
  }

  render() {
    return (
      <SafeAreaView style={styles2.Space}>

        <InputWithLabel
          style={styles2.input}
          label={'Category Name'}
          value={String(this.state.category_name)}
          onChangeText={category_name => {
            this.setState({ category_name });
          }}
          orientation={'vertical'}
        />


        <View style={styles2.buttonSpace}>
          <AppButton
            style={styles2.button}
            title={'Save'}
            theme={'save'}
            onPress={() => {
              this._updateSingleCategory();
            }}
          />
          <AppButton
            style={styles2.button}
            title={'Delete Category'}
            theme={'primary'}
            onPress={() => {
              this._deleteSingleCategory();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles2 = StyleSheet.create({
  Space: {
    flex: 1,
    padding: 20,
  },
  buttonSpace: {
    flex: 3,
    height: 30,
  },
  input: {
    flex: 1,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,

  },
});
