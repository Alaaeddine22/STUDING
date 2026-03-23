import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const mascotEmojis = {
  happy: '😄',
  celebrating: '🥳',
  encouraging: '😊',
  thinking: '🤔',
  sad: '😢',
  love: '🥰',
  waving: '👋',
  star: '🌟',
};

const mascotMessages = {
  happy: ['Great job!', 'Awesome!', 'You rock!', 'Amazing!', 'Fantastic!'],
  celebrating: ['PERFECT! 🎉', 'You did it!', 'Incredible!', 'Champion!'],
  encouraging: ['Try again!', 'You can do it!', 'Almost there!', 'Keep going!', "Don't give up!"],
  thinking: ['Hmm, think carefully...', 'Take your time!', 'You got this!'],
  waving: ['Hello friend!', 'Ready to learn?', "Let's go!"],
};

export default function Mascot({ mood = 'waving', size = 80, showMessage = true, customMessage = null }) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.15, duration: 500, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    );
    bounce.start();
    return () => bounce.stop();
  }, [mood]);

  const emoji = mascotEmojis[mood] || mascotEmojis.waving;
  const messages = mascotMessages[mood] || mascotMessages.waving;
  const message = customMessage || messages[Math.floor(Math.random() * messages.length)];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.mascotCircle, { width: size, height: size, borderRadius: size / 2, transform: [{ scale: scaleAnim }] }]}>
        <Text style={[styles.emoji, { fontSize: size * 0.55 }]}>{emoji}</Text>
      </Animated.View>
      {showMessage && (
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{message}</Text>
          <View style={styles.bubbleTail} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 8 },
  mascotCircle: {
    backgroundColor: '#FFE66D', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5,
  },
  emoji: { textAlign: 'center' },
  bubble: {
    backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8,
    marginTop: 8, maxWidth: 200, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 3, position: 'relative',
  },
  bubbleText: { fontSize: 14, fontWeight: '600', color: '#2D3436', textAlign: 'center' },
  bubbleTail: {
    position: 'absolute', top: -6, alignSelf: 'center', width: 0, height: 0,
    borderLeftWidth: 6, borderRightWidth: 6, borderBottomWidth: 6,
    borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#FFFFFF',
  },
});
