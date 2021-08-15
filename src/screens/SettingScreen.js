import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Alert,
    Button,
} from 'react-native';
import SettingsList from 'react-native-settings-list';

const SettingScreen = ({ navigation }) => {


    return (
        <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>

            <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
                <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
                    <SettingsList.Header headerStyle={{ marginTop: 15 }} />

                    <SettingsList.Item
                        title='Reminder'
                        titleInfoStyle={styles.titleInfoStyle}
                        onPress={() => navigation.navigate("Reminder")}
                    />
                    <SettingsList.Item
                        title='Edit Categories'
                        titleInfoStyle={styles.titleInfoStyle}
                        onPress={() => navigation.navigate("EditCategories")}
                    />
                    <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                    <SettingsList.Item
                        title='MonthlyBudgets'
                        onPress={() => navigation.navigate("MonthlyBudgets")}
                    />

                </SettingsList>
            </View>
        </View>
    );


}

const styles = StyleSheet.create({
    imageStyle: {
        marginLeft: 15,
        marginRight: 20,
        alignSelf: 'center',
        width: 20,
        height: 24,
        justifyContent: 'center'
    }
});

export default SettingScreen;
