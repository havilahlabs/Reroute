import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { useSessionStore } from '../store/useSessionStore';
import { AppGlyph, APPS } from '../components/AppGlyph';
import { BlockingService } from '../services/BlockingService';
import { useHaptics } from '../hooks/useHaptics';
import { IconClose } from '../components/icons';
import { fonts } from '../theme';

const DEMO_APPS = [
  { id: 'tiktok', name: 'TikTok' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'messages', name: 'Messages' },
  { id: 'safari', name: 'Safari' },
  { id: 'reddit', name: 'Reddit' },
];

export function DemoBlockingScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { activeSession } = useSessionStore();
  const { medium } = useHaptics();

  const handleSimulate = (appName: string) => {
    if (!activeSession) return;
    medium();
    navigation.goBack();
    setTimeout(() => {
      BlockingService.simulateBlockedApp(appName);
    }, 300);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <IconClose size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: theme.colors.textPrimary }]}>Demo blocking</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          Simulate opening a distracting app to see how Reroute responds.
        </Text>

        {!activeSession && (
          <View style={[styles.notice, {
            backgroundColor: theme.isDark ? 'rgba(244,162,97,0.1)' : 'rgba(244,162,97,0.08)',
            borderColor: 'rgba(244,162,97,0.3)',
          }]}>
            <Text style={[styles.noticeText, { color: '#F4A261' }]}>
              Start a focus session first to test blocking.
            </Text>
          </View>
        )}

        <View style={styles.grid}>
          {DEMO_APPS.map(app => (
            <TouchableOpacity
              key={app.id}
              onPress={() => handleSimulate(app.name)}
              disabled={!activeSession}
              activeOpacity={0.7}
              style={[
                styles.appBtn,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  opacity: activeSession ? 1 : 0.4,
                },
              ]}
            >
              <AppGlyph name={app.name} color={APPS[app.name]} size={44} />
              <Text style={[styles.appName, { color: theme.colors.textSecondary }]}>Open {app.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 0,
  },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontFamily: fonts.nunitoBold, fontSize: 17, flex: 1, textAlign: 'center' },
  scroll: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 40, gap: 20 },
  description: { fontFamily: fonts.dmSansRegular, fontSize: 15, lineHeight: 22 },
  notice: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  noticeText: { fontFamily: fonts.dmSansRegular, fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  appBtn: {
    width: '47%',
    padding: 20,
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  appName: { fontFamily: fonts.dmSansMedium, fontSize: 13 },
});
