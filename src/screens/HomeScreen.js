import React, {Component} from 'react';
import 'react-native-gesture-handler';
import CalendarPicker from 'react-native-calendar-picker';
import {
  StyleSheet,
  Button,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TouchableHighlight,
  FlatList,
  DatePickerAndroid,
  Alert,
} from 'react-native';
import {AppButton} from './UI';
import {NavigationContainer} from '@react-navigation/native';

let config = require('../../Config');

type Props = {};
export default class HomeScreen extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      selected_date: Date.parse(new Date()),
      selected_transactions: [],
      isFetching: false,
    };

    this._selectTransactions = this._selectTransactions.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  componentDidMount() {
    this._selectTransactions();
  }

  _selectTransactions() {
    //preprocess the date format----------
    var selectedDate = this.state.selected_date; //get the current date

    var start_day = new Date(selectedDate).getDate();
    var start_month = new Date(selectedDate).getMonth();
    var start_year = new Date(selectedDate).getFullYear();
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
    start_month = monthsText[start_month];
    console.log(start_month + ' ' + start_day + ',' + start_year);
    let startTime_parsed = Date.parse(
      start_month + ' ' + start_day + ',' + start_year,
    ); //(data type: integer)the 12:00am of the CURRENT day
    let endTime_parsed = startTime_parsed + 86400000; //(data type: integer)the 12:00am of the NEXT day

    console.log(
      'Viewing Transactions from:' +
        new Date(startTime_parsed) +
        ' to ' +
        new Date(endTime_parsed),
    );
    console.log(startTime_parsed);
    console.log(endTime_parsed);
    //preprocess the date format----------
    let url =
      config.settings.serverPath +
      '/api/transaction/all/' +
      startTime_parsed +
      '/' +
      endTime_parsed;
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
      .then(selected_transactions => {
        this.setState({selected_transactions});
        //update the dictionary
        this.setState({isFetching: false});
      })
      .catch(error => {
        console.log(error);
      });
  }

  onDateChange(date) {
    this.setState({
      selected_date: date,
    }); 
    setTimeout(() => {
       this._selectTransactions();
   }, 500); //wait for the cateogry load
  }


  render() {
    if (this.state.selected_date == 0) var date = new Date();
    else var date = this.state.selected_date;
    var dateday = new Date(date).getDate();
    var month = new Date(date).getMonth();
    var year = new Date(date).getFullYear();
    var day = new Date(date).getDay();
    let daysText = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let monthsText = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',];
    var dayName = daysText[day];
    var monthName = monthsText[month];
    var newdate = dayName + ' ' + dateday + ' ' + monthName + ' ' + year;

    const maxDate = new Date(); // Today
    const minDate = new Date(2000, 1, 1);

    console.log(this.state.selected_transactions);
    return (
      <SafeAreaView style={{flex: 1}}>

        <View style={styles.container}>
        <CalendarPicker
          minDate={minDate}
          maxDate={maxDate}
          onDateChange={this.onDateChange}
        />
        </View>

        <View>
          <Text>{newdate}</Text>
          <FlatList
            data={this.state.selected_transactions}
            extraData={this.state}
            showsVerticalScrollIndicator={true}
            renderItem={({item}) => {
              return (
                <TouchableHighlight
                  underlayColor={'#cccccc'}
                  onPress={() => 
                    {
                    this.props.navigation.navigate('EditExpense', {
                      id: item.transaction_id,
                      refresh: this._selectAllCategory,
                    });
                  }
                  }>
                  <View style={styles.transaction_row}>
                    <Text style={styles.text}>{item.amount}</Text>
                    <Text style={styles.text}>{item.category_name}</Text>
                  </View>
                </TouchableHighlight>
              );
            }}
            keyExtractor={item => {
              item.transaction_id;
            }}
          />
        </View>

        <View style={{flex: 1, padding: 16}}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Expense')}>
            <Text>Add Transaction</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 4,
    backgroundColor: '#FFFFFF',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginTop: 16,
  },
  text: {},
  transaction_row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#e7e7e7',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 18,
  },
});
