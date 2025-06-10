// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import { insertUser, getAllUsers } from '../db/db';

// export default function OtpScreen({ route, navigation }: any) {
//   const { otp, email, formData } = route.params;
//   const [inputOtp, setInputOtp] = useState('');

//   useEffect(() => {
//     console.log('📩 Route Params:', route.params);
//     console.log('🧾 OTP dari route:', otp);
//     console.log('📧 Email dari route:', email);
//     console.log('🧾 FORM DATA dari route:', formData);

//     getAllUsers(
//     (users) => {
//       console.log('📋 Semua user di DB:', users); // 🕵️ lihat siapa aja yg masih nyangkut
//     },
//     (err) => {
//       console.log('❌ Gagal ambil user:', err);
//     }
//   );
//   }, []);

//   const verifyOtp = () => {
//   console.log('🧨 OTP skip mode aktif - langsung insert');

//   const cleanEmail = formData.email?.trim()?.toLowerCase();

//   insertUser(
//     formData.name,
//     cleanEmail,
//     formData.password,
//     formData.dob,
//     formData.gender,
//     formData.phone,
//     formData.job,
//     () => {
//       console.log('✅ Insert success, langsung ke login');
//       Alert.alert('Sukses', 'Akun berhasil dibuat');
//       navigation.replace('Login');
//     },
//     (err) => {
//       console.log('❌ Gagal insert user:', err);
//       Alert.alert('Error', err);
//     }
//   );
// };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Masukkan Kode OTP</Text>
//       <TextInput
//         keyboardType="numeric"
//         placeholder="6-digit OTP"
//         style={styles.input}
//         value={inputOtp}
//         onChangeText={setInputOtp}
//         maxLength={6}
//       />
//       <TouchableOpacity style={styles.button} onPress={verifyOtp}>
//         <Text style={styles.buttonText}>Verifikasi</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 20,
//     marginBottom: 20,
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     height: 45,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#1d60e6',
//     padding: 12,
//     borderRadius: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
// });

// OtpScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { insertUser } from '../db/db';

export default function OtpScreen({ route, navigation }: any) {
  const { otp, email, formData } = route.params;
  const [inputOtp, setInputOtp] = useState('');

  const verifyOtp = () => {
    const expectedOtp = String(otp);

    if (inputOtp === expectedOtp) {
      console.log('✅ OTP cocok. Lanjut simpan user:', formData);

      insertUser(
        formData.name,
        formData.email,
        formData.password,
        formData.dob,
        formData.gender,
        formData.phone,
        formData.job,
        () => {
          Alert.alert('Sukses', 'Akun berhasil dibuat');
          navigation.navigate('Login');
        },
        (errMsg) => {
          Alert.alert('Error', errMsg);
        }
      );
    } else {
      Alert.alert('OTP Salah', 'Kode OTP yang kamu masukin salah. Coba lagi.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifikasi OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan OTP"
        keyboardType="numeric"
        value={inputOtp}
        onChangeText={setInputOtp}
      />
      <TouchableOpacity style={styles.button} onPress={verifyOtp}>
        <Text style={styles.buttonText}>Verifikasi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    fontSize: 18,
    marginBottom: 20,
    fontFamily: 'Poppins'
  },
  button: {
    backgroundColor: '#1d60e6',
    paddingVertical: 12,
    borderRadius: 10
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins'
  }
});
