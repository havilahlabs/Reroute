import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Props {
  label: string;
  onPress: () => void;
  color?: string;
  style?: ViewStyle;
  size?: 'small' | 'normal';
}

export function TextButton({ label, onPress, color, style, size = 'normal' }: Props) {
  const theme = useTheme();
  const textStyle = size === 'small' ? theme.typography.small : theme.typography.body;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={[{ padding: 8 }, style]}>
      <Text style={[textStyle, { color: color ?? theme.colors.textSecondary }]}>{label}</Text>
    </TouchableOpacity>
  );
}
