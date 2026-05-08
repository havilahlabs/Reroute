import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface Props {
  label: string;
  granted: boolean;
  onRequest?: () => void;
}

export function PermissionStatusCard({ label, granted, onRequest }: Props) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceAlt,
          borderRadius: theme.radius.md,
        },
      ]}
    >
      <Ionicons
        name={granted ? 'checkmark-circle' : 'alert-circle-outline'}
        size={20}
        color={granted ? theme.colors.success : theme.colors.warning}
      />
      <Text style={[theme.typography.body, { color: theme.colors.textPrimary, flex: 1 }]}>
        {label}
      </Text>
      {!granted && onRequest && (
        <TouchableOpacity onPress={onRequest}>
          <Text style={[theme.typography.smallMedium, { color: theme.colors.primary }]}>
            Enable
          </Text>
        </TouchableOpacity>
      )}
      {granted && (
        <Text style={[theme.typography.small, { color: theme.colors.success }]}>Granted</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    marginBottom: 8,
  },
});
