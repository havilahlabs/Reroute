import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts } from '../theme';

const DISTRACTION_ID_MAP: Record<string, string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  youtube: 'YouTube',
  twitter: 'X',
  safari: 'Safari',
  messages: 'Messages',
  email: 'Email',
  reddit: 'Reddit',
  games: 'Games',
  other: 'Other',
};

export function distractionName(id: string): string {
  return DISTRACTION_ID_MAP[id] ?? (id.charAt(0).toUpperCase() + id.slice(1));
}

export const APPS: Record<string, string> = {
  TikTok: '#0F0F1A',
  Instagram: '#C13584',
  YouTube: '#FF0000',
  X: '#222222',
  Safari: '#1E88E5',
  Messages: '#34C759',
  Email: '#5D52A8',
  Reddit: '#FF4500',
  Games: '#7C6FCD',
  Other: '#6B6880',
};

interface AppGlyphProps {
  name: string;
  color?: string;
  size?: number;
}

export function AppGlyph({ name, color, size = 36 }: AppGlyphProps) {
  const bg = color ?? APPS[name] ?? APPS.Other;
  const borderRadius = size * 0.28;
  return (
    <View style={[styles.glyph, { width: size, height: size, borderRadius, backgroundColor: bg }]}>
      <Text style={[styles.letter, { fontSize: size * 0.44 }]}>{name[0]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  glyph: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontFamily: fonts.nunitoBold,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
});
