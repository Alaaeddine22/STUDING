import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Mascot from '../components/Mascot';
import AnimatedButton from '../components/AnimatedButton';
import ConfettiEffect from '../components/ConfettiEffect';
import { getProfile, saveProfile, getProgress, saveProgress, getSettings } from '../utils/StorageManager';
import { calculateStars, getEncouragingMessage } from '../utils/AdaptiveDifficulty';
import { lightTheme, darkTheme } from '../utils/theme';
import rewards from '../data/rewards.json';

export default function ResultScreen({ route, navigation }) {
  const { lesson, score, isChallenge } = route.params;
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [newBadges, setNewBadges] = useState([]);
  const colors = isDark ? darkTheme : lightTheme;

  const stars = calculateStars(score.correct, score.total);
  const msg = getEncouragingMessage(score.correct, score.total);
  const isPerfect = score.correct === score.total;

  useEffect(() => {
    (async () => {
      const s = await getSettings();
      setIsDark(s.darkMode);
      if (stars > 0) setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      // Update progress
      const profile = await getProfile();
      const progress = await getProgress();

      const earnedStars = stars * 2 + (isChallenge ? 3 : 0);
      profile.totalStars = (profile.totalStars || 0) + earnedStars;

      // Update level
      const newLevel = rewards.levelThresholds.filter(l => profile.totalStars >= l.starsRequired).pop();
      if (newLevel) profile.level = newLevel.level;

      if (lesson && !isChallenge) {
        if (!progress.completedLessons.includes(lesson.id)) {
          progress.completedLessons.push(lesson.id);
        }
        progress.lessonScores[lesson.id] = { correct: score.correct, total: score.total };
        if (isPerfect) progress.perfectLessons = (progress.perfectLessons || 0) + 1;
      }
      if (isChallenge) {
        progress.dailyChallengesCompleted = (progress.dailyChallengesCompleted || 0) + 1;
      }

      // Check milestones
      const earned = [];
      for (const m of rewards.milestones) {
        if (profile.badges?.includes(m.reward.badge)) continue;
        let met = false;
        if (m.requirement.type === 'lessons_completed') met = progress.completedLessons.length >= m.requirement.count;
        else if (m.requirement.type === 'total_stars') met = profile.totalStars >= m.requirement.count;
        else if (m.requirement.type === 'perfect_lesson') met = (progress.perfectLessons || 0) >= m.requirement.count;
        else if (m.requirement.type === 'daily_challenges') met = (progress.dailyChallengesCompleted || 0) >= m.requirement.count;
        if (met) {
          earned.push(m);
          if (!profile.badges) profile.badges = [];
          profile.badges.push(m.reward.badge);
          profile.totalStars += m.reward.stars;
        }
      }
      setNewBadges(earned);
      await saveProfile(profile);
      await saveProgress(progress);
    })();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ConfettiEffect active={showConfetti} />

      <View style={styles.content}>
        <Mascot mood={stars >= 2 ? 'celebrating' : 'encouraging'} size={90} />

        <Text style={[styles.title, { color: colors.text }]}>{msg.title}</Text>
        <Text style={[styles.message, { color: colors.textSecondary }]}>{msg.message}</Text>

        <View style={[styles.scoreCard, { backgroundColor: colors.card }]}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={[styles.scoreValue, { color: colors.primary }]}>{score.correct} / {score.total}</Text>
          <Text style={styles.starsDisplay}>{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</Text>
          <Text style={[styles.earnedText, { color: colors.success }]}>+{stars * 2 + (isChallenge ? 3 : 0)} stars earned!</Text>
        </View>

        {newBadges.length > 0 && (
          <View style={[styles.badgeCard, { backgroundColor: '#FFE66D20' }]}>
            <Text style={styles.badgeTitle}>🎉 New Badge{newBadges.length > 1 ? 's' : ''}!</Text>
            {newBadges.map((b, i) => (
              <Text key={i} style={styles.badgeItem}>{b.reward.badge} {b.name}</Text>
            ))}
          </View>
        )}

        <View style={styles.buttons}>
          {lesson && !isChallenge && (
            <AnimatedButton
              title="Try Again 🔄"
              onPress={() => navigation.replace('Exercise', { lesson })}
              color={colors.secondary}
              size="medium"
            />
          )}
          <AnimatedButton
            title="Continue →"
            onPress={() => {
              if (isChallenge) navigation.navigate('Home');
              else navigation.navigate('LessonList', { subject: lesson.subject });
            }}
            color={colors.primary}
            size="medium"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginTop: 12 },
  message: { fontSize: 16, textAlign: 'center', marginTop: 8, marginBottom: 20 },
  scoreCard: {
    alignItems: 'center', padding: 24, borderRadius: 20, width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  scoreLabel: { fontSize: 14, color: '#999', fontWeight: '600' },
  scoreValue: { fontSize: 42, fontWeight: 'bold', marginVertical: 4 },
  starsDisplay: { fontSize: 28, marginVertical: 8 },
  earnedText: { fontSize: 16, fontWeight: '600' },
  badgeCard: { padding: 16, borderRadius: 16, marginTop: 16, width: '100%', alignItems: 'center' },
  badgeTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  badgeItem: { fontSize: 16, marginVertical: 2 },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 24 },
});
