import React, { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeProvider } from './android/app/src/context/ThemeSwitch';

import LoginAsAdmin from './android/app/src/screens/LoginAsAdmin';
import RegisterScreen from './android/app/src/screens/RegisterScreen';
import { LoginScreen } from './android/app/src/screens/LoginScreen';
import HomeScreen from './android/app/src/screens/HomeScreen';
import { AddExpenseScreen } from './android/app/src/screens/AddExpenseScreen';
import { PredictionScreen } from './android/app/src/screens/PredictionScreen';
import AdminUserList from './android/app/src/screens/AdminUserList';
import EditNewProfile from './android/app/src/screens/EditNewProfile';
import BottomTabNavigator from './android/app/src/screens/BottomTabNavigator';

import { createUserTable, createExpenseTable } from './android/app/src/db/db';



enableScreens();
const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  const [initialRoute, setInitialRoute] = useState<string>('');

  useEffect(() => {
    createUserTable();
    createExpenseTable();

    const checkLogin = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        setInitialRoute('Main'); // ← ini yang penting!
      } else {
        setInitialRoute('Register');
      }
    };

    checkLogin();
  }, []);

  if (!initialRoute) return <></>; 

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="EditProfile" component={EditNewProfile} />
          <Stack.Screen name="LoginAsAdmin" component={LoginAsAdmin} />
          <Stack.Screen name="Admin" component={AdminUserList} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

