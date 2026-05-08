import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Props {
  name: string;
  emoji?: string;
  size?: number;
}

const APP_EMOJIS: Record<string, string> = {
  tiktok: '🎵',
  instagram: '📸',
  youtube: '▶️',
  twitter: '🐦',
  safari: '🌐',
  messages: '💬',
  email: '📧',
  reddit: '🤖',
  games: '🎮',
  other: '📱',
};

export function AppIconBadge({ name, emoji, size = 40 }: Props) {
  const theme = useTheme();
  const icon = emoji ?? APP_EMOJIS[name.toLowerCase()] ?? '📱';

  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size * 0.22,
          backgroundColor: theme.colors.surfaceAlt,
        },
      ]}
    >
      <Text style={{ fontSize: size * 0.55 }}>{icon}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
