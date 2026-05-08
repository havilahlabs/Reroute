import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useHaptics } from '../hooks/useHaptics';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
  emoji?: string;
}

export function OptionChip({ label, selected, onPress, style, emoji }: Props) {
  const theme = useTheme();
  const { light } = useHaptics();

  return (
    <TouchableOpacity
      onPress={() => { light(); onPress(); }}
      activeOpacity={0.7}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.colors.primary : theme.colors.surfaceAlt,
          borderRadius: theme.radius.full,
          borderWidth: 1.5,
          borderColor: selected ? theme.colors.primary : theme.colors.border,
        },
        style,
      ]}
    >
      <Text
        style={[
          theme.typography.smallMedium,
          { color: selected ? theme.colors.white : theme.colors.textSecondary },
        ]}
      >
        {emoji ? `${emoji} ` : ''}{label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    margin: 4,
  },
});
