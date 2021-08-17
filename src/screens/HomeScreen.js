import React from 'react';
import 'react-native-gesture-handler';
import {
  StyleSheet,
  Button,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

const HomeScreen = ({navigation}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, padding: 16}}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Expense')}>
          <Text>Add Transaction</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginTop: 16,
  },
});

export default HomeScreen;
