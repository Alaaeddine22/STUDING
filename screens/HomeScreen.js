import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Mascot from '../components/Mascot';
import StarCounter from '../components/StarCounter';
import AnimatedButton from '../components/AnimatedButton';
import { getProfile, getProgress, updateStreak } from '../utils/StorageManager';
import { lightTheme, darkTheme, avatars } from '../utils/theme';
import { getSettings } from '../utils/StorageManager';

export default function HomeScreen({ navigation }) {
  const [profile, setProfile] = useState({ name: '', avatar: 0, totalStars: 0, level: 1 });
  const [progress, setProgress] = useState({ completedLessons: [], streakDays: 0 });
  const [isDark, setIsDark] = useState(false);
  const colors = isDark ? darkTheme : lightTheme;

  const loadData = async () => {
    const [p, pr, s] = await Promise.all([getProfile(), updateStreak(), getSettings()]);
    setProfile(p);
    setProgress(pr);
    setIsDark(s.darkMode);
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const avatar = avatars[profile.avatar] || avatars[0];
  const hasProfile = profile.name && profile.name.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={[styles.profileBadge, { backgroundColor: colors.card }]}>
            <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
            <View>
              <Text style={[styles.greeting, { color: colors.text }]}>
                {hasProfile ? `Hi, ${profile.name}!` : 'Welcome!'}
              </Text>
              <Text style={[styles.levelText, { color: colors.textSecondary }]}>Level {profile.level}</Text>
            </View>
          </TouchableOpacity>
          <StarCounter count={profile.totalStars} />
        </View>

        {/* Streak */}
        {progress.streakDays > 0 && (
          <View style={[styles.streakCard, { backgroundColor: '#FF634720' }]}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakText}>{progress.streakDays} Day Streak!</Text>
          </View>
        )}

        {/* Mascot */}
        <Mascot mood={hasProfile ? 'happy' : 'waving'} showMessage={true}
          customMessage={hasProfile ? `Let's learn, ${profile.name}!` : 'Set up your profile first! 👆'} />

        {/* Subject Cards */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose a Subject</Text>

        <TouchableOpacity
          style={[styles.subjectCard, { backgroundColor: colors.math }]}
          onPress={() => navigation.navigate('LessonList', { subject: 'math' })}
          activeOpacity={0.8}
        >
          <View style={styles.subjectIcon}><Text style={styles.subjectEmoji}>🔢</Text></View>
          <View style={styles.subjectInfo}>
            <Text style={styles.subjectTitle}>Mathematics</Text>
            <Text style={styles.subjectDesc}>Numbers, Operations, Geometry & More</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.subjectCard, { backgroundColor: colors.arabic }]}
          onPress={() => navigation.navigate('LessonList', { subject: 'arabic' })}
          activeOpacity={0.8}
        >
          <View style={styles.subjectIcon}><Text style={styles.subjectEmoji}>📝</Text></View>
          <View style={styles.subjectInfo}>
            <Text style={styles.subjectTitle}>العربية</Text>
            <Text style={styles.subjectDesc}>Alphabet, Words, Grammar & Reading</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        {/* Daily Challenge */}
        <AnimatedButton
          title="⚡ Daily Challenge"
          onPress={() => navigation.navigate('DailyChallenge')}
          color="#FF6B6B"
          style={styles.dailyBtn}
          size="large"
        />

        {/* Bottom buttons */}
        <View style={styles.bottomRow}>
          <TouchableOpacity style={[styles.smallBtn, { backgroundColor: colors.card }]} onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.smallBtnEmoji}>⚙️</Text>
            <Text style={[styles.smallBtnText, { color: colors.text }]}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.smallBtn, { backgroundColor: colors.card }]} onPress={() => navigation.navigate('ParentMode')}>
            <Text style={styles.smallBtnEmoji}>👨‍👩‍👧</Text>
            <Text style={[styles.smallBtnText, { color: colors.text }]}>Parents</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingTop: 50, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  profileBadge: {
    flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 16, gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  avatarEmoji: { fontSize: 36 },
  greeting: { fontSize: 18, fontWeight: 'bold' },
  levelText: { fontSize: 13 },
  streakCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 12, borderRadius: 12, gap: 8, marginBottom: 8,
  },
  streakEmoji: { fontSize: 24 },
  streakText: { fontSize: 16, fontWeight: 'bold', color: '#FF6347' },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 16, marginBottom: 12 },
  subjectCard: {
    flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20,
    marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 5,
  },
  subjectIcon: {
    width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  subjectEmoji: { fontSize: 30 },
  subjectInfo: { flex: 1, marginLeft: 16 },
  subjectTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  subjectDesc: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  arrow: { fontSize: 24, color: '#FFF', fontWeight: 'bold' },
  dailyBtn: { marginTop: 16, marginBottom: 16 },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 8 },
  smallBtn: {
    alignItems: 'center', padding: 16, borderRadius: 16, width: 100,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  smallBtnEmoji: { fontSize: 28 },
  smallBtnText: { fontSize: 12, fontWeight: '600', marginTop: 4 },
});
