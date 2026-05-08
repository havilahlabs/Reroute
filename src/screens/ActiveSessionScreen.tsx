import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Alert, TouchableOpacity, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { useSessionStore } from '../store/useSessionStore';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { useHaptics } from '../hooks/useHaptics';
import { CircularProgressRing } from '../components/CircularProgressRing';
import { WayBackCard } from '../components/WayBackCard';
import { AppGlyph, APPS, distractionName } from '../components/AppGlyph';
import { GentleToast } from '../components/GentleToast';
import { SessionService } from '../services/SessionService';
import { BlockingService } from '../services/BlockingService';
import { AnalyticsService } from '../services/AnalyticsService';
import { MainStackParamList } from '../navigation/MainNavigator';
import { IconPause } from '../components/icons';
import { fonts } from '../theme';

type Nav = NativeStackNavigationProp<MainStackParamList>;
type RouteT = RouteProp<MainStackParamList, 'ActiveSession'>;

const DEMO_APPS = ['TikTok', 'Instagram', 'YouTube', 'Messages', 'Safari', 'Reddit'];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function ActiveSessionScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteT>();
  const { activeSession, setActiveSession } = useSessionStore();
  const { warning } = useHaptics();
  const [showToast, setShowToast] = useState(false);
  const [showGentlePrompt, setShowGentlePrompt] = useState(false);
  const [showDemoPanel, setShowDemoPanel] = useState(false);
  const driftEventIdRef = useRef<string>('');

  const session = activeSession;

  const handleComplete = async () => {
    if (!session) return;
    warning();
    const ended = await SessionService.endSession(session);
    setActiveSession(null);
    navigation.replace('EndSession', { session: ended });
  };

  const { secondsLeft, progress } = useSessionTimer(
    session?.durationMinutes ?? 25,
    handleComplete,
    session?.startedAt,
  );

  useEffect(() => {
    if (!session) return;
    const unsubscribe = BlockingService.onDemoIntercept(async (appName) => {
      const { session: updated, event } = await SessionService.recordDrift(session, 'demo', appName);
      driftEventIdRef.current = event.id;
      setActiveSession(updated);
      await AnalyticsService.track('drift_recorded');
      navigation.navigate('DriftReroute', { sessionId: session.id, driftEventId: event.id, appName });
    });
    return unsubscribe;
  }, [session]);

  useEffect(() => {
    if (!session) return;
    const timer = setTimeout(() => setShowGentlePrompt(true), 12 * 60 * 1000);
    return () => clearTimeout(timer);
  }, [session]);

  const handleDrifting = async () => {
    if (!session) return;
    const { session: updated, event } = await SessionService.recordDrift(session, 'manual');
    driftEventIdRef.current = event.id;
    setActiveSession(updated);
    await AnalyticsService.track('drift_recorded');
    navigation.navigate('DriftReroute', { sessionId: session.id, driftEventId: event.id });
  };

  const handleEndSession = () => {
    Alert.alert('End session?', 'Your progress will be saved.', [
      { text: 'Keep going', style: 'cancel' },
      { text: 'End session', style: 'destructive', onPress: handleComplete },
    ]);
  };

  const simulateDemo = (appName: string) => {
    setShowDemoPanel(false);
    BlockingService.simulateBlockedApp(appName);
  };

  if (!session) return null;

  const rerouteCount = session.rerouteCount ?? 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.isDark ? '#1A1828' : '#F5F0EB' }]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.workingLabel, { color: theme.colors.textTertiary }]}>WORKING ON</Text>
          <Text style={[styles.taskText, { color: theme.colors.textPrimary }]} numberOfLines={2}>
            {session.task}
          </Text>
        </View>

        {/* Circular progress ring */}
        <View style={styles.ringBlock}>
          <CircularProgressRing
            size={280}
            progress={progress}
            reroutes={rerouteCount}
          >
            <Text style={[styles.timerText, { color: theme.colors.textPrimary }]}>
              {formatTime(secondsLeft)}
            </Text>
            <Text style={[styles.timerSub, { color: theme.colors.textTertiary }]}>
              of {session.durationMinutes} min
            </Text>
          </CircularProgressRing>
        </View>

        {/* Way back card */}
        <WayBackCard text={session.reroutePlan} />

        {/* Protected apps */}
        {session.selectedDistractions.length > 0 && (
          <View style={styles.appsRow}>
            <Text style={[styles.appsLabel, { color: theme.colors.textTertiary }]}>PROTECTED</Text>
            <View style={styles.appGlyphs}>
              {session.selectedDistractions.slice(0, 6).map(d => {
                const name = distractionName(d);
                return <AppGlyph key={d} name={name} color={APPS[name]} size={28} />;
              })}
              {session.selectedDistractions.length > 6 && (
                <View style={[styles.moreApps, { backgroundColor: theme.colors.surfaceAlt }]}>
                  <Text style={[styles.moreText, { color: theme.colors.textTertiary }]}>
                    +{session.selectedDistractions.length - 6}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handleDrifting}
            style={[styles.driftBtn, { backgroundColor: theme.isDark ? 'rgba(244,162,97,0.15)' : 'rgba(244,162,97,0.12)', borderColor: 'rgba(244,162,97,0.4)', borderWidth: 1 }]}
          >
            <Text style={[styles.driftBtnText, { color: '#F4A261' }]}>I drifted</Text>
          </TouchableOpacity>

          <View style={styles.secondaryRow}>
            <TouchableOpacity
              onPress={() => setShowDemoPanel(true)}
              style={[styles.iconBtn, { backgroundColor: theme.colors.surfaceAlt }]}
            >
              <IconPause size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEndSession} style={styles.endBtn}>
              <Text style={[styles.endBtnText, { color: theme.colors.textTertiary }]}>End session</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <GentleToast
        message="You came back. That matters."
        visible={showToast}
        onHide={() => setShowToast(false)}
      />

      {/* Gentle check-in prompt */}
      {showGentlePrompt && (
        <Modal transparent animationType="fade">
          <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.sheetTitle, { color: theme.colors.textPrimary }]}>Still with it?</Text>
              <TouchableOpacity
                onPress={() => setShowGentlePrompt(false)}
                style={[styles.sheetBtn, { backgroundColor: theme.colors.primary }]}
              >
                <Text style={styles.sheetBtnText}>Yes, still focused</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setShowGentlePrompt(false); handleDrifting(); }}
                style={[styles.sheetBtn, { backgroundColor: theme.colors.surfaceAlt }]}
              >
                <Text style={[styles.sheetBtnSecondary, { color: theme.colors.textPrimary }]}>I drifted</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setShowGentlePrompt(false); handleEndSession(); }} style={styles.sheetTextBtn}>
                <Text style={[styles.sheetTextBtnLabel, { color: theme.colors.textTertiary }]}>End session</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Demo panel */}
      <Modal visible={showDemoPanel} transparent animationType="slide">
        <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sheetTitle, { color: theme.colors.textPrimary }]}>Simulate blocked app</Text>
            {DEMO_APPS.map(app => (
              <TouchableOpacity
                key={app}
                onPress={() => simulateDemo(app)}
                style={[styles.demoRow, { backgroundColor: theme.colors.surfaceAlt }]}
              >
                <AppGlyph name={app} color={APPS[app]} size={28} />
                <Text style={[styles.demoRowText, { color: theme.colors.textPrimary }]}>Open {app}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowDemoPanel(false)} style={styles.sheetTextBtn}>
              <Text style={[styles.sheetTextBtnLabel, { color: theme.colors.textTertiary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 16, gap: 20 },
  header: { alignItems: 'center', gap: 6 },
  workingLabel: { fontFamily: fonts.dmSansMedium, fontSize: 11, letterSpacing: 0.6 },
  taskText: { fontFamily: fonts.nunitoBold, fontSize: 18, lineHeight: 26, textAlign: 'center' },
  ringBlock: { alignItems: 'center', justifyContent: 'center' },
  timerText: { fontFamily: fonts.nunitoExtraLight, fontSize: 52, letterSpacing: -2, lineHeight: 58 },
  timerSub: { fontFamily: fonts.dmSansRegular, fontSize: 13, textAlign: 'center', marginTop: 2 },
  appsRow: { alignItems: 'center', gap: 8 },
  appsLabel: { fontFamily: fonts.dmSansMedium, fontSize: 10, letterSpacing: 0.6 },
  appGlyphs: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'center' },
  moreApps: { width: 28, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  moreText: { fontFamily: fonts.dmSansMedium, fontSize: 10 },
  actions: { gap: 10, marginTop: 'auto' as any, paddingBottom: 20 },
  driftBtn: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  driftBtnText: { fontFamily: fonts.nunitoBold, fontSize: 17 },
  secondaryRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  endBtn: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  endBtnText: { fontFamily: fonts.dmSansMedium, fontSize: 15 },
  overlay: { flex: 1, justifyContent: 'flex-end', padding: 20 },
  sheet: { borderRadius: 24, padding: 24, gap: 10 },
  sheetTitle: { fontFamily: fonts.nunitoBold, fontSize: 18, marginBottom: 8 },
  sheetBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  sheetBtnText: { fontFamily: fonts.nunitoBold, fontSize: 16, color: '#fff' },
  sheetBtnSecondary: { fontFamily: fonts.nunitoSemiBold, fontSize: 16 },
  sheetTextBtn: { alignItems: 'center', paddingVertical: 10 },
  sheetTextBtnLabel: { fontFamily: fonts.dmSansMedium, fontSize: 14 },
  demoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12 },
  demoRowText: { fontFamily: fonts.nunitoSemiBold, fontSize: 15 },
});
