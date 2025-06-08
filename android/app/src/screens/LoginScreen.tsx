import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  Image
} from 'react-native';
import { checkUserExists, User } from '../db/db';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const ADMIN_CREDENTIAL = {
    email: 'admin123',
    password: 'adminpass',
  };

  const handleLogin = async () => {
    const user: User | null = await checkUserExists(email, password);
    if (user && email !== ADMIN_CREDENTIAL.email) {
      await AsyncStorage.setItem('userId', user.id.toString());
      await AsyncStorage.setItem('userName', user.name);
      navigation.navigate('Home');
    } else if (email === ADMIN_CREDENTIAL.email && password === ADMIN_CREDENTIAL.password) {
      navigation.navigate('Admin');
    } else {
      Alert.alert('Login Failed', 'Email Or Password Invalid!');
    }
  };

  return (
    <View style={[loginStyles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      <View style={loginStyles.headerRow}>
        <Text style={[loginStyles.title, { color: isDarkMode ? '#fff' : '#000' }]}>Login</Text>
        <View style={loginStyles.switchRow}>
          <Text style={{ color: isDarkMode ? '#fff' : '#000', marginRight: 10 }}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <TextInput
        placeholder="Email"
        placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
        style={[loginStyles.input, {
          backgroundColor: isDarkMode ? '#2a2a2a' : '#f1f5f9',
          color: isDarkMode ? '#fff' : '#000',
          borderColor: isDarkMode ? '#333' : '#e2e8f0'
        }]}
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />

      <View style={[loginStyles.input, {
        backgroundColor: isDarkMode ? '#2a2a2a' : '#f1f5f9',
        borderColor: isDarkMode ? '#333' : '#e2e8f0',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 0
      }]}
      >
        <TextInput
          placeholder="Password"
          placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
          style={{ flex: 1, color: isDarkMode ? '#fff' : '#000', fontSize: 16, paddingVertical: 14 }}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image
            source={showPassword ? require('../icon/hide.png') : require('../icon/show.png')}
            style={{ width: 20, height: 20, tintColor: isDarkMode ? '#ccc' : '#666' }}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={loginStyles.button} onPress={handleLogin}>
        <Text style={loginStyles.buttonText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={[loginStyles.link, { color: isDarkMode ? '#90cdf4' : '#2563eb' }]}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Poppins'
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    elevation: 2
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'Poppins'
  }
});
