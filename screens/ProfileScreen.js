import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, StatusBar } from 'react-native';
import AvatarPicker from '../components/AvatarPicker';
import AnimatedButton from '../components/AnimatedButton';
import StarCounter from '../components/StarCounter';
import { getProfile, saveProfile, getProgress, getSettings } from '../utils/StorageManager';
import { lightTheme, darkTheme, avatars } from '../utils/theme';
import rewards from '../data/rewards.json';

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState({});
  const [isDark, setIsDark] = useState(false);
  const colors = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    (async () => {
      const [p, pr, s] = await Promise.all([getProfile(), getProgress(), getSettings()]);
      setProfile(p);
      setProgress(pr);
      setName(p.name || '');
      setSelectedAvatar(p.avatar || 0);
      setIsDark(s.darkMode);
    })();
  }, []);

  const handleSave = async () => {
    const updated = { ...(profile || {}), name, avatar: selectedAvatar, createdAt: profile?.createdAt || new Date().toISOString() };
    await saveProfile(updated);
    navigation.goBack();
  };

  const currentLevel = rewards.levelThresholds.filter(l => (profile?.totalStars || 0) >= l.starsRequired).pop();
  const nextLevel = rewards.levelThresholds.find(l => (profile?.totalStars || 0) < l.starsRequired);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>My Profile</Text>

        {/* Current avatar display */}
        <View style={[styles.currentAvatar, { backgroundColor: colors.card }]}>
          <Text style={styles.bigEmoji}>{avatars[selectedAvatar]?.emoji || '🐱'}</Text>
          <StarCounter count={profile?.totalStars || 0} size={28} />
          {currentLevel && <Text style={[styles.levelBadge, { color: colors.primary }]}>{currentLevel.title}</Text>}
        </View>

        {/* Name input */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Your Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Enter your name..."
          placeholderTextColor={colors.textLight}
          value={name}
          onChangeText={setName}
          maxLength={20}
        />

        {/* Avatar picker */}
        <AvatarPicker selected={selectedAvatar} onSelect={setSelectedAvatar} theme={colors} />

        {/* Stats */}
        <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statsTitle, { color: colors.text }]}>📊 My Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{progress.completedLessons?.length || 0}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Lessons</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{progress.streakDays || 0}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile?.badges?.length || 0}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Badges</Text>
            </View>
          </View>
          {nextLevel && (
            <Text style={[styles.nextLevel, { color: colors.textSecondary }]}>
              Next: {nextLevel.title} ({nextLevel.starsRequired - (profile?.totalStars || 0)} ⭐ to go!)
            </Text>
          )}
        </View>

        {/* Badges */}
        {profile?.badges?.length > 0 && (
          <View style={[styles.badgeCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statsTitle, { color: colors.text }]}>🏅 My Badges</Text>
            <View style={styles.badgeGrid}>
              {profile.badges.map((b, i) => <Text key={i} style={styles.badge}>{b}</Text>)}
            </View>
          </View>
        )}

        <AnimatedButton title="Save Profile" onPress={handleSave} color={colors.primary} style={{ marginTop: 16 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingTop: 50, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  currentAvatar: {
    alignItems: 'center', padding: 20, borderRadius: 20, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  bigEmoji: { fontSize: 80, marginBottom: 8 },
  levelBadge: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, marginLeft: 4 },
  input: { padding: 16, borderRadius: 14, fontSize: 18, borderWidth: 1, marginBottom: 20, fontWeight: '500' },
  statsCard: { padding: 20, borderRadius: 20, marginTop: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  statsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#FF6B6B' },
  statLabel: { fontSize: 12, marginTop: 2 },
  nextLevel: { fontSize: 13, textAlign: 'center', marginTop: 12 },
  badgeCard: { padding: 20, borderRadius: 20, marginTop: 12 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: { fontSize: 28 },
});
