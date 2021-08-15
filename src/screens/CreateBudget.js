import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    ScrollView
} from 'react-native';
import {
    InputWithLabel,
    PickerWithLabel,
    AppButton,
} from './UI';

//let common = require('./CommonData');
//let SQLite = require('react-native-sqlite-storage');

type Props = {};
export default class CreateBudget extends Component<Props> {
    /* static navigationOptions = {
       title: 'Add Student',
     };
   
     constructor(props) {
       super(props)
   
       this.state = {
         name: '',
         email: '',
         state: '14',
       };
   
       this._insert = this._insert.bind(this);
   
       this.db = SQLite.openDatabase({name: 'studentdb', createFromLocation : '~db.sqlite'}, this.openDb, this.errorDb);
     }
   
     _insert() {
       this.db.transaction((tx) => {
         tx.executeSql('INSERT INTO students(name,email,state) VALUES(?,?,?)', [
           this.state.name,
           this.state.email,
           this.state.state,
         ]);
       });
   
       this.props.navigation.getParam('refresh')();
       this.props.navigation.goBack();
     }
   */
    render() {
        return (
            <ScrollView style={styles.container}>
                <InputWithLabel style={styles.input}
                    label={'Name'}
                    value={this.state.name}
                    onChangeText={(name) => { this.setState({ name }) }}
                    orientation={'vertical'}
                />
                <InputWithLabel style={styles.input}
                    label={'Email'}
                    value={this.state.email}
                    onChangeText={(email) => { this.setState({ email }) }}
                    keyboardType={'email-address'}
                    orientation={'vertical'}
                />
                <PickerWithLabel style={styles.picker}
                    label={'State'}
                    items={common.states}
                    mode={'dialog'}
                    value={this.state.state}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({ state: itemValue })
                    }}
                    orientation={'vertical'}
                    textStyle={{ fontSize: 24 }}
                />
                <AppButton style={styles.button}
                    title={'Save'}
                    theme={'primary'}
                    onPress={this._insert}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    input: {
        fontSize: 16,
        color: '#000099',
        marginTop: 10,
        marginBottom: 10,
    },
    picker: {
        color: '#000099',
        marginTop: 10,
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
    },
});