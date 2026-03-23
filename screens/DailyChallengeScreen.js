import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Mascot from '../components/Mascot';
import AnimatedButton from '../components/AnimatedButton';
import { getProgress, getDailyChallenge, saveDailyChallenge, getSettings } from '../utils/StorageManager';
import { getDailyChallengeExercises } from '../utils/AdaptiveDifficulty';
import { lightTheme, darkTheme } from '../utils/theme';
import allExercises from '../data/exercises.json';

export default function DailyChallengeScreen({ navigation }) {
  const [completed, setCompleted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const colors = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    (async () => {
      const s = await getSettings();
      setIsDark(s.darkMode);
      const daily = await getDailyChallenge();
      if (daily && daily.completed) setCompleted(true);
    })();
  }, []);

  const startChallenge = async () => {
    const progress = await getProgress();
    const exercises = getDailyChallengeExercises(allExercises, progress.completedLessons, 8);
    await saveDailyChallenge({ completed: false, exerciseIds: exercises.map(e => e.id) });
    navigation.navigate('Exercise', { isChallenge: true, challengeExercises: exercises });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.content}>
        <Text style={styles.bigEmoji}>⚡</Text>
        <Text style={[styles.title, { color: colors.text }]}>Daily Challenge</Text>

        <Mascot mood={completed ? 'celebrating' : 'waving'} size={80}
          customMessage={completed ? "You already completed today's challenge!" : "Ready for a fun challenge?"} />

        {completed ? (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={styles.completedEmoji}>🏆</Text>
            <Text style={[styles.completedText, { color: colors.text }]}>
              You've completed today's challenge!
            </Text>
            <Text style={[styles.subText, { color: colors.textSecondary }]}>
              Come back tomorrow for a new one!
            </Text>
          </View>
        ) : (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoText, { color: colors.text }]}>
              🎯 8 random questions{'\n'}
              ⭐ Bonus stars for completing{'\n'}
              🏅 Work towards your Daily Champion badge!
            </Text>
          </View>
        )}

        <View style={styles.buttons}>
          {!completed && (
            <AnimatedButton title="Start! 🚀" onPress={startChallenge} color="#FF6B6B" size="large" />
          )}
          <AnimatedButton title="← Go Back" onPress={() => navigation.goBack()} color={colors.secondary} size="medium" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  bigEmoji: { fontSize: 80 },
  title: { fontSize: 28, fontWeight: 'bold', marginTop: 8, marginBottom: 8 },
  card: {
    padding: 24, borderRadius: 20, width: '100%', alignItems: 'center', marginTop: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  completedEmoji: { fontSize: 48, marginBottom: 8 },
  completedText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  subText: { fontSize: 14, textAlign: 'center', marginTop: 4 },
  infoText: { fontSize: 16, lineHeight: 28, textAlign: 'center' },
  buttons: { marginTop: 24, gap: 12, alignItems: 'center' },
});
