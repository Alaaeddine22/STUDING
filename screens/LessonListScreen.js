import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ProgressBar from '../components/ProgressBar';
import { getProgress, getSettings } from '../utils/StorageManager';
import { lightTheme, darkTheme } from '../utils/theme';
import mathLessons from '../data/lessons_math.json';
import arabicLessons from '../data/lessons_arabic.json';

const allLessons = { math: mathLessons, arabic: arabicLessons };
const subjectInfo = {
  math: { title: 'Mathematics', emoji: '🔢', color: '#6C5CE7' },
  arabic: { title: 'العربية', emoji: '📝', color: '#00CEC9' },
};

const categoryNames = {
  numbers: '🔢 Numbers', addition: '➕ Addition', subtraction: '➖ Subtraction',
  multiplication: '✖️ Multiplication', division: '➗ Division', fractions: '🍕 Fractions',
  decimals: '🔣 Decimals', geometry: '📐 Geometry', time: '⏰ Time', money: '💰 Money',
  word_problems: '📖 Word Problems', patterns: '🔮 Patterns',
  alphabet: '🔤 الحروف', words: '📝 الكلمات', sentences: '💬 الجمل',
  grammar: '📏 القواعد', reading: '📖 القراءة', writing: '✍️ الكتابة',
};

export default function LessonListScreen({ route, navigation }) {
  const { subject } = route.params;
  const [progress, setProgress] = useState({ completedLessons: [], lessonScores: {} });
  const [isDark, setIsDark] = useState(false);
  const colors = isDark ? darkTheme : lightTheme;
  const info = subjectInfo[subject];
  const lessons = allLessons[subject] || [];

  useFocusEffect(useCallback(() => {
    (async () => {
      const [pr, s] = await Promise.all([getProgress(), getSettings()]);
      setProgress(pr);
      setIsDark(s.darkMode);
    })();
  }, []));

  // Group lessons by category
  const categories = {};
  lessons.forEach(l => {
    if (!categories[l.category]) categories[l.category] = [];
    categories[l.category].push(l);
  });

  const isLessonUnlocked = (lesson) => {
    const idx = lessons.findIndex(l => l.id === lesson.id);
    if (idx === 0) return true;
    return progress.completedLessons.includes(lessons[idx - 1]?.id);
  };

  const getLessonStars = (lessonId) => {
    const score = progress.lessonScores[lessonId];
    if (!score) return 0;
    const ratio = score.correct / score.total;
    if (ratio >= 0.9) return 3;
    if (ratio >= 0.7) return 2;
    if (ratio >= 0.5) return 1;
    return 0;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: info.color }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerEmoji}>{info.emoji}</Text>
        <Text style={styles.headerTitle}>{info.title}</Text>
        <Text style={styles.headerSub}>
          {progress.completedLessons.filter(id => lessons.some(l => l.id === id)).length} / {lessons.length} completed
        </Text>
        <ProgressBar
          current={progress.completedLessons.filter(id => lessons.some(l => l.id === id)).length}
          total={lessons.length}
          color="#FFF"
          height={8}
          showLabel={false}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {Object.entries(categories).map(([cat, catLessons]) => (
          <View key={cat} style={styles.categoryGroup}>
            <Text style={[styles.categoryTitle, { color: colors.text }]}>
              {categoryNames[cat] || cat}
            </Text>
            {catLessons.map((lesson) => {
              const unlocked = isLessonUnlocked(lesson);
              const completed = progress.completedLessons.includes(lesson.id);
              const stars = getLessonStars(lesson.id);

              return (
                <TouchableOpacity
                  key={lesson.id}
                  style={[
                    styles.lessonCard,
                    {
                      backgroundColor: completed ? info.color + '15' : colors.card,
                      borderColor: completed ? info.color : colors.border,
                      opacity: unlocked ? 1 : 0.5,
                    },
                  ]}
                  onPress={() => unlocked && navigation.navigate('Lesson', { lesson })}
                  disabled={!unlocked}
                  activeOpacity={0.7}
                >
                  <View style={[styles.lessonIcon, { backgroundColor: unlocked ? info.color + '20' : '#E0E0E0' }]}>
                    <Text style={styles.lessonEmoji}>
                      {completed ? '✅' : unlocked ? '📖' : '🔒'}
                    </Text>
                  </View>
                  <View style={styles.lessonInfo}>
                    <Text style={[styles.lessonTitle, { color: colors.text }]}>{lesson.title}</Text>
                    <Text style={[styles.lessonLevel, { color: colors.textSecondary }]}>Level {lesson.level}</Text>
                  </View>
                  {completed && (
                    <Text style={styles.stars}>{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backBtn: { marginBottom: 8 },
  backText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  headerEmoji: { fontSize: 40, textAlign: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginVertical: 8 },
  scroll: { padding: 16, paddingBottom: 40 },
  categoryGroup: { marginBottom: 20 },
  categoryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, marginLeft: 4 },
  lessonCard: {
    flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16,
    marginBottom: 8, borderWidth: 1.5, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  lessonIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  lessonEmoji: { fontSize: 22 },
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: 15, fontWeight: '600' },
  lessonLevel: { fontSize: 12, marginTop: 2 },
  stars: { fontSize: 14 },
});
