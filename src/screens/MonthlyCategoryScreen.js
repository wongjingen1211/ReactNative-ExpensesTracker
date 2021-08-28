import React, { Component } from 'react';
import 'react-native-gesture-handler';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableHighlight,
  FlatList,
  DatePickerAndroid,
  Alert,
  AsyncStorage,
} from 'react-native';


let config = require('../../Config');

type Props = {};
export default class MonthlyCategoryScreen extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      dateInString: '',
      start_MonthYear: 0,
      end_MonthYear: 0,
      selected_categoryName: props.route.params.categoryName,
      selected_transactions: [],
      isFetching: false,
    };

    this._selectTransactions = this._selectTransactions.bind(this);
    this._readSettings = this._readSettings.bind(this);
    this._initalFunction = this._initalFunction.bind(this);
  }

  componentWillMount() {
    this._initalFunction();
  }

  _initalFunction() {
    this._readSettings();
    setTimeout(() => {
      this._selectTransactions(
        this.state.start_MonthYear,
        this.state.end_MonthYear,
        this.state.selected_categoryName,
      );
    }, 1000); //wait for the data load
  }

  async _readSettings() {
    let newStates = {};
    try {
      let keys = await AsyncStorage.multiGet(
        ['start_MonthYear', 'end_MonthYear'],
        (err, stores) => {
          stores.map((result, i, store) => {
            // get at each store's key/value so you can work with it
            let key = store[i][0]; // the key
            let value = store[i][1]; // the value
            {
              newStates[key] = parseFloat(value);
              console.log(parseFloat(value));
            }
          });
          this.setState(newStates);
        },
      );
    } catch (error) {
      console.log('## ERROR READING ITEMS ##: ', error);
    }
  }

  _selectTransactions(start_time, end_time, category_name) {
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
    //preprocess the date format----------
    var selectedmonth = new Date(start_time).getMonth();
    var selectedyear = new Date(start_time).getFullYear();

    console.log(
      'Viewing Transactions of ' +
      category_name +
      ' in:' +
      monthsText[selectedmonth] +
      ',' +
      selectedyear,
    );
    this.setState({
      dateInString: monthsText[selectedmonth] + ',' + selectedyear,
    });

    //preprocess the date format----------
    let url =
      config.settings.serverPath +
      '/api/transaction/monthlyCategorySummarize/' +
      start_time +
      '/' +
      end_time +
      '/' +
      category_name;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          Alert.alert('Error', response.status.toString());
          throw Error('Error ' + response.status);
        }
        return response.json();
      })
      .then(selected_transactions => {
        this.setState({ selected_transactions });
        console.log(selected_transactions);
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View>

          <Text style={styles.date}>{this.state.dateInString}</Text>
          <Text style={{ fontSize: 18, marginTop: 10 }} >{this.state.selected_categoryName}</Text>
          <FlatList
            data={this.state.selected_transactions}
            extraData={this.state}
            showsVerticalScrollIndicator={true}
            renderItem={({ item }) => {
              return (
                <TouchableHighlight
                  underlayColor={'#cccccc'}
                  onPress={() => {
                    this.props.navigation.navigate('EditExpense', {
                      id: item.transaction_id,
                      refresh: this._initalFunction,
                    });
                  }}>
                  <View style={styles.transaction_row}>
                    <Text style={styles.text}>{item.amount}</Text>
                    <Text style={styles.text}>
                      {new Date(item.process_date).getDay() +
                        1 +
                        '/' +
                        (new Date(item.process_date).getMonth() + 1) +
                        '/' +
                        new Date(item.process_date).getFullYear()}
                    </Text>
                  </View>
                </TouchableHighlight>
              );
            }}
            keyExtractor={item => {
              item.transaction_id;
            }}
          />
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
  text: {
    fontSize: 18,
    color: '#20232a',
    textAlign: 'center',
  },
  transaction_row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#000',
    backgroundColor: '#edf5ff',
  },
  date: {
    textAlign: 'center',
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#c4c4c4',
    paddingBottom: 5,
    fontWeight: 'bold',
  },
});
