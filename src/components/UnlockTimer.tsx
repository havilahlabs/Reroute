import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { TimerDisplay } from './TimerDisplay';

interface Props {
  secondsLeft: number;
  reason?: string;
}

export function UnlockTimer({ secondsLeft, reason }: Props) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radius.lg }]}>
      <Text style={[theme.typography.caption, { color: theme.colors.textTertiary, marginBottom: 8 }]}>
        Unlock time remaining
      </Text>
      <TimerDisplay secondsLeft={secondsLeft} size="small" />
      {reason && (
        <Text style={[theme.typography.small, { color: theme.colors.textSecondary, marginTop: 8 }]}>
          Reason: {reason}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
});
