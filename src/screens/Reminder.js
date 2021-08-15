import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Alert,
    Button,
    Switch,
    TouchableOpacity,
} from 'react-native';
import CheckBoxList from "./CheckBoxList";
import TimePickerModal from "react-native-modal-datetime-picker";
import CheckBox from "@react-native-community/checkbox";

const Reminder = () => {
    //switch button
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    //time picker
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleConfirm = () => {
        hideTimePicker();
    };

    //checkbox


    /** state = {
       selectedLang1: false,
       selectedLang2: false,
       selectedLang3: false,
       selectedLang4: false,
   
     }
     const { selectedLang1, selectedLang2, selectedLang3, selectedLang4 } = useState
   
         <View style={styles.item} >
           <CheckBox checked={selectedLang1} color="#fc5185"
             onPress={() => useState({ selectedLang1: !selectedLang1 })} />
           <Text style={
             {
               ...styles.checkBoxTxt,
               color: useState.selectedLang1 ? "#fc5185" : "gray",
               fontWeight: useState.selectedLang1 ? "bold" : "normal"
             }}
           >Python</Text>
         </View>
     */




    return (
        <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>

            <View style={styles.Container}>
                <Text style={styles.label}>Reminder</Text>
                <Switch style={styles.switchBtn}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>

            <View style={styles.section}></View>

            <View>

                <TouchableOpacity onPress={showTimePicker} style={styles.timeBtn} >
                    <Text style={styles.buttonText}>Set Time</Text>
                </TouchableOpacity>
                <TimePickerModal
                    isVisible={isTimePickerVisible}
                    mode="time"
                    onConfirm={handleConfirm}
                    onCancel={hideTimePicker}
                />
            </View>

            <View style={styles.section}></View>



            <CheckBoxList></CheckBoxList>


        </View >
    );

}


const styles = StyleSheet.create({
    section: {
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#c8c7cc',
    },

    Container: {
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#c8c7cc',
        backgroundColor: "white",
    },

    label: {
        fontSize: 18,
        paddingHorizontal: 15,
    },

    switchBtn: {
        marginLeft: 250,
    },

    timeBtn: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: '#c8c7cc',
    },

    buttonText: {
        color: "black",
        fontSize: 18,
    },

    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    checkbox: {
        alignSelf: "center",
    },

});

export default Reminder;
