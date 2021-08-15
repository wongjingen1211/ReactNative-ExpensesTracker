import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';



const CategoryButton = ({ text, icon, D }) => {

    return (
        <TouchableOpacity style={styles.CButton} onPress={D}>
            <Text style={styles.Label}>{text}</Text>
            <MaterialCommunityIcons name={icon} style={styles.Icon} size={25} />
        </TouchableOpacity>
    );

};


const styles = StyleSheet.create({
    CButton: {
        backgroundColor: 'white',
        padding: 10,
        width: '30%',
        height: 100,
        borderRadius: 30,
        justifyContent: 'center',
    },
    Label: {
        fontSize: 14,
        color: 'brown',
        textAlign: 'center',
        fontFamily: 'Georgia-Italic',

    },
    Icon: {
        color: 'black',
        left: 39
    },

});

export default CategoryButton;