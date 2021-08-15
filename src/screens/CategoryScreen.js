import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, View, SafeAreaView} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from "react-native-vector-icons/Ionicons";
import CategoryButton from "../../component/CategoryButton";  
import { bold } from "jest-matcher-utils/node_modules/chalk";
import { styles } from "ansi-colors";
import { NavigationContainer } from '@react-navigation/native';


const CategoryScreen = ({navigation}) => {
  let A = ()=>navigation.navigate("Expense")
  return(
    <SafeAreaView style= {styles2.Space}>
      <Text style={styles2.text}>
        Please choose the category you want to record.
      </Text>
      <View style={styles2.Parent}>
        <CategoryButton text={"Food"} icon={'food'} D={A} />
        <CategoryButton text={"Daily Necessity"} icon={"toothbrush"}  D={A}/>
        <CategoryButton text={"Entertainment"} icon={"movie"}  D={A}/>
      </View>
      <View style={styles2.Parent}>
        <CategoryButton text={"Books"} icon={"book-open-page-variant"}  D={A}/>
        <CategoryButton text={"Insurance"} icon={"shield-car"} D={A}/>
        <CategoryButton text={"Loan"} icon={"currency-usd"}  D={A}/>
      </View>
      <View style={styles2.Parent}>
        <CategoryButton text={"Others"} icon={"dots-horizontal"} D={A}/>
      </View>
      
     </SafeAreaView>
  );
  
    
  
};



const styles2 = StyleSheet.create({
  Space:{
    flex: 1.0,
    
  },
  Parent:{
    flex: 1.0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop:10,
  },
  text:{
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginLeft: 5
  }

});

export default CategoryScreen;