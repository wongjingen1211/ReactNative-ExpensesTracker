import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, View, SafeAreaView } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from "react-native-vector-icons/Ionicons";
import CategoryButton from "../../component/CategoryButton";
import { bold } from "jest-matcher-utils/node_modules/chalk";
import { styles } from "ansi-colors";
import { NavigationContainer } from '@react-navigation/native';
import { FloatingAction } from 'react-native-floating-action';

const actions = [{
    text: 'Add',
    icon: require('../../assets/icons/create.png'),
    name: 'add',
    position: 1
}, {
    text: 'Delete',
    color: '#c80000',
    icon: require('../../assets/icons/delete.png'),
    name: 'delete',
    position: 2
}
];

const EditCategories = () => {
    return (
        <SafeAreaView style={styles2.Space}>
            <View style={styles2.Parent}>
                <CategoryButton text={"Food"} icon={'food'} />
                <CategoryButton text={"Daily Necessity"} icon={"toothbrush"} />
                <CategoryButton text={"Entertainment"} icon={"movie"} />
            </View>
            <View style={styles2.Parent}>
                <CategoryButton text={"Books"} icon={"book-open-page-variant"} />
                <CategoryButton text={"Insurance"} icon={"shield-car"} />
                <CategoryButton text={"Loan"} icon={"currency-usd"} />
            </View>
            <View style={styles2.Parent}>
                <CategoryButton text={"Others"} icon={"dots-horizontal"} />
            </View>
            <FloatingAction
                actions={actions}
                color={'lightblue'}

                onPressItem={(name) => {
                    switch (name) {
                        case 'add':
                            /* onPressItem={
                                    () => {
                                    this.props.navigation.navigate('CreateBudget', {
                                        refresh: this._query,
                                    })
                                    }
                                }*/
                            break;

                        case 'delete':
                            //   this._delete();
                            break;
                    }
                }
                }
            />
        </SafeAreaView>
    );



};



const styles2 = StyleSheet.create({
    Space: {
        flex: 1.0,

    },
    Parent: {
        flex: 1.0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        marginLeft: 5
    }

});

export default EditCategories;