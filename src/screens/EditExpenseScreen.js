import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  DatePickerAndroid,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { InputWithLabel, AppButton, CategoryPickerWithLabel } from './UI';

let config = require('../../Config');

type Props = {};
export default class EditExpensesScreen extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      transaction_id: props.route.params.id,
      category_name: '',
      amount: 0,
      memo: '',
      process_date: 0,
      category_id: 1,
      categories: [],
      isFetching: false,
    };

    this._selectAllCategory = this._selectAllCategory.bind(this);
    this._selectSingleTransaction = this._selectSingleTransaction.bind(this);
    this._updateSingleTransaction = this._updateSingleTransaction.bind(this);
    this._deleteTransaction = this._deleteTransaction.bind(this);
  }

  componentWillMount() {
    console.log('Start page---------------------------------');
    this._selectAllCategory();
    setTimeout(() => {
      this._selectSingleTransaction();
    }, 500); //wait for the cateogry load
    setTimeout(() => {
      //load the correct category id
      for (let item in this.state.categories) {
        if (
          this.state.categories[item].category_name === this.state.category_name
        ) {
          let cat_id = this.state.categories[item].category_id;
          this.setState({ category_id: cat_id });
          console.log(cat_id);
          break;
        }
      }
    }, 1000);
  }

  openDatePicker = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        maxDate: new Date(), // Today
        minDate: new Date(2000, 1, 1),
        mode: 'calendar',
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        let selectedDate = new Date(year, month, day);
        let selectedDatesec = selectedDate.getTime();
        this.setState({
          process_date: selectedDatesec,
        });
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  };

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

  _selectSingleTransaction() {
    let url =
      config.settings.serverPath +
      '/api/transaction/single/' +
      this.state.transaction_id;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          Alert.alert('Error', response.status.toString());
          throw Error('Error ' + response.status);
        }
        return response.json();
      })
      .then(transaction => {
        console.log(transaction);
        this.setState({
          category_name: transaction.category_name,
          amount: transaction.amount,
          memo: transaction.memo,
          process_date: transaction.process_date,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  _updateSingleTransaction(INcategory_id, INamount, INmemo, INprocess_date) {
    let url =
      config.settings.serverPath +
      '/api/transaction/' +
      this.state.transaction_id;
    // invoke the ‘PUT http request to server part
    fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      //data is to be in JSON format
      body: JSON.stringify({
        transaction_id: this.state.transaction_id,
        category_id: INcategory_id,
        amount: INamount,
        memo: INmemo,
        process_date: INprocess_date,
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
          Alert.alert('Transaction Record Updated');
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

  _deleteTransaction(transID) {
    console.log('Clicked delete button');
    Alert.alert(
      'Confirm Deletion',
      'Delete this transaction record`?',
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
              config.settings.serverPath + '/api/transaction/' + transID;
            //invoke the ‘DELETE’ http request to server part
            fetch(url, {
              method: 'DELETE',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              //data is to be in JSON format
              body: JSON.stringify({ transaction_id: transID }),
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
    var date = this.state.process_date;
    var dateday = new Date(date).getDate();
    var month = new Date(date).getMonth();
    var year = new Date(date).getFullYear();
    var day = new Date(date).getDay();
    let daysText = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let monthsText = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    var dayName = daysText[day];
    var monthName = monthsText[month];
    var newdate = dayName + ' ' + dateday + ' ' + monthName + ' ' + year;

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.date}>{newdate}</Text>

        <View style={styles.inputSection}>
          <InputWithLabel
            style={styles.input}
            label={'Amount'}
            value={this.state.amount.toString()}
            keyboardType={'numeric'}
            onChangeText={amount => {
              this.setState({ amount });
            }}
            orientation={'vertical'}
          />
          <CategoryPickerWithLabel
            style={styles.picker}
            label={'Category'}
            items={this.state.categories}
            mode={'dialog'}
            value={this.state.category_name}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({ category_id: itemIndex + 1 });
            }}
            orientation={'vertical'}
            textStyle={{ fontSize: 24 }}
          />
          <InputWithLabel
            style={styles.input}
            label={'Memo'}
            value={this.state.memo}
            onChangeText={memo => {
              this.setState({ memo });
            }}
            orientation={'vertical'}
          />
        </View>
        <View style={styles.btnSection}>

          <AppButton
            style={styles.button}
            title={'Pick A Date'}
            theme={'primary'}
            onPress={this.openDatePicker}
          />

          <AppButton
            style={styles.button}
            title={'Save'}
            theme={'save'}
            onPress={() => {
              console.log(
                this.state.category_id +
                '---' +
                this.state.amount +
                '---' +
                this.state.memo +
                '---' +
                this.state.process_date,
              );
              this._updateSingleTransaction(
                this.state.category_id,
                this.state.amount,
                this.state.memo,
                this.state.process_date,
              );
            }}
          />
        </View>
        <View style={{ padding: 50 }}>
          <TouchableOpacity
            style={styles.touchableOpacityStyle}
            onPress={() => {
              this._deleteTransaction(this.state.transaction_id);
            }}>
            <Image
              source={require('../../assets/icons/delete.png')}
              style={styles.floatingButtonStyle}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  input: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  picker: {
    color: '#000',
    marginTop: 20,
    marginBottom: 20,
  },
  inputSection: {
    backgroundColor: 'white',
    paddingTop: 10,
    padding: 30,
    marginTop: 20,
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  btnSection: {
    marginTop: 10,

  },
  date: {
    textAlign: 'center',
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#c4c4c4',
    paddingBottom: 5,
    fontWeight: 'bold',
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 20,
    borderRadius: 30,
    backgroundColor: '#6775c2',
    shadowColor: 'black',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowOffset: { width: 56, height: 13 },
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 35,
    height: 35,
  },
});
