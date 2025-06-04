import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../db/db';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const screenWidth = Dimensions.get('window').width;

export function PredictionScreen() {
  const [activeTab, setActiveTab] = useState<'Prediction' | 'Analisis'>('Prediction');
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM expenses WHERE user_id = ?',
          [userId],
          (_, result) => {
            const data: any[] = [];
            for (let i = 0; i < result.rows.length; i++) {
              data.push(result.rows.item(i));
            }
            setExpenses(data);
          },
          (_, error) => {
            console.log('Select error:', error);
            return true;
          }
        );
      });
    };

    loadData();
  }, []);

  const linearRegression = (data: number[]): number => {
    const n = data.length;
    if (n === 0) return 0;
    const x = Array.from({ length: n }, (_, i) => i + 1);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = data.reduce((a, b) => a + b, 0);
    const sumXY = data.reduce((acc, y, i) => acc + y * x[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX || 1);
    const intercept = (sumY - slope * sumX) / n;
    const prediction = slope * (n + 1) + intercept;
    return isNaN(prediction) || prediction < 0 ? 0 : prediction;
  };

  const getWeekRange = (dateStr: string) => {
    const day = new Date(dateStr).getDate();
    if (day <= 7) return '1-7';
    if (day <= 14) return '8-14';
    if (day <= 21) return '15-21';
    return '22-31';
  };

  const weeklyTotals: { [week: string]: number[] } = {};
  expenses.forEach((e) => {
    const week = getWeekRange(e.createdAt);
    if (!weeklyTotals[week]) weeklyTotals[week] = [];
    weeklyTotals[week].push(e.amount);
  });

  const labels: string[] = ['1-7', '8-14', '15-21', '22-31'];
  const weeklySums: number[] = labels.map((week) => {
    return (weeklyTotals[week] || []).reduce((sum, val) => sum + val, 0);
  });

  const predictedTotal = linearRegression(weeklySums);

  const groupedByCategory: Record<string, number> = expenses.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = 0;
    acc[curr.category] += curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const exportToExcel = async () => {
    const ws = XLSX.utils.json_to_sheet(expenses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
    const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
    const file = `${RNFS.DownloadDirectoryPath}/prediksi_${Date.now()}.xlsx`;
    await RNFS.writeFile(file, wbout, 'ascii');
    await Share.open({ url: 'file://' + file });
  };

  const exportToPDF = async () => {
    const htmlContent = `
      <h1>Prediksi Bulan Depan</h1>
      <p>Total: Rp ${predictedTotal.toLocaleString('id-ID')}</p>
      <h2>Riwayat Transaksi:</h2>
      <ul>
        ${expenses.map((e: any) => `<li>${e.type} - Rp ${e.amount.toLocaleString('id-ID')}</li>`).join('')}
      </ul>
    `;
    const options = {
      html: htmlContent,
      fileName: `prediksi_${Date.now()}`,
      directory: 'Documents',
    };
    const pdf = await RNHTMLtoPDF.convert(options);
    await Share.open({ url: 'file://' + pdf.filePath });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Prediction' && styles.activeTab]}
          onPress={() => setActiveTab('Prediction')}
        >
          <Text style={[styles.tabText, activeTab === 'Prediction' && styles.activeTabText]}>Prediction</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Analisis' && styles.activeTab]}
          onPress={() => setActiveTab('Analisis')}
        >
          <Text style={[styles.tabText, activeTab === 'Analisis' && styles.activeTabText]}>Analisis</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {activeTab === 'Prediction' ? (
          <>
            <Text style={styles.title}>Prediksi Bulan Depan</Text>
            <Text style={styles.total}>Rp {predictedTotal.toLocaleString('id-ID')}</Text>
            <Text style={styles.note}>Berdasarkan histori bulan sebelumnya</Text>
            {weeklySums.map((sum, index) => (
              <View key={index} style={{ marginVertical: 4 }}>
                <Text>{labels[index]}</Text>
                <View style={{ backgroundColor: '#ddd', height: 10, borderRadius: 5 }}>
                  <View style={{
                    backgroundColor: '#3B82F6',
                    width: `${Math.min((sum / Math.max(...weeklySums)) * 100, 100)}%`,
                    height: 10, borderRadius: 5
                  }} />
                </View>
                <Text style={{ fontSize: 12, color: '#888' }}>Rp {sum.toLocaleString('id-ID')}</Text>
              </View>
            ))}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <TouchableOpacity style={[styles.exportButton, { backgroundColor: '#1E3A8A' }]} onPress={exportToPDF}>
                <Text style={{ color: '#fff' }}>Export PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.exportButton, { backgroundColor: '#059669' }]} onPress={exportToExcel}>
                <Text style={{ color: '#fff' }}>Export Excel</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.title, { fontSize: 18, marginTop: 20 }]}>Riwayat Transaksi</Text>
            <FlatList
              data={expenses}
              keyExtractor={(_, index) => index.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.transactionItem}>
                  <Text style={styles.transactionTitle}>📌 {item.type}</Text>
                  <Text style={styles.transactionAmount}>-Rp {item.amount.toLocaleString('id-ID')}</Text>
                  <Text style={styles.transactionDate}>{new Date(item.createdAt).toLocaleString('id-ID')}</Text>
                </View>
              )}
            />
          </>
        ) : (
          <>
            <Text style={styles.title}>Analisis Pengeluaran</Text>
            {Object.entries(groupedByCategory).map(([category, value], i) => {
              const amount = value as number;
              return (
                <View key={i} style={{ marginVertical: 6 }}>
                  <Text style={{ fontWeight: 'bold' }}>{category}</Text>
                  <View style={{ backgroundColor: '#ddd', height: 10, borderRadius: 5 }}>
                    <View style={{
                      backgroundColor: '#3B82F6',
                      width: `${Math.min((amount / Math.max(...Object.values(groupedByCategory))) * 100, 100)}%`,
                      height: 10, borderRadius: 5
                    }} />
                  </View>
                  <Text style={{ fontSize: 12, color: '#888' }}>Rp {amount.toLocaleString('id-ID')}</Text>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  total: { fontSize: 32, marginVertical: 10 },
  note: { marginBottom: 20, fontSize: 12, color: 'gray' },
  transactionItem: {
    backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginVertical: 6,
  },
  transactionTitle: { fontWeight: 'bold', fontSize: 14 },
  transactionAmount: { fontSize: 14, color: '#ef4444', marginVertical: 2 },
  transactionDate: { fontSize: 12, color: 'gray' },
  tabContainer: {
    flexDirection: 'row', justifyContent: 'space-around', marginTop: 20,
    backgroundColor: '#E5E7EB', borderRadius: 10, marginHorizontal: 20,
  },
  tab: { paddingVertical: 10, flex: 1, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#3B82F6' },
  tabText: { color: '#374151', fontWeight: '600' },
  activeTabText: { color: '#FFFFFF' },
  exportButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});










