import React from 'react';
import { Text, StyleSheet, Animated } from 'react-native';

export default function StarCounter({ count, size = 24 }) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.3, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [count]);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <Text style={[styles.star, { fontSize: size }]}>⭐</Text>
      <Text style={[styles.count, { fontSize: size * 0.7 }]}>{count}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  star: {},
  count: { fontWeight: 'bold', color: '#FFB800' },
});
