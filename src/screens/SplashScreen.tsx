import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../theme';
import { IconLogo } from '../components/icons';

export function SplashScreen() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  const opacity = useRef(new Animated.Value(0)).current;
  const scale1 = useRef(new Animated.Value(0.85)).current;
  const scale2 = useRef(new Animated.Value(0.85)).current;
  const scale3 = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    const breathe = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1.12, duration: 2600, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.85, duration: 2600, useNativeDriver: true }),
        ])
      );

    Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }).start();
    const a1 = breathe(scale1, 0);
    const a2 = breathe(scale2, 300);
    const a3 = breathe(scale3, 600);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, []);

  const aurora = theme.isDark ? 'rgba(124,111,205,0.13)' : 'rgba(124,111,205,0.08)';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View style={[styles.ring, { width: 360, height: 360, borderRadius: 180, backgroundColor: aurora, transform: [{ scale: scale3 }] }]} />
      <Animated.View style={[styles.ring, { width: 256, height: 256, borderRadius: 128, backgroundColor: aurora, transform: [{ scale: scale2 }] }]} />
      <Animated.View style={[styles.ring, { width: 152, height: 152, borderRadius: 76, backgroundColor: aurora, transform: [{ scale: scale1 }] }]} />

      <Animated.View style={[styles.content, { opacity }]}>
        <View style={[styles.logoWrap, { backgroundColor: theme.isDark ? 'rgba(124,111,205,0.2)' : 'rgba(124,111,205,0.1)' }]}>
          <IconLogo size={38} color={theme.colors.primary} />
        </View>
        <Text style={[styles.name, { color: theme.colors.primary }]}>Reroute</Text>
        <Text style={[styles.tagline, { color: theme.colors.textTertiary }]}>Find your way back to focus.</Text>
        <View style={styles.dots}>
          {[0, 1, 2].map(i => <BounceDot key={i} delay={i * 180} color={theme.colors.primaryLight} />)}
        </View>
      </Animated.View>
    </View>
  );
}

function BounceDot({ delay, color }: { delay: number; color: string }) {
  const anim = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 450, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[styles.dot, { backgroundColor: color, opacity: anim }]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute' },
  content: { alignItems: 'center', gap: 10 },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  name: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 32,
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
  },
  dots: { flexDirection: 'row', gap: 6, marginTop: 28 },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
});
