// App.js
// Universal IR Remote - Expo (Managed Workflow)
// Simpan file ini di root repositori GitHub Anda
// Jalankan dengan: npx create-expo-app . && npx expo start

import React, { useState } from 'react';
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
} from 'react-native';

// ┌──────────────────────────────────────┐
// │ DATABASE KODE IR (CONTOH SEDERHANA)  │
// └──────────────────────────────────────┘
const IR_CODES = {
  'Samsung TV': {
    POWER: [9000, 4500, 560, 1690, 560, 1690, 560, 560, 560, 560, 560, 1690, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 560, 560, 560, 560, 560, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 560, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 1690, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560, 1690, 560, 560, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 1690, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560, 1690, 560, 560, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 1690, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560, 1690, 560, 560, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 1690, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560, 1690, 560, 560, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 1690, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560, 1690, 560, 560, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 1690, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560, 1690, 560, 560, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 1690, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560, 1690, 560, 560, 560, 169......],
    VOL_UP: [9000, 4500, 560, 1690, /* ... */],
    VOL_DOWN: [9000, 4500, 560, 560, /* ... */],
  },
  'LG TV': {
    POWER: [9000, 4500, 560, 560, /* pola berbeda */],
  },
};

// ┌──────────────────────────────┐
// │ FUNGSI KIRIM IR (PLACEHOLDER)│
// └──────────────────────────────┘
const sendIRSignal = (brand, command) => {
  if (Platform.OS !== 'android') {
    Alert.alert('❌ Tidak Didukung', 'IR hanya bekerja di perangkat Android dengan IR Blaster.');
    return;
  }

  const codes = IR_CODES[brand];
  if (!codes || !codes[command]) {
    Alert.alert('⚠️ Kode Tidak Ditemukan', `Tidak ada kode IR untuk ${brand} - ${command}`);
    return;
  }

  // 🔜 INI TEMPAT KODE NATIVE AKAN DIJALANKAN SETELAH EJECT
  // Contoh: NativeModules.IRTransmitter.send(38000, codes[command]);
  Alert.alert(
    '📡 IR Dikirim (Simulasi)',
    `Merek: ${brand}\nPerintah: ${command}\n\n💡 Untuk fungsi nyata:\n1. Eject Expo\n2. Tambahkan modul native Android\n3. Panggil ConsumerIrManager`,
    [{ text: 'Mengerti' }]
  );
};

// ┌──────────────┐
// │ KOMPONEN UTAMA│
// └──────────────┘
export default function App() {
  const [remotes, setRemotes] = useState([
    { id: '1', name: 'TV Ruang Tamu', brand: 'Samsung TV', type: 'TV' },
    { id: '2', name: 'AC Kamar', brand: 'Generic AC', type: 'AC' },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRemote, setNewRemote] = useState({ name: '', brand: 'Samsung TV', type: 'TV' });

  const handleAddRemote = () => {
    if (!newRemote.name.trim()) {
      Alert.alert('Nama tidak boleh kosong');
      return;
    }
    setRemotes([
      ...remotes,
      { id: Date.now().toString(), ...newRemote },
    ]);
    setNewRemote({ name: '', brand: 'Samsung TV', type: 'TV' });
    setShowAddForm(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Universal IR Remote</Text>
        <Text style={styles.subtitle}>Kontrol TV, AC, dan perangkat IR lainnya</Text>

        {/* Tombol Tambah Remote */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Text style={styles.addButtonText}>
            {showAddForm ? 'Batal' : '➕ Tambah Remote'}
          </Text>
        </TouchableOpacity>

        {/* Form Tambah Remote */}
        {showAddForm && (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Nama Remote (contoh: TV Kamar)"
              value={newRemote.name}
              onChangeText={(text) => setNewRemote({ ...newRemote, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Merek (contoh: Samsung TV)"
              value={newRemote.brand}
              onChangeText={(text) => setNewRemote({ ...newRemote, brand: text })}
            />
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.typeButton, newRemote.type === 'TV' && styles.typeButtonActive]}
                onPress={() => setNewRemote({ ...newRemote, type: 'TV' })}
              >
                <Text style={styles.typeButtonText}>TV</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, newRemote.type === 'AC' && styles.typeButtonActive]}
                onPress={() => setNewRemote({ ...newRemote, type: 'AC' })}
              >
                <Text style={styles.typeButtonText}>AC</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, newRemote.type === 'Other' && styles.typeButtonActive]}
                onPress={() => setNewRemote({ ...newRemote, type: 'Other' })}
              >
                <Text style={styles.typeButtonText}>Lainnya</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleAddRemote}>
              <Text style={styles.saveButtonText}>Simpan Remote</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Daftar Remote */}
        {remotes.map((remote) => (
          <View key={remote.id} style={styles.remoteCard}>
            <Text style={styles.remoteName}>{remote.name}</Text>
            <Text style={styles.remoteBrand}>{remote.brand} • {remote.type}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.irBtn, { backgroundColor: '#e53935' }]}
                onPress={() => sendIRSignal(remote.brand, 'POWER')}
              >
                <Text style={styles.btnText}>Power</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.irBtn, { backgroundColor: '#1e88e5' }]}
                onPress={() => sendIRSignal(remote.brand, 'VOL_UP')}
              >
                <Text style={styles.btnText}>Vol +</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.irBtn, { backgroundColor: '#43a047' }]}
                onPress={() => sendIRSignal(remote.brand, 'VOL_DOWN')}
              >
                <Text style={styles.btnText}>Vol -</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={styles.footer}>
          ℹ️ Catatan: Untuk mengirim sinyal IR sungguhan, proyek ini harus di-eject dari Expo
          dan ditambahkan modul native Android yang mengakses ConsumerIrManager.
          {'\n\n'}📱 Hanya bekerja di perangkat Android dengan IR Blaster (Xiaomi, Huawei lama, dll).
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ┌──────────────┐
// │ STYLES       │
// └──────────────┘
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  scroll: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#1a237e', marginBottom: 6 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#546e7a', marginBottom: 20 },
  addButton: {
    backgroundColor: '#5c6bc0',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  form: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  typeButton: {
    flex: 1,
    marginHorizontal: 4,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  typeButtonActive: { backgroundColor: '#7986cb' },
  typeButtonText: { color: '#000', fontWeight: '600' },
  saveButton: {
    backgroundColor: '#388e3c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  remoteCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  remoteName: { fontSize: 18, fontWeight: 'bold', color: '#263238' },
  remoteBrand: { fontSize: 14, color: '#607d8b', marginBottom: 12 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  irBtn: { flex: 1, marginHorizontal: 4, padding: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '600', fontSize: 14 },
  footer: {
    marginTop: 30,
    fontSize: 13,
    color: '#78909c',
    textAlign: 'center',
    lineHeight: 20,
  },
});
