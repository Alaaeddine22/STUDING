import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { getProfile, getProgress, getSettings } from '../utils/StorageManager';
import { lightTheme, darkTheme } from '../utils/theme';
import mathLessons from '../data/lessons_math.json';
import arabicLessons from '../data/lessons_arabic.json';

export default function ParentModeScreen({ navigation }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [profile, setProfile] = useState({});
  const [progress, setProgress] = useState({});
  const [isDark, setIsDark] = useState(false);
  const colors = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    (async () => {
      const [p, pr, s] = await Promise.all([getProfile(), getProgress(), getSettings()]);
      setProfile(p);
      setProgress(pr);
      setIsDark(s.darkMode);
    })();
  }, []);

  const handlePinSubmit = async () => {
    const settings = await getSettings();
    if (pin === settings.parentPin) {
      setAuthenticated(true);
    } else {
      Alert.alert('Wrong PIN', 'Please try again.');
      setPin('');
    }
  };

  const mathCompleted = (progress.completedLessons || []).filter(id => mathLessons.some(l => l.id === id)).length;
  const arabicCompleted = (progress.completedLessons || []).filter(id => arabicLessons.some(l => l.id === id)).length;

  const getAvgScore = (lessons) => {
    const scores = Object.entries(progress.lessonScores || {})
      .filter(([id]) => lessons.some(l => l.id === parseInt(id)))
      .map(([, s]) => s.correct / s.total);
    if (scores.length === 0) return 0;
    return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100);
  };

  if (!authenticated) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.pinContainer}>
          <Text style={styles.lockEmoji}>🔒</Text>
          <Text style={[styles.pinTitle, { color: colors.text }]}>Parent Mode</Text>
          <Text style={[styles.pinSubtitle, { color: colors.textSecondary }]}>Enter PIN to continue</Text>
          <TextInput
            style={[styles.pinInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder="Enter PIN"
            placeholderTextColor={colors.textLight}
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            secureTextEntry
            maxLength={4}
            onSubmitEditing={handlePinSubmit}
          />
          <TouchableOpacity style={[styles.pinBtn, { backgroundColor: colors.primary }]} onPress={handlePinSubmit}>
            <Text style={styles.pinBtnText}>Unlock</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
            <Text style={[styles.backLink, { color: colors.textSecondary }]}>← Go Back</Text>
          </TouchableOpacity>
          <Text style={[styles.defaultPin, { color: colors.textLight }]}>Default PIN: 1234</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backLink, { color: colors.textSecondary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>📊 Parent Dashboard</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {profile.name ? `${profile.name}'s Progress` : 'Student Progress'}
        </Text>

        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>🔢 Mathematics</Text>
          <Text style={[styles.stat, { color: colors.math }]}>{mathCompleted} / {mathLessons.length} lessons</Text>
          <Text style={[styles.stat, { color: colors.textSecondary }]}>Average score: {getAvgScore(mathLessons)}%</Text>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View style={[styles.progressFill, { width: `${(mathCompleted / mathLessons.length) * 100}%`, backgroundColor: colors.math }]} />
          </View>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>📝 Arabic</Text>
          <Text style={[styles.stat, { color: colors.arabic }]}>{arabicCompleted} / {arabicLessons.length} lessons</Text>
          <Text style={[styles.stat, { color: colors.textSecondary }]}>Average score: {getAvgScore(arabicLessons)}%</Text>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View style={[styles.progressFill, { width: `${(arabicCompleted / arabicLessons.length) * 100}%`, backgroundColor: colors.arabic }]} />
          </View>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>📈 Overall</Text>
          <View style={styles.overallGrid}>
            <View style={styles.overallItem}><Text style={styles.overallValue}>{profile.totalStars || 0}</Text><Text style={[styles.overallLabel, { color: colors.textSecondary }]}>Stars</Text></View>
            <View style={styles.overallItem}><Text style={styles.overallValue}>{progress.streakDays || 0}</Text><Text style={[styles.overallLabel, { color: colors.textSecondary }]}>Day Streak</Text></View>
            <View style={styles.overallItem}><Text style={styles.overallValue}>{profile.level || 1}</Text><Text style={[styles.overallLabel, { color: colors.textSecondary }]}>Level</Text></View>
            <View style={styles.overallItem}><Text style={styles.overallValue}>{progress.dailyChallengesCompleted || 0}</Text><Text style={[styles.overallLabel, { color: colors.textSecondary }]}>Challenges</Text></View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingTop: 50, paddingBottom: 40 },
  pinContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  lockEmoji: { fontSize: 60, marginBottom: 12 },
  pinTitle: { fontSize: 24, fontWeight: 'bold' },
  pinSubtitle: { fontSize: 14, marginTop: 4, marginBottom: 20 },
  pinInput: { width: 200, padding: 16, fontSize: 24, textAlign: 'center', borderWidth: 2, borderRadius: 16, fontWeight: 'bold', letterSpacing: 8 },
  pinBtn: { paddingVertical: 14, paddingHorizontal: 40, borderRadius: 14, marginTop: 16 },
  pinBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  defaultPin: { fontSize: 12, marginTop: 20 },
  backLink: { fontSize: 16, fontWeight: '600' },
  title: { fontSize: 26, fontWeight: 'bold', marginTop: 12 },
  subtitle: { fontSize: 14, marginBottom: 20 },
  statCard: { padding: 20, borderRadius: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  stat: { fontSize: 14, marginVertical: 2 },
  progressBar: { height: 8, borderRadius: 4, marginTop: 10, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  overallGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginTop: 8 },
  overallItem: { alignItems: 'center', width: '45%', marginVertical: 8 },
  overallValue: { fontSize: 28, fontWeight: 'bold', color: '#FF6B6B' },
  overallLabel: { fontSize: 12, marginTop: 2 },
});
