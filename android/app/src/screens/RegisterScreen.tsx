import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  Switch, 
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { insertUser, deleteAllUsers, createUserTable, createExpenseTable, getAllUsers } from '../db/db';
import { sendOtp } from '../utils/sendOtp';
import validator from 'validator'; // pastikan sudah install validator



const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [job, setJob] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const onChangeDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    const dateString = currentDate.toISOString().split('T')[0];
    setDob(dateString);
  };

  useEffect(() => {
    createUserTable();
    createExpenseTable();
  }, []);

  const handleRegister = () => {
  if (!name || !email || !password || !dob || !gender || !phone || !job || (['Karyawan Swasta', 'Wirausahawan', 'Lainnya'].includes(job) && !jobDescription)) {
    alert('Semua field wajib diisi!');
    return;
  }

  if (!validator.isEmail(email.trim())) {
    alert('Format email tidak valid');
    return;
  }

  if (password !== confirmPassword) {
    setPasswordError('Confirm password tidak sama dengan password');
    return;
  }

  const cleanEmail = email.trim().toLowerCase();
  const fullJob = job + (jobDescription ? ` - ${jobDescription}` : '');

  console.log('📦 Siap insert user:', {
    name, cleanEmail, password, dob, gender, phone, fullJob
  });

  insertUser(
    name,
    cleanEmail,
    password,
    dob,
    gender,
    phone,
    fullJob,
    () => {
      console.log('✅ Insert sukses, arahkan ke login');
      console.log('Data user yang baru dimasukkan:', { name, cleanEmail, password, dob, gender, phone, fullJob }); // log user
      Alert.alert('Sukses', 'Akun berhasil dibuat');
      getAllUsers(
      users => console.log(users),
      e => console.log('❌ GetAllUsers error', e)
    );
      navigation.replace('Login');
    },
    (err) => {
      console.log('❌ Insert gagal:', err);
      Alert.alert('Error', err);
    }
  );
};



  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      <View style={[styles.header, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>Register</Text>
          <View style={styles.darkModeToggle}>
            <Text style={{ color: isDarkMode ? '#fff' : '#000', fontFamily: 'Poppins', marginRight: 10 }}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
      </View>

      <View style={styles.body}>
        {[
          { label: 'Nama', value: name, setter: setName, placeholder: 'Nama', keyboardType: 'default' },
          { label: 'Email', value: email, setter: setEmail, placeholder: 'example@email.com', keyboardType: 'email-address' }
        ].map((field, idx) => (
          <View key={idx}>
            <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>{field.label}</Text>
            <View style={[styles.inputWrapper, {
              backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
              borderColor: isDarkMode ? 'transparent' : '#1d60e6',
              borderWidth: 1
            }]}>
              <TextInput
                placeholder={field.placeholder}
                placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
                style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
                keyboardType={field.keyboardType as 'default' | 'email-address' | 'numeric' | 'phone-pad'}
                value={field.value}
                onChangeText={field.setter}
              />
            </View>
          </View>
        ))}

        <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Tanggal Lahir</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.inputWrapper, {
          backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
          borderColor: isDarkMode ? 'transparent' : '#1d60e6',
          borderWidth: 1
        }]}>
          <Text style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}>{dob || 'Pilih Tanggal Lahir'}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Jenis Kelamin</Text>
        <View style={styles.genderWrapper}>
          {['Laki-laki', 'Perempuan'].map(option => (
            <TouchableOpacity
              key={option}
              style={[styles.radioButton, gender === option && styles.radioButtonSelected]}
              onPress={() => setGender(option)}
            >
              <View style={styles.radioCircle}>
                {gender === option && <View style={styles.radioDot} />}
              </View>
              <Text style={[styles.radioLabel, { color: isDarkMode ? '#fff' : '#000' }]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Nomor Telepon</Text>
        <View style={[styles.inputWrapper, {
          backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
          borderColor: isDarkMode ? 'transparent' : '#1d60e6',
          borderWidth: 1
        }]}>
          <TextInput
            placeholder="+62"
            placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => {
              let digits = text.replace(/[^0-9]/g, '');
              if (digits.startsWith('0')) digits = digits.slice(1);
              else if (digits.startsWith('62')) digits = digits.slice(2);
              digits = digits.slice(0, 12);
              let formatted = '+62 ';
              if (digits.length <= 3) formatted += digits;
              else if (digits.length <= 7) formatted += digits.slice(0, 3) + '-' + digits.slice(3);
              else formatted += digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7);
              setPhone(formatted);
            }}
          />
        </View>

        <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Pekerjaan</Text>
        <View style={[styles.inputWrapper, {
          backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
          borderColor: isDarkMode ? 'transparent' : '#1d60e6',
          borderWidth: 1
        }]}>
          <Picker
            selectedValue={job}
            style={{ flex: 1, color: isDarkMode ? '#fff' : '#000' }}
            onValueChange={(itemValue) => setJob(itemValue)}>
            <Picker.Item label="Pilih pekerjaan" value="" />
            <Picker.Item label="Mahasiswa" value="Mahasiswa" />
            <Picker.Item label="Karyawan Swasta" value="Karyawan Swasta" />
            <Picker.Item label="Wirausahawan" value="Wirausahawan" />
            <Picker.Item label="Lainnya" value="Lainnya" />
          </Picker>
        </View>

        {(job === 'Karyawan Swasta' || job === 'Wirausahawan' || job === 'Lainnya') && (
          <View style={[styles.inputWrapper, {
            backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
            borderColor: isDarkMode ? 'transparent' : '#1d60e6',
            borderWidth: 1
          }]}>
            <TextInput
              placeholder={job === 'Karyawan Swasta' ? 'Deskripsi Pekerjaan' : job === 'Wirausahawan' ? 'Bidang Usaha' : 'Deskripsi Pekerjaan'}
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
              onChangeText={setJobDescription}
              value={jobDescription}
            />
          </View>
        )}

        {[{
          label: 'Password', value: password, set: setPassword, show: showPassword, toggle: () => setShowPassword(!showPassword), isConfirm: false
        }, {
          label: 'Confirm Password', value: confirmPassword, set: setConfirmPassword, show: showConfirmPassword, toggle: () => setShowConfirmPassword(!showConfirmPassword), isConfirm: true
        }].map((field, idx) => (
          <View key={idx}>
            <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>{field.label}</Text>
            <View style={[styles.inputWrapper, {
              backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
              borderColor: isDarkMode ? 'transparent' : '#1d60e6',
              borderWidth: 1
            }]}>
              <TextInput
                placeholder={field.label}
                placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
                secureTextEntry={!field.show}
                style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
                value={field.value}
                onChangeText={(text) => {
                  field.set(text);
                  if (field.isConfirm && password !== text) {
                    setPasswordError('Confirm password tidak sama dengan password');
                  } else if (!field.isConfirm && confirmPassword && text !== confirmPassword) {
                    setPasswordError('Confirm password tidak sama dengan password');
                  } else {
                    setPasswordError('');
                  }
                }}
              />
              <TouchableOpacity onPress={field.toggle}>
                <Image
                  source={field.show ? require('../icon/hide.png') : require('../icon/show.png')}
                  style={{ width: 20, height: 20, tintColor: isDarkMode ? '#ccc' : '#666' }}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {passwordError ? <Text style={{ color: 'red' }}>{passwordError}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Daftar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
          deleteAllUsers(
          () => alert('Semua data user berhasil dihapus'),
          (err) => alert('Gagal hapus data: ' + err)
            );
          }}
          style={[styles.button, { backgroundColor: 'red' }]}
          >
          <Text style={styles.buttonText}>Reset Semua User</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 20 }}>
          <Text style={[styles.bottomText, { color: isDarkMode ? '#bbb' : '#666' }]}>Sudah punya akun? <Text style={styles.signUpLink}>Login di sini</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  },
  header: {
    paddingBottom: 20,
    paddingTop: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: '#fff'
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  darkModeToggle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  body: {
    paddingTop: 20,
    paddingHorizontal: 30
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Poppins'
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    fontFamily: 'Poppins'
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 15
  },
  input: {
    flex: 1,
    height: 45,
    fontFamily: 'Poppins'
  },
  button: {
    backgroundColor: '#1d60e6',
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Poppins'
  },
  bottomText: {
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Poppins'
  },
  signUpLink: {
    color: '#3176f6',
    fontWeight: 'bold',
    fontFamily: 'Poppins'
  },
  genderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 10
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10
  },
  radioButtonSelected: {
    backgroundColor: '#e0ecff'
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#2563eb'
  },
  radioLabel: {
    fontSize: 14,
    fontFamily: 'Poppins'
  }
});

export default RegisterScreen;

