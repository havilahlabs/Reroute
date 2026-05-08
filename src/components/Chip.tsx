import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { fonts } from '../theme';

interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  dashed?: boolean;
}

export function Chip({ label, active, onPress, style, dashed }: ChipProps) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.chip,
        {
          backgroundColor: active
            ? theme.isDark ? 'rgba(124,111,205,0.22)' : 'rgba(124,111,205,0.12)'
            : theme.colors.surfaceAlt,
          borderColor: active ? theme.colors.primaryLight : theme.colors.border,
          borderStyle: dashed ? 'dashed' : 'solid',
        },
        style,
      ]}
    >
      <Text style={[styles.label, { color: active ? theme.colors.primaryLight : theme.colors.textSecondary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function PillTag({ label, variant = 'default' }: { label: string; variant?: 'default' | 'lavender' | 'cream' | 'success' | 'warning' }) {
  const theme = useTheme();
  const configs = {
    default: { bg: theme.colors.surfaceAlt, color: theme.colors.textSecondary },
    lavender: { bg: theme.isDark ? 'rgba(124,111,205,0.22)' : 'rgba(124,111,205,0.12)', color: theme.colors.primaryLight },
    cream: { bg: theme.isDark ? 'rgba(244,236,223,0.12)' : 'rgba(201,165,126,0.2)', color: theme.colors.warm },
    success: { bg: 'rgba(125,211,166,0.16)', color: theme.colors.success },
    warning: { bg: 'rgba(244,162,97,0.12)', color: theme.colors.warning },
  };
  const cfg = configs[variant];
  return (
    <Text style={[styles.pill, { backgroundColor: cfg.bg, color: cfg.color }]}>{label}</Text>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: {
    fontFamily: fonts.dmSansMedium,
    fontSize: 13,
  },
  pill: {
    fontFamily: fonts.dmSansMedium,
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
});
