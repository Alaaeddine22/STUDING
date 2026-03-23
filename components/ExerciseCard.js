import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Animated, StyleSheet } from 'react-native';

export default function ExerciseCard({ exercise, onAnswer, disabled = false, theme }) {
  const shakeAnim = React.useRef(new Animated.Value(0)).current;
  const [selectedAnswer, setSelectedAnswer] = React.useState(null);
  const [fillAnswer, setFillAnswer] = React.useState('');
  const [showResult, setShowResult] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);

  const colors = theme || {
    card: '#FFFFFF', text: '#2D3436', textSecondary: '#636E72',
    success: '#00B894', error: '#FF7675', primary: '#FF6B6B', border: '#E8E8E8',
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleSelect = (answer) => {
    if (disabled || showResult) return;
    setSelectedAnswer(answer);
    const correct = answer === exercise.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    if (!correct) shake();
    setTimeout(() => onAnswer(correct, answer), 1200);
  };

  const handleFillSubmit = () => {
    if (disabled || showResult || !fillAnswer.trim()) return;
    const correct = fillAnswer.trim().toLowerCase() === exercise.correctAnswer.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);
    if (!correct) shake();
    setTimeout(() => onAnswer(correct, fillAnswer.trim()), 1200);
  };

  const getOptionStyle = (option) => {
    if (!showResult) {
      return selectedAnswer === option
        ? [styles.option, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]
        : [styles.option, { borderColor: colors.border }];
    }
    if (option === exercise.correctAnswer) return [styles.option, { backgroundColor: '#00B89420', borderColor: '#00B894' }];
    if (option === selectedAnswer && !isCorrect) return [styles.option, { backgroundColor: '#FF767520', borderColor: '#FF7675' }];
    return [styles.option, { borderColor: colors.border }];
  };

  return (
    <Animated.View style={[styles.card, { backgroundColor: colors.card, transform: [{ translateX: shakeAnim }] }]}>
      <Text style={[styles.question, { color: colors.text }]}>{exercise.question}</Text>

      {exercise.type === 'multiple_choice' && (
        <View style={styles.options}>
          {exercise.options.map((opt, i) => (
            <TouchableOpacity key={i} style={getOptionStyle(opt)} onPress={() => handleSelect(opt)} disabled={disabled || showResult}>
              <Text style={[styles.optionLetter, { color: colors.primary }]}>{String.fromCharCode(65 + i)}</Text>
              <Text style={[styles.optionText, { color: colors.text }]}>{opt}</Text>
              {showResult && opt === exercise.correctAnswer && <Text style={styles.checkmark}>✓</Text>}
              {showResult && opt === selectedAnswer && !isCorrect && <Text style={styles.crossmark}>✗</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {exercise.type === 'fill_blank' && (
        <View style={styles.fillContainer}>
          <TextInput
            style={[styles.input, {
              borderColor: showResult ? (isCorrect ? '#00B894' : '#FF7675') : colors.border,
              color: colors.text,
            }]}
            placeholder="Type your answer..."
            placeholderTextColor={colors.textSecondary}
            value={fillAnswer}
            onChangeText={setFillAnswer}
            onSubmitEditing={handleFillSubmit}
            editable={!disabled && !showResult}
          />
          {!showResult && (
            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.primary }]} onPress={handleFillSubmit}>
              <Text style={styles.submitText}>Check ✓</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {showResult && (
        <View style={[styles.feedback, { backgroundColor: isCorrect ? '#00B89415' : '#FF767515' }]}>
          <Text style={[styles.feedbackText, { color: isCorrect ? '#00B894' : '#FF7675' }]}>
            {isCorrect ? exercise.feedbackCorrect : exercise.feedbackWrong}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20, padding: 20, marginVertical: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
  },
  question: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', lineHeight: 28 },
  options: { gap: 10 },
  option: {
    flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14,
    borderWidth: 2, gap: 12,
  },
  optionLetter: { fontSize: 16, fontWeight: 'bold', width: 28, height: 28, borderRadius: 14, backgroundColor: '#F0F0F0', textAlign: 'center', lineHeight: 28 },
  optionText: { fontSize: 16, flex: 1, fontWeight: '500' },
  checkmark: { fontSize: 20, color: '#00B894', fontWeight: 'bold' },
  crossmark: { fontSize: 20, color: '#FF7675', fontWeight: 'bold' },
  fillContainer: { gap: 12 },
  input: { borderWidth: 2, borderRadius: 14, padding: 16, fontSize: 18, fontWeight: '500', textAlign: 'center' },
  submitBtn: { padding: 14, borderRadius: 14, alignItems: 'center' },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  feedback: { marginTop: 16, padding: 12, borderRadius: 12 },
  feedbackText: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
});
