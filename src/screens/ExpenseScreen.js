import React, {Component} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  ScrollView,
  View,
  Button,
  DatePickerAndroid,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {InputWithLabel, AppButton, CategoryPickerWithLabel} from './UI';

type Props = {};
export default class ExpensesScreen extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      category_id: 1,
      amount: 0,
      memo: '',
      date: 0,
      categories: [],
      isFetching: false,
    };

    this._insertSingleTransaction = this._insertSingleTransaction.bind(this);
    this._selectAllCategory = this._selectAllCategory.bind(this);
  }

  componentDidMount() {
    this._selectAllCategory();
  }

  openDatePicker = async () => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: this.state.date,
        minDate: new Date(2021, 0, 1),
        maxDate: new Date(2099, 11, 31),
        mode: 'calendar',
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        let selectedDate = new Date(year, month, day);
        let selectedDatesec = selectedDate.getTime();
        this.setState({
          date: selectedDatesec,
        });
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  };

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

  _insertSingleTransaction() {
    if (this.state.date != 0) {
      //configure the URL to point to the places table
      let url = 'http://192.168.1.192:5000/api/transaction';
      // invoke the ‘POST’ http request to server part
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        //data is to be in JSON format
        body: JSON.stringify({
          category_id: this.state.category_id,
          amount: this.state.amount,
          memo: this.state.memo,
          date: this.state.date,
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
            Alert.alert('Record Saved');
          } else {
            console.log('respond');
            console.log(responseJson.affected);
            Alert.alert('Error saving record');
          }
          this.props.navigation.getParam('refresh')();
          this.props.navigation.goBack();
        })
        .catch(error => {
          console.error(error);
        });
    } else Alert.alert('Please insert a date for this transaction.');
  }

  render() {
    var date = this.state.date;
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
        <InputWithLabel
          style={styles.input}
          label={'Amount'}
          value={this.state.amount}
          keyboardType={'numeric'}
          onChangeText={amount => {
            this.setState({amount});
          }}
          orientation={'vertical'}
        />
        <CategoryPickerWithLabel
          style={styles.picker}
          label={'Category'}
          items={this.state.categories}
          mode={'dialog'}
          value={this.state.categories.name}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({category_id: itemIndex + 1});
          }}
          orientation={'vertical'}
          textStyle={{fontSize: 24}}
        />
        <InputWithLabel
          style={styles.input}
          label={'Memo'}
          value={this.state.memo}
          onChangeText={memo => {
            this.setState({memo});
          }}
          orientation={'vertical'}
        />

        <Text>{newdate}</Text>

        <AppButton
          style={styles.button}
          title={'Pick A Date'}
          theme={'primary'}
          onPress={this.openDatePicker}
        />

        <AppButton
          style={styles.button}
          title={'Save'}
          theme={'primary'}
          onPress={() => {
            console.log(
              this.state.category_id +
                '---' +
                this.state.amount +
                '---' +
                this.state.memo +
                '---' +
                this.state.date,
            );
            this._insertSingleTransaction();
          }}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
    marginBottom: 10,
  },
  picker: {
    color: '#000',
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
});
