import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Props {
  plan: string;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export function ReroutePlanCard({ plan, label = 'Your way back', style }: Props) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        style,
        {
          backgroundColor: theme.colors.surfaceAlt,
          borderRadius: theme.radius.md,
          borderLeftWidth: 3,
          borderLeftColor: theme.colors.primary,
        },
      ]}
    >
      <Text style={[theme.typography.caption, { color: theme.colors.textTertiary, marginBottom: 4 }]}>
        {label}
      </Text>
      <Text style={[theme.typography.bodyMedium, { color: theme.colors.textPrimary }]}>
        {plan}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 14 },
});
