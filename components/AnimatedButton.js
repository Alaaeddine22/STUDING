import React from 'react';
import { TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import { playSound } from '../utils/SoundManager';

export default function AnimatedButton({ title, onPress, color = '#FF6B6B', textColor = '#FFF', style, icon, disabled = false, size = 'medium' }) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true, speed: 50 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  const handlePress = async () => {
    try { await playSound('click'); } catch {}
    if (onPress) onPress();
  };

  const sizeStyles = {
    small: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14, borderRadius: 10 },
    medium: { paddingVertical: 14, paddingHorizontal: 24, fontSize: 18, borderRadius: 14 },
    large: { paddingVertical: 18, paddingHorizontal: 32, fontSize: 22, borderRadius: 18 },
  };

  const s = sizeStyles[size];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        style={[
          styles.button,
          { backgroundColor: disabled ? '#CCC' : color, paddingVertical: s.paddingVertical, paddingHorizontal: s.paddingHorizontal, borderRadius: s.borderRadius },
          style,
        ]}
      >
        {icon && <Text style={{ fontSize: s.fontSize, marginRight: 8 }}>{icon}</Text>}
        <Text style={[styles.text, { color: textColor, fontSize: s.fontSize }]}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5,
  },
  text: { fontWeight: 'bold', textAlign: 'center' },
});
