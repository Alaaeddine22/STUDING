import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function ProgressBar({ current, total, color = '#4ECDC4', height = 16, showLabel = true }) {
  const widthAnim = React.useRef(new Animated.Value(0)).current;
  const progress = total > 0 ? current / total : 0;

  React.useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const width = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.track, { height }]}>
        <Animated.View style={[styles.fill, { width, backgroundColor: color, height }]} />
      </View>
      {showLabel && (
        <Text style={styles.label}>{current}/{total}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 4 },
  track: { backgroundColor: '#E8E8E8', borderRadius: 50, overflow: 'hidden' },
  fill: { borderRadius: 50 },
  label: { fontSize: 12, color: '#636E72', textAlign: 'center', marginTop: 4, fontWeight: '600' },
});
