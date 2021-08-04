import React from "react";
import { StyleSheet, Button, TextInput, View, Text} from "react-native";
import {Formik} from 'formik';

const ExpenseScreen = () => {
   
  
  return (
    <View>
      <Formik
        initialValues={{Amount: '', Reference: ''}}
        onSubmit={(values) => {
            console.log(values);
        }}
      >
        {(props) => (
          <View>
            <TextInput
              placeholder='Amount spent'
              onChangeText={props.handleChange('Amount')}
              value={props.values.Amount}
              keyboardType = 'numeric'
            />

            <TextInput
              placeholder='Reference'
              onChangeText={props.handleChange('Reference')}
              value={props.values.Reference}
            />

            <Button title='submit' color='red' onPress={props.handleSubmit}/>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default ExpenseScreen;