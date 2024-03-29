import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import * as React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './src/screens/HomeScreen';
import CurrencyConverter from './src/screens/CurrencyConverter';
import ExpenseScreen from './src/screens/ExpenseScreen';
import EditExpenseScreen from './src/screens/EditExpenseScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import SettingScreen from './src/screens/SettingScreen';
import AccountReportScreen from './src/screens/AccountReportScreen';
import Reminder from './src/screens/Reminder';
import EditCategories from './src/screens/EditCategories';
import MonthlyCategoryScreen from './src/screens/MonthlyCategoryScreen';

const Stack = createStackNavigator();

function HomeNavi() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#fffacd' },
        headerTintColor: '#ff8c00',
        headerTitleStyle: { fontWeight: 'normal', fontSize: 25 },
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Stack.Screen
        name="Expense"
        component={ExpenseScreen}
        options={{ title: 'Add Transaction' }}
      />
      <Stack.Screen
        name="EditExpense"
        component={EditExpenseScreen}
        options={{ title: 'Edit Expense' }}
      />
    </Stack.Navigator>
  );
}

function SettingNavi() {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        headerStyle: { backgroundColor: '#fffacd' },
        headerTintColor: '#ff8c00',
        headerTitleStyle: { fontWeight: 'normal', fontSize: 25 },
      }}>
      <Stack.Screen
        name="Settings"
        component={SettingScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="Reminder"
        component={Reminder}
        options={{ title: 'Reminder' }}
      />
      <Stack.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{ title: 'Category Screen' }}
      />
      <Stack.Screen
        name="EditCategories"
        component={EditCategories}
        options={{ title: 'Edit Categories' }}
      />
    </Stack.Navigator>
  );
}

function SummaryNavi() {
  return (
    <Stack.Navigator
      initialRouteName="Summary"
      screenOptions={{
        headerStyle: { backgroundColor: '#fffacd' },
        headerTintColor: '#ff8c00',
        headerTitleStyle: { fontWeight: 'normal', fontSize: 25 },
      }}>
      <Stack.Screen
        name="AccountReports"
        component={AccountReportScreen}
        options={{ title: 'Account Reports' }}
      />
      <Stack.Screen
        name="M_Category"
        component={MonthlyCategoryScreen}
        options={{ title: 'Monthly Category' }}
      />
      <Stack.Screen
        name="EditExpense"
        component={EditExpenseScreen}
        options={{ title: 'Edit Expense' }}
      />
    </Stack.Navigator>
  );
}

function ConverterNavi() {
  return (
    <Stack.Navigator
      initialRouteName="Converter"
      screenOptions={{
        headerStyle: { backgroundColor: '#fffacd' },
        headerTintColor: '#ff8c00',
        headerTitleStyle: { fontWeight: 'normal', fontSize: 25 },
      }}>
      <Stack.Screen
        name="CurrencyConverter"
        component={CurrencyConverter}
        options={{ title: 'Currency Converter' }}
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
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={32} />
            ),
          }}
        />
        <Tab.Screen
          name="EasyTracker2"
          component={SettingNavi}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cogs" color={color} size={32} />
            ),
          }}
        />
        <Tab.Screen
          name="EasyTracker3"
          component={SummaryNavi}
          options={{
            tabBarLabel: 'Reports',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account-multiple"
                color={color}
                size={32}
              />
            ),
          }}
        />
        <Tab.Screen
          name="EasyTracker4"
          component={ConverterNavi}
          options={{
            tabBarLabel: 'Currency Converter',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="currency-usd"
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
