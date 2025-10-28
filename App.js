// App.js
// Universal IR Remote with Packed JSON Support
// Simpan di GitHub sebagai proyek Expo

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  TextInput,
  Clipboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ┌──────────────────────────────────────┐
// │ CONTOH REMOTE DALAM FORMAT PACKED JSON │
// └──────────────────────────────────────┘
// Format: { id, name, brand, type, commands: { POWER: [freq, ...pattern], ... } }
const DEFAULT_REMOTES = [
  {
    id: '1',
    name: 'TV Samsung',
    brand: 'Samsung',
    type: 'TV',
    commands: {
      POWER: [38000, 9000, 4500, 560, 1690, 560, 1690, 560, 560, 560, 560],
      VOL_UP: [38000, 9000, 4500, 560, 560, 560, 1690, 560, 560, 560, 1690],
      VOL_DOWN: [38000, 9000, 4500, 560, 1690, 560, 560, 560, 1690, 560, 560],
    },
  },
];

// ┌──────────────────────┐
// │ FUNGSI IR (PLACEHOLDER)│
// └──────────────────────┘
const sendIRSignal = (commandArray) => {
  if (Platform.OS !== 'android') {
    Alert.alert('❌ Tidak Didukung', 'IR hanya bekerja di Android dengan IR Blaster.');
    return;
  }

  if (!commandArray || commandArray.length < 2) {
    Alert.alert('⚠️ Data Tidak Valid', 'Pola IR tidak lengkap.');
    return;
  }

  const frequency = commandArray[0];
  const pattern = commandArray.slice(1);

  // 🔜 Setelah eject, ganti dengan:
  // NativeModules.IRModule.transmit(frequency, pattern);
  Alert.alert(
    '📡 IR Dikirim (Simulasi)',
    `Frekuensi: ${frequency} Hz\nDurasi: ${pattern.length} pulse\n\n💡 Untuk fungsi nyata: eject Expo & tambahkan native module.`,
    [{ text: 'OK' }]
  );
};

// ┌──────────────────────┐
// │ KOMPONEN UTAMA       │
// └──────────────────────┘
export default function App() {
  const [remotes, setRemotes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRemote, setNewRemote] = useState({
    name: '',
    brand: '',
    type: 'TV',
    commands: { POWER: [38000], VOL_UP: [38000], VOL_DOWN: [38000] },
  });
  const [jsonInput, setJsonInput] = useState('');

  // Muat dari penyimpanan saat startup
  useEffect(() => {
    loadRemotes();
  }, []);

  const loadRemotes = async () => {
    try {
      const json = await AsyncStorage.getItem('ir_remotes');
      if (json) {
        setRemotes(JSON.parse(json));
      } else {
        setRemotes(DEFAULT_REMOTES);
        await AsyncStorage.setItem('ir_remotes', JSON.stringify(DEFAULT_REMOTES));
      }
    } catch (e) {
      console.error('Gagal muat remote:', e);
      setRemotes(DEFAULT_REMOTES);
    }
  };

  const saveRemotes = async (updatedRemotes) => {
    try {
      await AsyncStorage.setItem('ir_remotes', JSON.stringify(updatedRemotes));
      setRemotes(updatedRemotes);
    } catch (e) {
      Alert.alert('❌ Gagal Simpan', 'Tidak bisa menyimpan ke penyimpanan lokal.');
    }
  };

  const handleAddRemote = () => {
    if (!newRemote.name.trim() || !newRemote.brand.trim()) {
      Alert.alert('Nama dan merek harus diisi');
      return;
    }
    const updated = [...remotes, { ...newRemote, id: Date.now().toString() }];
    saveRemotes(updated);
    setNewRemote({ name: '', brand: '', type: 'TV', commands: { POWER: [38000], VOL_UP: [38000], VOL_DOWN: [38000] } });
    setShowAddForm(false);
  };

  const handleDeleteRemote = (id) => {
    Alert.alert('Hapus Remote?', 'Apakah Anda yakin?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => saveRemotes(remotes.filter(r => r.id !== id)) },
    ]);
  };

  const handleExport = async () => {
    try {
      await Clipboard.setStringAsync(JSON.stringify(remotes, null, 2));
      Alert.alert('✅ Berhasil', 'Data remote disalin ke clipboard!');
    } catch (e) {
      Alert.alert('❌ Gagal', 'Tidak bisa menyalin ke clipboard.');
    }
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed)) {
        saveRemotes(parsed);
        setJsonInput('');
        Alert.alert('✅ Berhasil', 'Remote berhasil diimpor!');
      } else {
        throw new Error('Bukan array');
      }
    } catch (e) {
      Alert.alert('❌ Format Salah', 'Pastikan JSON berupa array remote yang valid.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Universal IR Remote</Text>
        <Text style={styles.subtitle}>Dukung format JSON terkompresi</Text>

        {/* Aksi */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setShowAddForm(!showAddForm)}>
            <Text style={styles.actionBtnText}>➕ Tambah</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleExport}>
            <Text style={styles.actionBtnText}>📤 Ekspor</Text>
          </TouchableOpacity>
        </View>

        {/* Form Tambah */}
        {showAddForm && (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Nama (contoh: TV Kamar)"
              value={newRemote.name}
              onChangeText={(t) => setNewRemote({ ...newRemote, name: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Merek (contoh: Samsung)"
              value={newRemote.brand}
              onChangeText={(t) => setNewRemote({ ...newRemote, brand: t })}
            />
            <Text style={styles.label}>Perintah IR (format: frekuensi,pulse1,pulse2,...)</Text>
            <TextInput
              style={styles.input}
              placeholder="POWER: 38000,9000,4500,..."
              value={newRemote.commands.POWER.join(',')}
              onChangeText={(t) => {
                const nums = t.split(',').map(n => parseInt(n.trim()) || 0).filter(n => !isNaN(n));
                setNewRemote({ ...newRemote, commands: { ...newRemote.commands, POWER: nums } });
              }}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddRemote}>
                <Text style={styles.saveBtnText}>Simpan Remote</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAddForm(false)}>
                <Text style={styles.cancelBtnText}>Batal</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Impor JSON */}
        <View style={styles.importBox}>
          <Text style={styles.importLabel}>Impor dari JSON:</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={3}
            placeholder='[{"id":"1","name":"TV","commands":{"POWER":[38000,9000,4500,...]}}]'
            value={jsonInput}
            onChangeText={setJsonInput}
          />
          <TouchableOpacity style={styles.importBtn} onPress={handleImport}>
            <Text style={styles.importBtnText}>📥 Impor</Text>
          </TouchableOpacity>
        </View>

        {/* Daftar Remote */}
        {remotes.map((remote) => (
          <View key={remote.id} style={styles.remoteCard}>
            <View style={styles.remoteHeader}>
              <View>
                <Text style={styles.remoteName}>{remote.name}</Text>
                <Text style={styles.remoteBrand}>{remote.brand} • {remote.type}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteRemote(remote.id)}>
                <Text style={styles.deleteBtn}>🗑️</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonRow}>
              {Object.keys(remote.commands).map((cmd) => (
                <TouchableOpacity
                  key={cmd}
                  style={styles.irBtn}
                  onPress={() => sendIRSignal(remote.commands[cmd])}
                >
                  <Text style={styles.btnText}>{cmd}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.footer}>
          ℹ️ Format JSON: array objek dengan field `commands` berisi array [frekuensi, pulse1, pulse2, ...]
          {'\n'}📱 Hanya bekerja di Android dengan IR Blaster setelah eject dari Expo.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ┌──────────────┐
// │ STYLES       │
// └──────────────┘
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  scroll: { padding: 16, paddingBottom: 60 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#1a237e', marginBottom: 4 },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#546e7a', marginBottom: 16 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  actionBtn: { flex: 1, marginHorizontal: 4, padding: 12, backgroundColor: '#5c6bc0', borderRadius: 8, alignItems: 'center' },
  actionBtnText: { color: 'white', fontWeight: '600' },
  form: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16, gap: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 15 },
  label: { fontSize: 13, color: '#555', marginBottom: 4 },
  buttonRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  saveBtn: { flex: 1, padding: 12, backgroundColor: '#388e3c', borderRadius: 8, alignItems: 'center' },
  saveBtnText: { color: 'white', fontWeight: '600' },
  cancelBtn: { flex: 1, padding: 12, backgroundColor: '#bdbdbd', borderRadius: 8, alignItems: 'center' },
  cancelBtnText: { color: 'white', fontWeight: '600' },
  importBox: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 20 },
  importLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
    textAlignVertical: 'top',
    backgroundColor: '#fafafa',
  },
  importBtn: { marginTop: 10, padding: 10, backgroundColor: '#0288d1', borderRadius: 8, alignItems: 'center' },
  importBtnText: { color: 'white', fontWeight: '600' },
  remoteCard: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  remoteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  remoteName: { fontSize: 17, fontWeight: 'bold', color: '#263238' },
  remoteBrand: { fontSize: 13, color: '#607d8b' },
  deleteBtn: { fontSize: 18 },
  irBtn: { flex: 1, padding: 12, backgroundColor: '#7986cb', borderRadius: 8, alignItems: 'center', marginHorizontal: 4 },
  btnText: { color: 'white', fontWeight: '600', fontSize: 13 },
  footer: { marginTop: 20, fontSize: 12, color: '#78909c', textAlign: 'center', lineHeight: 18 },
});
