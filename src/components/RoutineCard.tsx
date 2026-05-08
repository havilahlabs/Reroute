import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Routine } from '../models';
import { useTheme } from '../hooks/useTheme';
import { formatDuration } from '../utils/formatTime';

const MODE_EMOJI: Record<string, string> = {
  study: '📚',
  work: '💼',
  bedtime: '🌙',
  writing: '✍️',
  custom: '⚡',
};

interface Props {
  routine: Routine;
  onPress: () => void;
  onStart?: () => void;
}

export function RoutineCard({ routine, onPress, onStart }: Props) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          borderColor: theme.colors.border,
          borderWidth: 1,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.emoji}>{MODE_EMOJI[routine.mode] ?? '⚡'}</Text>
        <View style={styles.info}>
          <Text style={[theme.typography.bodyMedium, { color: theme.colors.textPrimary }]}>
            {routine.name}
          </Text>
          <Text style={[theme.typography.small, { color: theme.colors.textSecondary }]}>
            {formatDuration(routine.defaultDurationMinutes)} · {routine.strictness}
          </Text>
        </View>
        {onStart && (
          <TouchableOpacity onPress={onStart} style={[styles.startBtn, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="play" size={14} color={theme.colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, marginBottom: 10 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emoji: { fontSize: 24 },
  info: { flex: 1 },
  startBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
