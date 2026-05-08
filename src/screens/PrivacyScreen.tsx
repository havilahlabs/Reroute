import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { fonts } from '../theme';

const SECTIONS = [
  {
    emoji: '📦',
    title: 'What we store',
    content: 'Focus sessions, drift events, reroute actions, routines, and app settings. Task text stays on your device and is never transmitted.',
  },
  {
    emoji: '🎯',
    title: 'Why we use it',
    content: 'To help you understand your focus patterns and improve sessions over time. Never for advertising.',
  },
  {
    emoji: '🔒',
    title: 'Local by default',
    content: 'All data is stored locally on this device. Optional cloud sync may be added in a future version — you will always choose.',
  },
  {
    emoji: '☁️',
    title: 'If you enable sync',
    content: 'Session summaries and routines would sync to your account. Task text would remain on-device unless you explicitly export it.',
  },
  {
    emoji: '🚫',
    title: 'No ads. No selling data.',
    content: 'Reroute is funded by subscriptions. We do not show ads or sell your data to anyone.',
  },
  {
    emoji: '🗑️',
    title: 'Delete your data',
    content: 'You can delete all local data at any time from Settings → Privacy → Delete all data.',
  },
];

export function PrivacyScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backBtn, { color: theme.colors.textSecondary }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: theme.colors.textPrimary }]}>Privacy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Privacy</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Simple and honest.</Text>
        </View>

        {SECTIONS.map((section, i) => (
          <View
            key={section.title}
            style={[styles.sectionCard, {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderBottomWidth: i < SECTIONS.length - 1 ? 0 : StyleSheet.hairlineWidth,
              borderTopLeftRadius: i === 0 ? 16 : 0,
              borderTopRightRadius: i === 0 ? 16 : 0,
              borderBottomLeftRadius: i === SECTIONS.length - 1 ? 16 : 0,
              borderBottomRightRadius: i === SECTIONS.length - 1 ? 16 : 0,
              borderTopWidth: StyleSheet.hairlineWidth,
              borderLeftWidth: StyleSheet.hairlineWidth,
              borderRightWidth: StyleSheet.hairlineWidth,
            }]}
          >
            <Text style={styles.sectionEmoji}>{section.emoji}</Text>
            <View style={styles.sectionTextBlock}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>{section.title}</Text>
              <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>{section.content}</Text>
            </View>
          </View>
        ))}

        <Text style={[styles.version, { color: theme.colors.textTertiary }]}>
          Reroute respects your attention and your privacy.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: { fontFamily: fonts.dmSansMedium, fontSize: 15 },
  navTitle: { fontFamily: fonts.nunitoBold, fontSize: 17 },
  scroll: { paddingHorizontal: 20, paddingBottom: 48, gap: 0 },
  header: { gap: 4, paddingTop: 4, paddingBottom: 20 },
  title: { fontFamily: fonts.nunitoBold, fontSize: 26, letterSpacing: -0.3 },
  subtitle: { fontFamily: fonts.dmSansRegular, fontSize: 15 },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 16,
  },
  sectionEmoji: { fontSize: 20, marginTop: 2, flexShrink: 0 },
  sectionTextBlock: { flex: 1, gap: 4 },
  sectionTitle: { fontFamily: fonts.nunitoSemiBold, fontSize: 15 },
  sectionContent: { fontFamily: fonts.dmSansRegular, fontSize: 14, lineHeight: 20 },
  version: { fontFamily: fonts.dmSansRegular, fontSize: 13, textAlign: 'center', paddingTop: 20 },
});
