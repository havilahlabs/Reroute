import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Stat {
  label: string;
  value: string | number;
}

interface Props {
  stats: Stat[];
}

export function ProgressSummary({ stats }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {stats.map((stat, i) => (
        <View key={i} style={styles.stat}>
          <Text style={[theme.typography.h2, { color: theme.colors.primary }]}>
            {stat.value}
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, textAlign: 'center' }]}>
            {stat.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
});
