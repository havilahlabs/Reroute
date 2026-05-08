import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useHaptics } from '../hooks/useHaptics';
import { fonts } from '../theme';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'destructive' | 'ghost';
  icon?: React.ReactNode;
}

export function PrimaryButton({ label, onPress, disabled, loading, style, textStyle, variant = 'primary', icon }: Props) {
  const theme = useTheme();
  const { light } = useHaptics();

  const handlePress = () => {
    light();
    onPress();
  };

  const bgMap = {
    primary: disabled ? theme.colors.border : theme.colors.primary,
    destructive: theme.colors.danger,
    ghost: 'transparent',
  };

  const colorMap = {
    primary: theme.colors.white,
    destructive: theme.colors.white,
    ghost: theme.colors.textSecondary,
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.button, { backgroundColor: bgMap[variant], borderRadius: theme.radius.xl }, style]}
    >
      {loading ? (
        <ActivityIndicator color={colorMap[variant]} />
      ) : (
        <View style={styles.inner}>
          {icon}
          <Text style={[styles.label, { color: colorMap[variant] }, textStyle]}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
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
    fontFamily: fonts.nunitoBold,
    fontSize: 16,
    textAlign: 'center',
  },
});
