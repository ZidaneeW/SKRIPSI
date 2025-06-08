// import SQLite, { SQLError, Transaction } from 'react-native-sqlite-storage';

// export type User = {
//   id: number;
//   name: string;
//   email: string;
//   password: string;
// };

// const db = SQLite.openDatabase(
//   {
//     name: 'FinanceTracker.db',
//     location: 'default',
//   },
//   () => {
//     console.log('Database opened');
//   },
//   error => {
//     console.log('Error opening database:', error);
//   }
// );

// // Create table if not exists
// export const createUserTable = () => {
//   db.transaction((tx: Transaction) => {
//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS users (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT,
//         email TEXT UNIQUE,
//         password TEXT
//       )`,
//       [],
//       () => {
//         console.log('User table created or already exists');
//       },
//       (txObj: Transaction, error: SQLError): boolean => {
//         console.log('Failed to create table:', error);
//         return true; // stop execution
//       }
//     );
//   });
// };

// export const insertUser = (
//   name: string,
//   email: string,
//   password: string,
//   onSuccess: () => void,
//   onError: (message: string) => void
// ) => {
//   // Validasi Kosong
//   if (!name.trim()) {
//     onError('Nama harus diisi');
//     return;
//   }
//   if (!email.trim()) {
//     onError('Email harus diisi');
//     return;
//   }
//   if (!password.trim()) {
//     onError('Password harus diisi');
//     return;
//   }

//   // Validasi Lanjutan
//   if (name.length < 8 || name.length > 20) {
//     onError('Nama harus 8-20 karakter');
//     return;
//   }

//   if (!email.includes('@gmail.com')) {
//     onError('Email harus menggunakan @gmail.com');
//     return;
//   }

//   if (
//     password.length < 6 ||
//     password.length > 15 ||
//     password.toLowerCase().includes(name.toLowerCase()) ||
//     !/[0-9]/.test(password) ||
//     !/[A-Z]/.test(password) ||
//     !/[a-z]/.test(password)
//   ) {
//     onError('Password harus 6–15 karakter, mengandung huruf besar & kecil, angka, dan tidak boleh mengandung nama');
//     return;
//   }

//   // Jika valid, simpan ke DB
//   db.transaction(tx => {
//     tx.executeSql(
//       'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
//       [name, email, password],
//       () => {
//         console.log('User inserted');
//         onSuccess();
//       },
//       (_, error) => {
//         console.log('Insert error:', error);
//         onError('Gagal membuat akun. Email mungkin sudah digunakan.');
//         return false;
//       }
//     );
//   });
// };

// export const checkUserExists = async (
//   email: string,
//   password: string
// ): Promise<User | null> => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         'SELECT * FROM users WHERE email = ? AND password = ?',
//         [email, password],
//         (_, { rows }) => {
//           if (rows.length > 0) {
//             resolve(rows.item(0)); // ✅ Ini return user object
//           } else {
//             resolve(null);
//           }
//         },
//         (_, error) => reject(error)
//       );
//     });
//   });
// };


// export const loginUser = (
//   email: string,
//   password: string,
//   onSuccess: (user: any) => void,
//   onError: (err: any) => void
// ) => {
//   db.transaction(tx => {
//     tx.executeSql(
//       'SELECT * FROM users WHERE email = ? AND password = ?',
//       [email, password],
//       (_, results) => {
//         if (results.rows.length > 0) {
//           onSuccess(results.rows.item(0));
//         } else {
//           onError('Invalid credentials');
//         }
//       },
//       (_, error) => {
//         console.log('Login error:', error);
//         onError(error);
//         return false;
//       }
//     );
//   });
// };

// export const getAllUsers = (
//   onSuccess: (users: any[]) => void,
//   onError: (err: any) => void
// ) => {
//   db.transaction(tx => {
//     tx.executeSql(
//       'SELECT * FROM users',
//       [],
//       (tx, results) => {
//         const users = [];
//         for (let i = 0; i < results.rows.length; i++) {
//           users.push(results.rows.item(i));
//         }
//         onSuccess(users);
//       },
//       (tx, error) => {
//         console.log('Get users error:', error);
//         onError(error);
//         return false; // dibutuhkan oleh executeSql sebagai tanda error sudah ditangani
//       }
//     );
//   });
// };

// export const createExpenseTable = () => { // tanggal 29/5/2025 
//   db.transaction(tx => {
//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS expenses (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         user_id INTEGER,
//         amount REAL,
//         type TEXT,
//         createdAt TEXT
//       )`,
//       [],
//       () => console.log('expenses table ready'),
//       (_, err) => { console.log('error creating table:', err); return true; }
//     );
//   });
// };


// export default db;

import SQLite, { SQLError, Transaction } from 'react-native-sqlite-storage';

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

const db = SQLite.openDatabase(
  {
    name: 'FinanceTracker.db',
    location: 'default',
  },
  () => {
    console.log('✅ Database opened');
  },
  error => {
    console.log('❌ Error opening database:', error);
  }
);

//  Create table USERS
export const createUserTable = () => {
  db.transaction((tx: Transaction) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        dob TEXT,
        gender TEXT,
        phone TEXT,
        job TEXT
      )`,
      [],
      () => console.log('✅ User table created'),
      (txObj: Transaction, error: SQLError): boolean => {
        console.log('❌ Failed to create user table:', error);
        return true;
      }
    );
  });
};

//  Create table EXPENSES
export const createExpenseTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        amount REAL,
        type TEXT,
        createdAt TEXT
      )`,
      [],
      () => console.log('✅ Expense table created'),
      (_, error) => {
        console.log('❌ Failed to create expense table:', error);
        return true;
      }
    );
  });
};

//  Insert new user with validations
export const insertUser = (
  name: string,
  email: string,
  password: string,
  dob: string,
  gender: string,
  phone: string,
  job: string,
  onSuccess: () => void,
  onError: (message: string) => void
) => {
  if (!name || !email || !password || !dob || !gender || !phone || !job) {
    return onError('Semua field harus diisi');
  }

  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO users (name, email, password, dob, gender, phone, job) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, password, dob, gender, phone, job],
      () => {
        console.log('✅ User inserted');
        onSuccess();
      },
      (_, error) => {
        console.log('❌ Insert user error:', error);
        onError('Gagal membuat akun. Email mungkin sudah digunakan.');
        return false;
      }
    );
  });
};


//  Login check
export const checkUserExists = async (
  email: string,
  password: string
): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows.item(0));
          } else {
            resolve(null);
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};

//  Login callback version
export const loginUser = (
  email: string,
  password: string,
  onSuccess: (user: any) => void,
  onError: (err: any) => void
) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password],
      (_, results) => {
        if (results.rows.length > 0) {
          onSuccess(results.rows.item(0));
        } else {
          onError('Invalid credentials');
        }
      },
      (_, error) => {
        console.log('❌ Login error:', error);
        onError(error);
        return false;
      }
    );
  });
};

//  Get all users
export const getAllUsers = (
  onSuccess: (users: any[]) => void,
  onError: (err: any) => void
) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM users',
      [],
      (tx, results) => {
        const users = [];
        for (let i = 0; i < results.rows.length; i++) {
          users.push(results.rows.item(i));
        }
        onSuccess(users);
      },
      (_, error) => {
        console.log('❌ Get users error:', error);
        onError(error);
        return false;
      }
    );
  });
};

export default db;
