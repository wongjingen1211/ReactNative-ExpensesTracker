import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Alert,
    Text,
    Switch,
    TouchableOpacity,
} from 'react-native';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-community/async-storage';
import PushNotification from "react-native-push-notification";

import {AppButton} from './UI';



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

 

    const _readReminder = async(key, value) => {
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
            _readReminder('switch', switchReminder)
            _readReminder('time', timeReminder)

            Alert.alert(
                'Reminder setting saved',
                'Time set: ' + reminderTime.getHours().toString() + '.' + reminderTime.getMinutes().toString(),
              )
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


});

export default Reminder;
