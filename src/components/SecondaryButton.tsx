import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useHaptics } from '../hooks/useHaptics';
import { fonts } from '../theme';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function SecondaryButton({ label, onPress, disabled, style, icon }: Props) {
  const theme = useTheme();
  const { light } = useHaptics();

  return (
    <TouchableOpacity
      onPress={() => { light(); onPress(); }}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          borderRadius: theme.radius.xl,
          borderColor: theme.isDark ? theme.colors.border : theme.colors.border,
          borderWidth: 1,
          backgroundColor: theme.colors.surfaceAlt,
        },
        style,
      ]}
    >
      <View style={styles.inner}>
        {icon}
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: fonts.nunitoSemiBold,
    fontSize: 16,
  },
});
