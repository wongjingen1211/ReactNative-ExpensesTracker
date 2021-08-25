import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Alert, Button} from 'react-native';


const CurrencyConverter = ({navigation}) => {
  return (
    <View style={{backgroundColor: '#EFEFF4', flex: 1}}>
      <Text>Hello World</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    marginLeft: 15,
    marginRight: 20,
    alignSelf: 'center',
    width: 20,
    height: 24,
    justifyContent: 'center',
  },
});

export default CurrencyConverter;
