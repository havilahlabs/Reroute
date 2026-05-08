import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevated?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  variant?: 'default' | 'lavender' | 'cream' | 'success';
}

export function Card({ children, style, elevated = false, padding = 'md', variant = 'default' }: Props) {
  const theme = useTheme();
  const paddingMap = { sm: 12, md: 18, lg: 22, none: 0 };

  const variantStyles: Record<string, ViewStyle> = {
    default: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    lavender: {
      backgroundColor: theme.isDark ? 'rgba(124,111,205,0.1)' : 'rgba(124,111,205,0.06)',
      borderColor: 'rgba(169,159,224,0.3)',
    },
    cream: {
      backgroundColor: theme.isDark ? 'rgba(244,236,223,0.06)' : 'rgba(244,236,223,0.5)',
      borderColor: theme.isDark ? 'rgba(244,236,223,0.18)' : 'rgba(201,165,126,0.25)',
    },
    success: {
      backgroundColor: 'rgba(125,211,166,0.08)',
      borderColor: 'rgba(125,211,166,0.2)',
    },
  };

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: theme.radius.xl,
          padding: paddingMap[padding],
          borderWidth: 1,
        },
        variantStyles[variant],
        elevated && theme.shadows.md,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
