import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, TextInput, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useUserStore } from '../../store/useUserStore';
import { PrimaryButton } from '../../components/PrimaryButton';
import { OrbitRings } from '../../components/OrbitRings';
import { AnalyticsService } from '../../services/AnalyticsService';
import { fonts } from '../../theme';

const { width } = Dimensions.get('window');

interface Slide {
  key: string;
  headline: string;
  subtext: string;
  emoji: string;
}

const SLIDES: Slide[] = [
  { key: '1', emoji: '🎯', headline: 'Start with one thing.', subtext: 'Choose what you want to protect your attention for.' },
  { key: '2', emoji: '🔄', headline: 'When you drift, Reroute helps you get back.', subtext: "A gentle nudge back to what you meant to do — before you disappear into distractions." },
  { key: '3', emoji: '🌿', headline: 'No guilt. No streak pressure.', subtext: "You don't need perfect focus. You just need a way back." },
  { key: '4', emoji: '🔒', headline: 'Your focus data is private.', subtext: "Reroute stores your history locally by default. You're in control." },
  { key: '5', emoji: '✨', headline: 'Ready?', subtext: 'Set your first focus session — small steps count.' },
];

export function OnboardingScreen() {
  const theme = useTheme();
  const { setOnboardingComplete, updateUser } = useUserStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [firstName, setFirstName] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const next = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrentIndex(next);
    }
  };

  const handleFinish = async () => {
    const trimmed = firstName.trim();
    if (trimmed) await updateUser({ firstName: trimmed });
    await setOnboardingComplete();
    await AnalyticsService.track('onboarding_completed');
  };

  const renderSlide: ListRenderItem<Slide> = ({ item }) => {
    const isLast = item.key === '5';
    return (
      <View style={[styles.slide, { width }]}>
        <OrbitRings emoji={item.emoji} size={200} />
        <View style={styles.textBlock}>
          <Text style={[styles.headline, { color: theme.colors.textPrimary }]}>{item.headline}</Text>
          <Text style={[styles.subtext, { color: theme.colors.textSecondary }]}>{item.subtext}</Text>
          {isLast && (
            <>
              <TextInput
                style={[styles.nameInput, {
                  backgroundColor: theme.colors.surface,
                  borderColor: firstName.trim() ? theme.colors.primaryLight : theme.colors.border,
                  color: theme.colors.textPrimary,
                }]}
                placeholder="Your first name (optional)"
                placeholderTextColor={theme.colors.textTertiary}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                returnKeyType="done"
              />
              <PrimaryButton
                label="Start my first focus session"
                onPress={handleFinish}
                style={{ marginTop: 8, width: '100%' }}
              />
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={[styles.counter, { color: theme.colors.textTertiary }]}>
          {currentIndex + 1} of {SLIDES.length}
        </Text>
        {currentIndex < SLIDES.length - 1 ? (
          <TouchableOpacity onPress={handleFinish}>
            <Text style={[styles.skip, { color: theme.colors.textSecondary }]}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={item => item.key}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === currentIndex ? theme.colors.primary : theme.colors.border,
                  width: i === currentIndex ? 20 : 8,
                },
              ]}
            />
          ))}
        </View>
        {currentIndex < SLIDES.length - 1 && (
          <PrimaryButton label="Next" onPress={goNext} style={{ minWidth: 140 }} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },
  counter: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 14,
  },
  skip: {
    fontFamily: fonts.dmSansMedium,
    fontSize: 14,
    width: 40,
    textAlign: 'right',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
  textBlock: {
    alignItems: 'center',
    maxWidth: 320,
    gap: 12,
  },
  headline: {
    fontFamily: fonts.nunitoBold,
    fontSize: 26,
    lineHeight: 34,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtext: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 36,
    alignItems: 'center',
    gap: 20,
  },
  dots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { height: 8, borderRadius: 4 },
  nameInput: {
    width: '100%',
    height: 52,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontFamily: fonts.dmSansRegular,
    fontSize: 16,
    marginTop: 16,
  },
});
