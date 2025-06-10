import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getAllUsers, deleteAllUsersExceptAdmin } from '../db/db';

type User = {
  id: number;
  name: string;
  email: string;
};

const AdminUserList = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
  deleteAllUsersExceptAdmin(
    () => {
      console.log('✅ Cleaned user list');
      getAllUsers(setUsers, console.log);
    },
    (err) => console.log('Error delete:', err)
  );
}, []);

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <Text>Nama: {item.name}</Text>
      <Text>Email: {item.email}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daftar Pengguna Terdaftar</Text>
      <FlatList<User>
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUser}
        // contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 120,
    paddingHorizontal: 16,
  },
});

export default AdminUserList;
