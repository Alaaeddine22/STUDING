import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import ExerciseCard from '../components/ExerciseCard';
import ProgressBar from '../components/ProgressBar';
import Mascot from '../components/Mascot';
import ConfettiEffect from '../components/ConfettiEffect';
import { playSound } from '../utils/SoundManager';
import { selectExercises } from '../utils/AdaptiveDifficulty';
import { getSettings } from '../utils/StorageManager';
import { lightTheme, darkTheme } from '../utils/theme';
import allExercises from '../data/exercises.json';

export default function ExerciseScreen({ route, navigation }) {
  const { lesson, isChallenge, challengeExercises } = route.params || {};
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [mascotMood, setMascotMood] = useState('thinking');
  const [isDark, setIsDark] = useState(false);
  const colors = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    getSettings().then(s => setIsDark(s.darkMode));
    if (isChallenge && challengeExercises) {
      setExercises(challengeExercises);
    } else if (lesson) {
      const selected = selectExercises(allExercises, lesson.id, 7);
      setExercises(selected);
    }
  }, []);

  const handleAnswer = async (isCorrect) => {
    if (isCorrect) {
      setScore(s => ({ ...s, correct: s.correct + 1 }));
      setMascotMood('celebrating');
      setShowConfetti(true);
      try { await playSound('correct'); } catch {}
      setTimeout(() => setShowConfetti(false), 2500);
    } else {
      setScore(s => ({ ...s, wrong: s.wrong + 1 }));
      setMascotMood('encouraging');
      try { await playSound('wrong'); } catch {}
    }

    setTimeout(() => {
      if (currentIndex + 1 < exercises.length) {
        setCurrentIndex(i => i + 1);
        setMascotMood('thinking');
      } else {
        const finalScore = {
          correct: score.correct + (isCorrect ? 1 : 0),
          wrong: score.wrong + (isCorrect ? 0 : 1),
          total: exercises.length,
        };
        try { playSound('success'); } catch {}
        navigation.replace('Result', {
          lesson: lesson || null,
          score: finalScore,
          isChallenge: isChallenge || false,
        });
      }
    }, 1500);
  };

  if (exercises.length === 0) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading exercises...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ConfettiEffect active={showConfetti} />

      <View style={styles.topBar}>
        <Text style={[styles.questionNum, { color: colors.text }]}>
          Question {currentIndex + 1} / {exercises.length}
        </Text>
        <View style={styles.scoreRow}>
          <Text style={styles.correctCount}>✅ {score.correct}</Text>
          <Text style={styles.wrongCount}>❌ {score.wrong}</Text>
        </View>
      </View>

      <ProgressBar current={currentIndex + 1} total={exercises.length}
        color={lesson?.subject === 'arabic' ? colors.arabic : colors.math}
        showLabel={false} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Mascot mood={mascotMood} size={60} />

        <ExerciseCard
          key={exercises[currentIndex].id}
          exercise={exercises[currentIndex]}
          onAnswer={handleAnswer}
          theme={colors}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18 },
  topBar: { paddingTop: 50, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8 },
  questionNum: { fontSize: 16, fontWeight: 'bold' },
  scoreRow: { flexDirection: 'row', gap: 12 },
  correctCount: { fontSize: 16, fontWeight: '600' },
  wrongCount: { fontSize: 16, fontWeight: '600' },
  scroll: { padding: 16, paddingBottom: 40 },
});
