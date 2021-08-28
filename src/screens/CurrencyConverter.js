import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Alert, Button,SafeAreaView,Picker} from 'react-native';
import {InputWithLabel, CategoryPickerWithLabel, AppButton} from './UI';

let https = require('./Config/Config_CurrAPI');

type Props = {};
export default class CurrencyConverter extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      fromCurrency: 'USD',
      toCurrency: 'MYR',
      amount: '0',
      pick: 'USD',
      pick2: 'MYR',
      result: 0,

    };

    this._convertCurrency = this._convertCurrency.bind(this);
    this._update = this._update.bind(this);
  }

  // const CurrencyConverter = ({navigation}) => {
 _convertCurrency(amount, fromCurrency, toCurrency) {
    let apiKey = '5bd57995adf465ec1792';

    fromCurrency = encodeURIComponent(fromCurrency);
    toCurrency = encodeURIComponent(toCurrency);
    let query = fromCurrency + '_' + toCurrency;

    let url =
      https.settings.serverPath +
      '/api/v7/convert?q=' +
      query +
      '&compact=ultra&apiKey=' +
      apiKey;

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
      .then(response => {
        console.log(response[query]*amount);
        this.setState({
                result: (response[query]*amount).toFixed(2),
              });
      })
      .catch(error => {
        console.log(error);
      });
  }

  _update() {
    this._convertCurrency(Number(this.state.amount), this.state.pick, this.state.pick2);
    setTimeout(() => {
       Alert.alert('Converted amount: ' + this.state.result);
   }, 1000); //wait for the cateogry load
  }

  render() {  
    return (
    <SafeAreaView style={{flex: 1}}>
      <View style={[styles.container, ]}>
          <Text style={styles.label}>
            From (Currency 1)
          </Text>
          <Picker
            selectedValue={this.state.pick}
            style={{
              height: 50,
              Width: 100,
              color: '#000',
              flex:1,
            }}
            onValueChange={fromCurrency =>
            {this.setState({
                pick: fromCurrency,
                fromCurrency: fromCurrency,
              });
              }
            }>
            <Picker.Item label="USD" value="USD" />
            <Picker.Item label="MYR" value="MYR" />
            <Picker.Item label="PHP" value="PHP" />
            <Picker.Item label="SGD" value="SGD" />
            <Picker.Item label="HKD" value="HKD" />
            <Picker.Item label="EUR" value="EUR" />
        </Picker>
      </View>

      <View style={[styles.container,]}>
          <Text style={styles.label}>
            To (Currency 2)
          </Text>
          <Picker
            selectedValue={this.state.pick2}
            style={{
              height: 50,
              Width: 100,
              color: '#000',
              flex:1,
            }}
            onValueChange={toCurrency =>
            {this.setState({
                pick2: toCurrency,
                toCurrency: toCurrency,
              });
              }
            }>
            <Picker.Item label="USD" value="USD" />
            <Picker.Item label="MYR" value="MYR" />
            <Picker.Item label="PHP" value="PHP" />
            <Picker.Item label="SGD" value="SGD" />
            <Picker.Item label="HKD" value="HKD" />
            <Picker.Item label="EUR" value="EUR" />
        </Picker>
      </View>

      <InputWithLabel style={styles.input}
          label={'Amount'}
          value={this.state.amount}
          onChangeText={(message) => {this.setState({amount: message})}}
          keyboardType={'numeric'}
          orientation={'vertical'}
        />

      <View style={{flex:1.5}}>
        <AppButton style={styles.button}
          title={'Convert'}
          theme={'primary'}
          onPress={this._update}
        />
      </View>
    </SafeAreaView> 
  );
 }
}

const styles = StyleSheet.create({
  picker: {
    color: '#000',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
  },
  container: {
      flex:1,
    },
    label: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 5,
        textAlignVertical: 'center',
    },
    input: {
        flex: 3,
        fontSize: 30,
        marginLeft: 7,
    },
});
