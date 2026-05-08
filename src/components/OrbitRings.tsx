import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface OrbitRingsProps {
  emoji: string;
  size?: number;
}

export function OrbitRings({ emoji, size = 200 }: OrbitRingsProps) {
  const theme = useTheme();
  const scale1 = useRef(new Animated.Value(1)).current;
  const scale2 = useRef(new Animated.Value(1)).current;
  const scale3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const breathe = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1.08, duration: 2400, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 1, duration: 2400, useNativeDriver: true }),
        ])
      );
    const a1 = breathe(scale1, 0);
    const a2 = breathe(scale2, 300);
    const a3 = breathe(scale3, 600);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, []);

  const orbitColor = theme.isDark
    ? 'rgba(124,111,205,0.12)'
    : 'rgba(124,111,205,0.08)';
  const orbitBorder = theme.isDark
    ? 'rgba(169,159,224,0.18)'
    : 'rgba(124,111,205,0.14)';

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View style={[
        styles.orbit,
        { width: size, height: size, borderRadius: size / 2, borderColor: orbitBorder, backgroundColor: orbitColor, transform: [{ scale: scale3 }] },
      ]} />
      <Animated.View style={[
        styles.orbit,
        { width: size * 0.72, height: size * 0.72, borderRadius: size * 0.36, borderColor: orbitBorder, backgroundColor: orbitColor, transform: [{ scale: scale2 }] },
      ]} />
      <Animated.View style={[
        styles.orbit,
        { width: size * 0.46, height: size * 0.46, borderRadius: size * 0.23, borderColor: orbitBorder, backgroundColor: orbitColor, transform: [{ scale: scale1 }] },
      ]} />
      <Text style={styles.emoji}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbit: {
    position: 'absolute',
    borderWidth: 1,
  },
  emoji: {
    fontSize: 52,
  },
});
