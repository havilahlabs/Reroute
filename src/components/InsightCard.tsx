import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Insight } from '../models';
import { useTheme } from '../hooks/useTheme';
import { Card } from './Card';

interface Props {
  insight: Insight;
  onAction?: () => void;
}

export function InsightCard({ insight, onAction }: Props) {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
        <Text style={[theme.typography.body, { color: theme.colors.textPrimary, flex: 1 }]}>
          {insight.message}
        </Text>
      </View>
      {insight.evidence && (
        <Text style={[theme.typography.small, { color: theme.colors.textSecondary, marginTop: 6 }]}>
          {insight.evidence}
        </Text>
      )}
      {insight.actionLabel && onAction && (
        <TouchableOpacity onPress={onAction} style={styles.action}>
          <Text style={[theme.typography.smallMedium, { color: theme.colors.primary }]}>
            {insight.actionLabel}
          </Text>
          <Ionicons name="arrow-forward" size={14} color={theme.colors.primary} />
        </TouchableOpacity>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 7 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12 },
});
