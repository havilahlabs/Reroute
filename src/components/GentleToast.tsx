import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Props {
  message: string;
  visible: boolean;
  duration?: number;
  onHide?: () => void;
}

export function GentleToast({ message, visible, duration = 2500, onHide }: Props) {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(duration),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => onHide?.());
    }
  }, [visible, duration, opacity, onHide]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: theme.colors.textPrimary,
          borderRadius: theme.radius.full,
          opacity,
        },
      ]}
    >
      <Text style={[theme.typography.smallMedium, { color: theme.colors.white }]}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 999,
  },
});
