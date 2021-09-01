import React, { Component, useEffect, useState } from 'react';
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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-community/async-storage';
import PushNotification from "react-native-push-notification";
//import CheckBox from "@react-native-community/checkbox";
import {AppButton} from './UI';

//let config = require('../../Config');
//let url = config.settings.serverPath + '/api/reminder';


const Reminder = () => {

    const createChannels = () => {
        PushNotification.createChannel(
            {
                channelId: "test-channel",
                channelName: "test-channel",
            }
        )
    }

    const handleNotification = (title, message) => {
        PushNotification.localNotification(
            {
                channelId: "test-channel",
                title: title,
                message : message,
            }
        )
    }

    const handleScheduleNotification = (title, message) => {
        PushNotification.cancelAllLocalNotifications(),
        PushNotification.localNotificationSchedule(
            {
               
                channelId: "test-channel",
                title: title,
                message : message,
                date: new Date(reminderTime),
                allowWhileIdle: true,
                //date: new Date(reminderTime + 60 * 1000),
                repeatType: 'day',
                repeatTime: 1,
                
            }
        )
    }
    

    //switch button
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState)
    };

    //time picker
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleConfirm = (time) => {
        console.warn("A date has been picked: ", time);
        setReminderTime(time);
        hideTimePicker();
    };
    const [reminderTime, setReminderTime] = useState(new Date());
    const [reminderDay, setReminderDay] = useState();
    const [isFetching, setFetching] = useState(false);

    //checkbox


    /**state = {
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
         </View>*/
     

    /*const readReminder = () => {


        //fetch all category in this function
        setFetching(true);
        fetch(url)
        .then(response => {
            if (!response.ok) {
            //catch the responds error status
            Alert.alert('Error', response.status.toString());
            throw Error('Error ' + response.status);
            }
            //respond status e.g., 201 created, 202 OK, 404 no found
            return response.json();
        })
        //after places from server successfully, take the table places as i nput for further execution.
        .then(reminder => {
            setIsEnabled();
            setReminderTime();
            setFetching(false);
        })
        .catch(error => {
            console.log(error);
        });
    }*/

/*
    const [newStates, setNewStates] = useState({});

    const _readReminder = async () => {
        newStates = {};

        try{
            let keys = await AsyncStorage.multiGet (
                ['switch', 'time', 'day'],
                (err, stores) => {
                    stores.map ((result, i, store) => {
                      // get at each store's key/value so you can work with it
                      let key = store[i][0]; // the key
                      let value = store[i][1]; // the value
                      // console.log (key);
                      // console.log (value);
                      // console.log (['name', 'email', 'gender', 'educationLevel'].indexOf (key));
                      // if (['name', 'email', 'gender', 'educationLevel'].indexOf (key) != -1) {
                      //   newStates[key] = value == 'true' ? true : false;
                      // } else 
                      {
                        newStates[key] = value;
                      }
                    });
                    setNewStates();
                    console.log (newStates);
                }
            )
        }catch(error){
            console.log ('## ERROR READING ITEM ##: ', error);
        }
    };
*/

    const _saveReminder = async(key, value) => {
        try {
          await AsyncStorage.setItem (key, value);
        } catch (error) {
          console.log ('## ERROR SAVING ITEM ##: ', error);
        }
    }

    const _readSwitch = async() => {
      try{
        const var1 = await AsyncStorage.getItem('switch')
        const var2 = await AsyncStorage.getItem('time')
        setIsEnabled(JSON.parse(var1))
        setReminderTime(JSON.parse(var2))
      }
      catch (error){
        console.log ('## ERROR SAVING ITEM ##: ', error);
      }
    }

/*
    const _saveReminder2 = async() => {
        try {

            let var1 = ['switch', isEnabled ? isEnabled.toString():''];
            let var2 = ['time', reminderTime ? reminderTime.toString():''];
            let var3 = ['day', reminderDay ? reminderDay.toString():''];

            await AsyncStorage.multiSet([var1,var2,var3]);
          } catch (error) {
            console.log ('## ERROR SAVING ITEM ##: ', error);
          }
    }
*/


/*
const onChange = (event, selectedTime) => {
  const currentTime = selectedTime || reminderTime;
  setReminderTime(currentTime);
};
*/

    return (

        useEffect(() => {
            _readSwitch();
            createChannels();
        }, []),

        <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>

            <View style={styles.Container}>
                <Text style={styles.label}>Reminder</Text>
                <Switch style={styles.switchBtn}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                    onValueChange={setIsEnabled}
                    value={isEnabled}
                />
            </View>

            <View style={styles.section}></View>

            <View>

                <TouchableOpacity onPress={showTimePicker} style={styles.timeBtn} >
                    <Text style={styles.buttonText}>Set Time</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    mode="time"
                    //date={new Date()}
                    value={reminderTime}
                    is24Hour={true}
                    onConfirm={handleConfirm}
                    onCancel={hideTimePicker}
                />
            </View>

            

            <AppButton
          style={styles.button}
          title={'Save'}
          theme={'primary'}
          
          onPress={() => {
            let switchReminder = JSON.stringify(isEnabled);
            let timeReminder = JSON.stringify(reminderTime)
            /*let test = new Date(reminderTime.getDate())
            let test2 = JSON.stringify(test)
            Alert.alert(
              switchReminder,
              timeReminder,
              test2,
            )*/
            _saveReminder('switch', switchReminder)
            _saveReminder('time', timeReminder)
            if (isEnabled){
            handleScheduleNotification("Reminder for record the expenses", "Do you record your expenses today?")
            }
            else 
            {
                PushNotification.cancelAllLocalNotifications()
            }
        }}
        />

        </View >
    );

}


const styles = StyleSheet.create({
    section: {
        paddingTop: 5,
        paddingBottom: 5,
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

    /*checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    checkbox: {
        alignSelf: "center",
    },*/

});

export default Reminder;
