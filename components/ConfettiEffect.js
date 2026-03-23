import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const CONFETTI_COUNT = 30;
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#6C5CE7', '#A29BFE', '#FD79A8', '#00B894', '#FDCB6E', '#E17055', '#00CEC9'];
const SHAPES = ['●', '■', '★', '♦', '▲', '♥'];

function ConfettiPiece({ delay, color, shape }) {
  const fallAnim = useRef(new Animated.Value(-50)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const startX = Math.random() * width;

  useEffect(() => {
    const d = delay;
    Animated.parallel([
      Animated.timing(fallAnim, { toValue: height + 50, duration: 2500, delay: d, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 2500, delay: d, useNativeDriver: true }),
      Animated.loop(Animated.sequence([
        Animated.timing(swayAnim, { toValue: 30, duration: 500, useNativeDriver: true }),
        Animated.timing(swayAnim, { toValue: -30, duration: 500, useNativeDriver: true }),
      ])),
      Animated.loop(Animated.timing(rotateAnim, { toValue: 1, duration: 1000, useNativeDriver: true })),
    ]).start();
  }, []);

  const rotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.Text
      style={[styles.piece, {
        left: startX, color,
        transform: [{ translateY: fallAnim }, { translateX: swayAnim }, { rotate }],
        opacity: opacityAnim, fontSize: 14 + Math.random() * 10,
      }]}
    >
      {shape}
    </Animated.Text>
  );
}

export default function ConfettiEffect({ active }) {
  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: CONFETTI_COUNT }, (_, i) => (
        <ConfettiPiece
          key={i}
          delay={Math.random() * 800}
          color={COLORS[i % COLORS.length]}
          shape={SHAPES[i % SHAPES.length]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, zIndex: 999 },
  piece: { position: 'absolute', top: 0 },
});
