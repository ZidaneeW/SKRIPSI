// import React, { useEffect, useState } from 'react';
// import type { JSX } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { enableScreens } from 'react-native-screens';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import { ThemeProvider } from './android/app/src/context/ThemeSwitch';

// import LoginAsAdmin from './android/app/src/screens/LoginAsAdmin';
// import RegisterScreen from './android/app/src/screens/RegisterScreen';
// import { LoginScreen } from './android/app/src/screens/LoginScreen';
// import HomeScreen from './android/app/src/screens/HomeScreen';
// import { AddExpenseScreen } from './android/app/src/screens/AddExpenseScreen';
// import { PredictionScreen } from './android/app/src/screens/PredictionScreen';
// import AdminUserList from './android/app/src/screens/AdminUserList';
// import EditNewProfile from './android/app/src/screens/EditNewProfile';
// import BottomTabNavigator from './android/app/src/screens/BottomTabNavigator';

// import { createUserTable, createExpenseTable } from './android/app/src/db/db';



// enableScreens();
// const Stack = createNativeStackNavigator();

// export default function App(): JSX.Element {
//   const [initialRoute, setInitialRoute] = useState<string>('');

//   useEffect(() => {
//     createUserTable();
//     createExpenseTable();

//     const checkLogin = async () => {
//       const userId = await AsyncStorage.getItem('userId');
//       if (userId) {
//         setInitialRoute('Main'); // ← ini yang penting!
//       } else {
//         setInitialRoute('Register');
//       }
//     };

//     checkLogin();
//   }, []);

//   if (!initialRoute) return <></>; 

//   return (
//     <ThemeProvider>
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName={initialRoute}>
//           <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
//           <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
//           <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
//           <Stack.Screen name="EditProfile" component={EditNewProfile} />
//           <Stack.Screen name="LoginAsAdmin" component={LoginAsAdmin} />
//           <Stack.Screen name="Admin" component={AdminUserList} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </ThemeProvider>
//   );
// }

import React, { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native';
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
import OtpScreen from './android/app/src/screens/OtpScreen';

import { createUserTable, createExpenseTable } from './android/app/src/db/db';

enableScreens();
const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  const [initialRoute, setInitialRoute] = useState<string>(''); // kosong dulu, isi di useEffect

  useEffect(() => {
    // bikin tabel user + expenses pas pertama app load
    createUserTable();
    createExpenseTable();

    const checkLogin = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    console.log('userId found:', userId); // ← tambahin ini
    if (userId) {
      setInitialRoute('Main');
    } else {
      setInitialRoute('Register');
    }
  } catch (err) {
    console.error('Gagal ambil userId:', err);
    setInitialRoute('Register');
  }
};


    checkLogin();
  }, []);

  // render kosong dulu sambil nunggu async selesai
  if (!initialRoute) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading...</Text>
    </View>
  );
}

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OtpScreen" component={OtpScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="EditProfile" component={EditNewProfile} options={{ headerShown: false }} />
          <Stack.Screen name="LoginAsAdmin" component={LoginAsAdmin} options={{ headerShown: false }} />
          <Stack.Screen name="Admin" component={AdminUserList} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
