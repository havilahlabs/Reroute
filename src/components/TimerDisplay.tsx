import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { formatCountdown } from '../utils/formatTime';

interface Props {
  secondsLeft: number;
  size?: 'large' | 'small';
  dimmed?: boolean;
}

export function TimerDisplay({ secondsLeft, size = 'large', dimmed = false }: Props) {
  const theme = useTheme();
  const style = size === 'large' ? theme.typography.timer : theme.typography.timerSmall;

  return (
    <View style={styles.container}>
      <Text
        style={[
          style,
          { color: dimmed ? theme.colors.textTertiary : theme.colors.textPrimary },
        ]}
      >
        {formatCountdown(secondsLeft)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
