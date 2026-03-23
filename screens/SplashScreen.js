import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, StatusBar } from 'react-native';

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 20, friction: 5, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <Text style={styles.mascot}>🎓</Text>
      </Animated.View>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <Text style={styles.title}>Happy Learning</Text>
        <Text style={styles.subtitle}>Kids</Text>
        <Text style={styles.tagline}>Learn • Play • Grow 🌟</Text>
      </Animated.View>
      <Animated.View style={[styles.dots, { opacity: fadeAnim }]}>
        {['📚', '🔢', '📝', '🎯'].map((e, i) => (
          <Text key={i} style={styles.dot}>{e}</Text>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#667EEA',
  },
  mascot: { fontSize: 100, textAlign: 'center', marginBottom: 20 },
  title: { fontSize: 42, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  subtitle: { fontSize: 48, fontWeight: '900', color: '#FFE66D', textAlign: 'center', marginTop: -5 },
  tagline: { fontSize: 18, color: '#FFF', textAlign: 'center', marginTop: 12, opacity: 0.9 },
  dots: { flexDirection: 'row', marginTop: 40, gap: 16 },
  dot: { fontSize: 28 },
});
