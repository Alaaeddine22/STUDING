import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import Mascot from '../components/Mascot';
import AnimatedButton from '../components/AnimatedButton';
import { getSettings } from '../utils/StorageManager';
import { lightTheme, darkTheme } from '../utils/theme';

export default function LessonScreen({ route, navigation }) {
  const { lesson } = route.params;
  const [isDark, setIsDark] = useState(false);
  const colors = isDark ? darkTheme : lightTheme;
  const isMath = lesson.subject === 'math';

  useEffect(() => { getSettings().then(s => setIsDark(s.darkMode)); }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { backgroundColor: isMath ? colors.math : colors.arabic }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{lesson.title}</Text>
        <Text style={styles.levelBadge}>Level {lesson.level}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Mascot mood="thinking" customMessage="Let's learn something new!" size={70} />

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📖 Explanation</Text>
          <Text style={[styles.explanation, { color: colors.text }]}>{lesson.explanation}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>💡 Examples</Text>
          {lesson.examples.map((ex, i) => (
            <View key={i} style={[styles.exampleRow, { backgroundColor: (isMath ? colors.math : colors.arabic) + '10' }]}>
              <Text style={[styles.exampleBullet, { color: isMath ? colors.math : colors.arabic }]}>•</Text>
              <Text style={[styles.exampleText, { color: colors.text }]}>{ex}</Text>
            </View>
          ))}
        </View>

        {lesson.funTip && (
          <View style={[styles.tipCard, { backgroundColor: '#FFE66D20' }]}>
            <Text style={styles.tipEmoji}>💡</Text>
            <Text style={[styles.tipText, { color: colors.text }]}>{lesson.funTip}</Text>
          </View>
        )}

        <AnimatedButton
          title="Start Exercises! 🚀"
          onPress={() => navigation.navigate('Exercise', { lesson })}
          color={isMath ? colors.math : colors.arabic}
          size="large"
          style={styles.startBtn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backBtn: { marginBottom: 8 },
  backText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  levelBadge: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 4 },
  scroll: { padding: 16, paddingBottom: 40 },
  card: {
    padding: 20, borderRadius: 20, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  explanation: { fontSize: 16, lineHeight: 26 },
  exampleRow: { flexDirection: 'row', alignItems: 'flex-start', padding: 12, borderRadius: 12, marginBottom: 6, gap: 8 },
  exampleBullet: { fontSize: 18, fontWeight: 'bold', marginTop: 1 },
  exampleText: { fontSize: 15, flex: 1, lineHeight: 22 },
  tipCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 12, gap: 10 },
  tipEmoji: { fontSize: 24 },
  tipText: { fontSize: 14, flex: 1, fontStyle: 'italic', lineHeight: 20 },
  startBtn: { marginTop: 8 },
});
