import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';
import * as React from 'react';
import {StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {NavigationContainer} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './src/screens/HomeScreen';
import ExpenseScreen from './src/screens/ExpenseScreen';
import EditExpenseScreen from './src/screens/EditExpenseScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import SettingScreen from './src/screens/SettingScreen';
import AccountReportScreen from './src/screens/AccountReportScreen';
import Reminder from './src/screens/Reminder';
import EditCategories from './src/screens/EditCategories';
import MonthlyBudgets from './src/screens/MonthlyBudgets';
import MonthlyCategoryScreen from './src/screens/MonthlyCategoryScreen';
import CreateBudget from './src/screens/CreateBudget';

import {black} from 'color-name';

const Stack = createStackNavigator();

function HomeNavi() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {backgroundColor: '#fffacd'},
        headerTintColor: '#ff8c00',
        headerTitleStyle: {fontWeight: 'normal', fontSize: 25},
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Home'}}
      />
      <Stack.Screen
        name="Expense"
        component={ExpenseScreen}
        options={{title: 'Add Transaction'}}
      />
      <Stack.Screen
        name="EditExpense"
        component={EditExpenseScreen}
        options={{title: 'Edit Transaction'}}
      />
    </Stack.Navigator>
  );
}

function SettingNavi() {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        headerStyle: {backgroundColor: '#fffacd'},
        headerTintColor: '#ff8c00',
        headerTitleStyle: {fontWeight: 'normal', fontSize: 25},
      }}>
      <Stack.Screen
        name="Settings"
        component={SettingScreen}
        options={{title: 'SettingsPage'}}
      />
      <Stack.Screen
        name="Reminder"
        component={Reminder}
        options={{title: 'Reminder'}}
      />
      <Stack.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{title: 'CategoryScreen'}}
      />
      <Stack.Screen
        name="EditCategories"
        component={EditCategories}
        options={{title: 'EditCategories'}}
      />
      <Stack.Screen
        name="MonthlyBudgets"
        component={MonthlyBudgets}
        options={{title: 'Monthly Budgets'}}
      />
      <Stack.Screen
        name="CreateBudget"
        component={CreateBudget}
        options={{title: 'Create Budget'}}
      />
    </Stack.Navigator>
  );
}

function SummaryNavi() {
  return (
    <Stack.Navigator
      initialRouteName="Summary"
      screenOptions={{
        headerStyle: {backgroundColor: '#fffacd'},
        headerTintColor: '#ff8c00',
        headerTitleStyle: {fontWeight: 'normal', fontSize: 25},
      }}>
      <Stack.Screen
        name="AccountReports"
        component={AccountReportScreen}
        options={{title: 'AccountReports'}}
      />
      <Stack.Screen
        name="M_Category"
        component={MonthlyCategoryScreen}
        options={{title: 'Monthly Category'}}
      />
      <Stack.Screen
        name="EditExpense"
        component={EditExpenseScreen}
        options={{title: 'Edit Transaction'}}
      />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function Menu() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#dc143c',
          tabBarStyle: [
            {
              display: 'flex',
            },
            null,
          ],
          headerShown: false,
        }}
        initialRouteName="Menu">
        <Tab.Screen
          name="EasyTracker"
          component={HomeNavi}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="home" color={color} size={32} />
            ),
          }}
        />
        <Tab.Screen
          name="EasyTracker2"
          component={SettingNavi}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="cogs" color={color} size={32} />
            ),
          }}
        />
        <Tab.Screen
          name="EasyTracker3"
          component={SummaryNavi}
          options={{
            tabBarLabel: 'AccountSummary',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="account-multiple"
                color={color}
                size={32}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default Menu;
