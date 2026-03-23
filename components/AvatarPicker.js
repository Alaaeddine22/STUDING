import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { avatars } from '../utils/theme';

export default function AvatarPicker({ selected, onSelect, theme }) {
  const colors = theme || { primary: '#FF6B6B', card: '#FFFFFF', text: '#2D3436', border: '#E8E8E8' };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Choose Your Avatar</Text>
      <View style={styles.grid}>
        {avatars.map((avatar) => (
          <TouchableOpacity
            key={avatar.id}
            style={[
              styles.avatarItem,
              {
                backgroundColor: selected === avatar.id ? colors.primary + '20' : colors.card,
                borderColor: selected === avatar.id ? colors.primary : colors.border,
              },
            ]}
            onPress={() => onSelect(avatar.id)}
          >
            <Text style={styles.emoji}>{avatar.emoji}</Text>
            <Text style={[styles.name, { color: colors.text }]}>{avatar.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 8 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  avatarItem: {
    width: 80, height: 90, borderRadius: 16, borderWidth: 2, justifyContent: 'center',
    alignItems: 'center', padding: 8,
  },
  emoji: { fontSize: 36 },
  name: { fontSize: 11, fontWeight: '600', marginTop: 4 },
});
