import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, FlatList } from "react-native";
import CheckBox from "@react-native-community/checkbox";

const list = [
    {
        name: 'Monday',
        id: 0,
        checked: false
    },
    {
        name: 'Tuesday',
        id: 1,
        checked: false
    },
    {
        name: 'Wednesday',
        id: 2,
        checked: false
    },
    {
        name: 'Thursday',
        id: 3,
        checked: false
    },
    {
        name: 'Friday',
        id: 4,
        checked: false
    },
    {
        name: 'Saturday',
        id: 5,
        checked: false
    },
    {
        name: 'Sunday',
        id: 6,
        checked: false
    },
]



class CheckBoxList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: list,
            listTest: this.props.dataToReminder,
            checked: {},
        }
    }

    /**checkThisBox = (itemID) => {
        const list = { ...this.state.list }
        //    if (list[itemID].checked) list[itemID].checked = true;
        //  else !list[itemID].checked;

        list[itemID].checked = !list[itemID].checked
        this.setState({ list: list })
    }*/

    checkThisBox = (itemID) => {
        const checkCopy = {...this.state.checked}
        if (checkCopy[itemID]) checkCopy[itemID] = false;
        else checkCopy[itemID] = true;
        this.setState({ checked: checkCopy });
    }

    renderItem = ({ item }) => (
        <View style={styles.container}>
            <Text style={styles.label}>{item.name}</Text>
            <CheckBox style={styles.chkBtn}
                value = {this.state.checked[item.id]}
                onChange={() => this.checkThisBox(item.id)}
            />

        </View>

    )

    render() {

        return (
            <View>
                <FlatList
                    keyExtractor={this.keyExtractor}
                    data={this.state.list}
                    renderItem={this.renderItem}
                    extraData={this.state}
                    var checkboxtest = {this.props.list}
                />
            </View>
        )
    };
}


const styles = StyleSheet.create({

    container: {
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#c8c7cc',
        backgroundColor: "white",
    },

    label: {
        fontSize: 18,
        paddingHorizontal: 20,

    },

    chkBtn: {
        position: "absolute",
        right: 20,
        top: 5,
    }
});

export default CheckBoxList;
