import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { useSessionStore } from '../store/useSessionStore';
import { useHaptics } from '../hooks/useHaptics';
import { GentleToast } from '../components/GentleToast';
import { SessionService } from '../services/SessionService';
import { AnalyticsService } from '../services/AnalyticsService';
import { MainStackParamList } from '../navigation/MainNavigator';
import { fonts } from '../theme';

type Nav = NativeStackNavigationProp<MainStackParamList>;
type RouteT = RouteProp<MainStackParamList, 'DriftReroute'>;

const DRIFT_REASONS = [
  'Social media',
  'Email',
  'Phone call',
  'News',
  'Boredom',
  'Other',
];

const UNLOCK_REASONS = [
  'Message someone',
  'Work-related',
  'Quick search',
  'Emergency',
  "I'm avoiding my task",
  'I needed a break',
];

export function DriftRerouteScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteT>();
  const { activeSession, setActiveSession } = useSessionStore();
  const { success } = useHaptics();
  const [showToast, setShowToast] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [showBreakReasons, setShowBreakReasons] = useState(false);

  const session = activeSession;
  const { driftEventId } = route.params;

  const handleReroute = async () => {
    if (!session) return;
    const { session: updated } = await SessionService.recordReroute(session, driftEventId);
    setActiveSession(updated);
    success();
    await AnalyticsService.track('rerouted_to_task');
    setShowToast(true);
    setTimeout(() => navigation.goBack(), 1800);
  };

  const handleUnlockReason = async (reason: string) => {
    if (!session) return;
    setShowBreakReasons(false);
    const { session: updated, unlockEvent } = await SessionService.recordUnlock(
      session,
      reason,
      route.params.appName ?? 'App',
      driftEventId
    );
    setActiveSession(updated);
    await AnalyticsService.track('unlock_started', { reason });
    navigation.replace('TemporaryUnlock', {
      sessionId: session.id,
      unlockEventId: unlockEvent.id,
      reason,
    });
  };

  const handleEnd = async () => {
    if (!session) return;
    const ended = await SessionService.endSession(session);
    setActiveSession(null);
    navigation.replace('EndSession', { session: ended });
  };

  if (!session) return null;

  if (showBreakReasons) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
        <View style={styles.breakContainer}>
          <Text style={[styles.breakTitle, { color: theme.colors.textPrimary }]}>Why do you need this?</Text>
          <View style={styles.breakList}>
            {UNLOCK_REASONS.map(r => (
              <TouchableOpacity
                key={r}
                onPress={() => handleUnlockReason(r)}
                style={[styles.breakRow, { backgroundColor: theme.colors.surfaceAlt }]}
              >
                <Text style={[styles.breakRowText, { color: theme.colors.textPrimary }]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={() => setShowBreakReasons(false)} style={styles.textBtn}>
            <Text style={[styles.textBtnLabel, { color: theme.colors.textTertiary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Emoji + headline */}
        <View style={styles.topBlock}>
          <Text style={styles.emoji}>🌿</Text>
          <Text style={[styles.headline, { color: theme.colors.textPrimary }]}>
            It happens.{'\n'}Let's get back.
          </Text>
          <Text style={[styles.subtext, { color: theme.colors.textSecondary }]}>
            No judgment here — just a way back.
          </Text>
        </View>

        {/* Route reminder */}
        <View style={[styles.routeCard, {
          backgroundColor: theme.isDark ? 'rgba(124,111,205,0.12)' : 'rgba(124,111,205,0.07)',
          borderColor: 'rgba(169,159,224,0.3)',
        }]}>
          <Text style={[styles.routeCardLabel, { color: theme.colors.primaryLight }]}>YOU WERE WORKING ON</Text>
          <Text style={[styles.routeCardTask, { color: theme.colors.textPrimary }]}>{session.task}</Text>
          <View style={[styles.divider, { backgroundColor: 'rgba(169,159,224,0.2)' }]} />
          <Text style={[styles.routeCardPlanLabel, { color: theme.colors.textTertiary }]}>YOUR WAY BACK</Text>
          <Text style={[styles.routeCardPlan, { color: theme.colors.textSecondary }]}>{session.reroutePlan}</Text>
        </View>

        {/* What pulled you */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary }]}>WHAT PULLED YOU?</Text>
          <View style={styles.chips}>
            {DRIFT_REASONS.map(r => {
              const selected = selectedReason === r;
              return (
                <TouchableOpacity
                  key={r}
                  onPress={() => setSelectedReason(selected ? null : r)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selected
                        ? (theme.isDark ? 'rgba(124,111,205,0.18)' : 'rgba(124,111,205,0.1)')
                        : theme.colors.surfaceAlt,
                      borderColor: selected ? theme.colors.primaryLight : 'transparent',
                      borderWidth: 1.5,
                    },
                  ]}
                >
                  <Text style={[styles.chipText, { color: selected ? theme.colors.primaryLight : theme.colors.textSecondary }]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Optional notes */}
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Optional notes..."
          placeholderTextColor={theme.colors.textTertiary}
          multiline
          style={[styles.notesInput, {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.textPrimary,
          }]}
        />

        {/* CTAs */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handleReroute}
            style={[styles.primaryBtn, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.primaryBtnText}>Get back on track</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowBreakReasons(true)} style={styles.textBtn}>
            <Text style={[styles.textBtnLabel, { color: theme.colors.textSecondary }]}>
              Take a 5-minute break →
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleEnd} style={styles.textBtn}>
            <Text style={[styles.textBtnLabel, { color: theme.colors.textTertiary }]}>End session</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <GentleToast
        message="You came back. That matters."
        visible={showToast}
        onHide={() => setShowToast(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40, gap: 24 },
  topBlock: { alignItems: 'center', gap: 10 },
  emoji: { fontSize: 48 },
  headline: {
    fontFamily: fonts.nunitoBold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtext: { fontFamily: fonts.dmSansRegular, fontSize: 15, textAlign: 'center' },
  routeCard: {
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
  },
  routeCardLabel: { fontFamily: fonts.dmSansMedium, fontSize: 10, letterSpacing: 0.6 },
  routeCardTask: { fontFamily: fonts.nunitoBold, fontSize: 17, lineHeight: 24 },
  divider: { height: 1, marginVertical: 4 },
  routeCardPlanLabel: { fontFamily: fonts.dmSansMedium, fontSize: 10, letterSpacing: 0.6 },
  routeCardPlan: { fontFamily: fonts.nunitoMedium, fontSize: 15, lineHeight: 22 },
  section: { gap: 12 },
  sectionLabel: { fontFamily: fonts.dmSansMedium, fontSize: 11, letterSpacing: 0.6, paddingLeft: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  chipText: { fontFamily: fonts.dmSansMedium, fontSize: 14 },
  notesInput: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    fontFamily: fonts.dmSansRegular,
    fontSize: 15,
    minHeight: 56,
  },
  actions: { gap: 12 },
  primaryBtn: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryBtnText: { fontFamily: fonts.nunitoBold, fontSize: 17, color: '#fff' },
  textBtn: { alignItems: 'center', paddingVertical: 8 },
  textBtnLabel: { fontFamily: fonts.dmSansMedium, fontSize: 15 },
  // Break reasons view
  breakContainer: { flex: 1, paddingHorizontal: 24, paddingTop: 48, gap: 20 },
  breakTitle: { fontFamily: fonts.nunitoBold, fontSize: 22, marginBottom: 8 },
  breakList: { gap: 10 },
  breakRow: { padding: 16, borderRadius: 14 },
  breakRowText: { fontFamily: fonts.nunitoSemiBold, fontSize: 15 },
});
