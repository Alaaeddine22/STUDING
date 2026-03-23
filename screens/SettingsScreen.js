import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { getSettings, saveSettings, resetAllData } from '../utils/StorageManager';
import { lightTheme, darkTheme } from '../utils/theme';

export default function SettingsScreen({ navigation }) {
  const [settings, setSettings] = useState({ darkMode: false, soundEnabled: true });
  const [isDark, setIsDark] = useState(false);
  const colors = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    getSettings().then(s => { setSettings(s); setIsDark(s.darkMode); });
  }, []);

  const updateSetting = async (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    if (key === 'darkMode') setIsDark(value);
    await saveSettings(updated);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset All Data?',
      'This will erase all progress, stars, and badges. This cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: async () => { await resetAllData(); navigation.navigate('Home'); } },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.back, { color: colors.textSecondary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>⚙️ Settings</Text>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>🌙 Dark Mode</Text>
            <Switch value={settings.darkMode} onValueChange={v => updateSetting('darkMode', v)} trackColor={{ false: '#E0E0E0', true: '#667EEA' }} />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>🔊 Sound Effects</Text>
            <Switch value={settings.soundEnabled} onValueChange={v => updateSetting('soundEnabled', v)} trackColor={{ false: '#E0E0E0', true: '#667EEA' }} />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>ℹ️ About</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>Happy Learning Kids v1.0</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>A fun offline learning app for children ages 6–12</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>📚 Math + Arabic</Text>
        </View>

        <TouchableOpacity style={[styles.resetBtn, { backgroundColor: '#FF767520' }]} onPress={handleReset}>
          <Text style={styles.resetText}>🗑️ Reset All Progress</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 50 },
  back: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 20, borderRadius: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  label: { fontSize: 16, fontWeight: '600' },
  divider: { height: 1, marginVertical: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  infoText: { fontSize: 14, marginVertical: 2 },
  resetBtn: { padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 12 },
  resetText: { fontSize: 16, fontWeight: '600', color: '#FF7675' },
});
