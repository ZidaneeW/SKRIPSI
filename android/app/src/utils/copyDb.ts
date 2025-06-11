import RNFS from 'react-native-fs';
import db from '../db/db'; // pastikan path ini bener

export const exportDbToDownload = async () => {
  return new Promise<string>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('PRAGMA database_list', [], async (_, result) => {
        const dbPath = result.rows.item(0).file; // ini path asli DB
        const destPath = `${RNFS.DownloadDirectoryPath}/FinanceTrackerBaru.db`;

        try {
          const exists = await RNFS.exists(dbPath);
          if (!exists) throw new Error('DB file tidak ditemukan');

          await RNFS.copyFile(dbPath, destPath);
          console.log(`📤 DB berhasil diekspor ke ${destPath}`);
          resolve(destPath);
        } catch (err) {
          reject(err);
        }
      }, (_, err) => {
        reject(new Error('Gagal ambil path dari PRAGMA: ' + err.message));
        return false;
      });
    });
  });
};