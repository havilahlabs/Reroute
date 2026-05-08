import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FocusSession } from '../models';
import { useTheme } from '../hooks/useTheme';
import { Card } from './Card';
import { formatDuration, formatDate } from '../utils/formatTime';

interface Props {
  session: FocusSession;
}

export function SessionSummary({ session }: Props) {
  const theme = useTheme();

  const rows = [
    { label: 'Focus time', value: formatDuration(session.completedFocusMinutes) },
    { label: 'Times rerouted', value: String(session.rerouteCount) },
    { label: 'Unlocks', value: String(session.unlockCount) },
    { label: 'Drift events', value: String(session.driftCount) },
  ];

  return (
    <Card>
      <Text style={[theme.typography.h3, { color: theme.colors.textPrimary, marginBottom: 4 }]}>
        {session.task}
      </Text>
      <Text style={[theme.typography.caption, { color: theme.colors.textTertiary, marginBottom: 16 }]}>
        {formatDate(session.startedAt)}
      </Text>
      {rows.map(row => (
        <View key={row.label} style={styles.row}>
          <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
            {row.label}
          </Text>
          <Text style={[theme.typography.bodyMedium, { color: theme.colors.textPrimary }]}>
            {row.value}
          </Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
});
