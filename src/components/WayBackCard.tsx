import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { fonts } from '../theme';

interface WayBackCardProps {
  text: string;
}

export function WayBackCard({ text }: WayBackCardProps) {
  const theme = useTheme();
  return (
    <View style={[styles.card, {
      backgroundColor: theme.isDark ? 'rgba(244,236,223,0.06)' : 'rgba(244,236,223,0.5)',
      borderColor: theme.isDark ? 'rgba(244,236,223,0.14)' : 'rgba(201,165,126,0.3)',
    }]}>
      <Text style={[styles.label, { color: theme.colors.cream }]}>Your way back</Text>
      <Text style={[styles.text, { color: theme.colors.cream }]}>"{text}"</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    maxWidth: 300,
    width: '100%',
  },
  label: {
    fontFamily: fonts.dmSansMedium,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 6,
    opacity: 0.8,
  },
  text: {
    fontFamily: fonts.nunitoMedium,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
