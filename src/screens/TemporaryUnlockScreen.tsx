import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { useSessionStore } from '../store/useSessionStore';
import { useUnlockTimer } from '../hooks/useSessionTimer';
import { useHaptics } from '../hooks/useHaptics';
import { SegmentedControl } from '../components/SegmentedControl';
import { SessionService } from '../services/SessionService';
import { BlockingService } from '../services/BlockingService';
import { MainStackParamList } from '../navigation/MainNavigator';
import { IconLeaf } from '../components/icons';
import { fonts } from '../theme';

type Nav = NativeStackNavigationProp<MainStackParamList>;
type RouteT = RouteProp<MainStackParamList, 'TemporaryUnlock'>;

const BREAK_DURATIONS = ['5 min', '10 min', '15 min'];
const BREAK_SECONDS = [5 * 60, 10 * 60, 15 * 60];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function TemporaryUnlockScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteT>();
  const { activeSession, setActiveSession, endUnlockEvent } = useSessionStore();
  const { warning } = useHaptics();
  const [breakIdx, setBreakIdx] = useState(1); // default 10 min
  const [extended, setExtended] = useState(false);
  const [showReturn, setShowReturn] = useState(false);

  const unlockSeconds = BREAK_SECONDS[breakIdx];

  const handleTimerComplete = useCallback(() => {
    warning();
    setShowReturn(true);
  }, [warning]);

  const { secondsLeft } = useUnlockTimer(unlockSeconds, handleTimerComplete);

  const handleBack = async () => {
    if (!activeSession) return;
    endUnlockEvent(route.params.unlockEventId);
    await BlockingService.endTemporaryUnlock();
    navigation.replace('ActiveSession', { sessionId: activeSession.id });
  };

  const handleExtend = () => {
    if (extended) return;
    setExtended(true);
    setShowReturn(false);
  };

  const handleEnd = async () => {
    if (!activeSession) return;
    const ended = await SessionService.endSession(activeSession);
    setActiveSession(null);
    navigation.replace('EndSession', { session: ended });
  };

  const session = activeSession;
  if (!session) return null;

  const displaySeconds = extended ? unlockSeconds : secondsLeft;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headline, { color: theme.colors.textPrimary }]}>
            It's okay to step away.
          </Text>
          <Text style={[styles.reasonLabel, { color: theme.colors.textTertiary }]}>
            Reason: {route.params.reason}
          </Text>
        </View>

        {/* Timer */}
        <View style={styles.timerBlock}>
          <Text style={[styles.timerText, { color: theme.colors.textPrimary }]}>
            {formatTime(displaySeconds)}
          </Text>
          <Text style={[styles.timerSub, { color: theme.colors.textTertiary }]}>remaining</Text>
        </View>

        {/* Break duration picker (only before timer starts ticking down) */}
        {!showReturn && !extended && (
          <View style={styles.pickerSection}>
            <Text style={[styles.pickerLabel, { color: theme.colors.textTertiary }]}>BREAK LENGTH</Text>
            <SegmentedControl
              options={BREAK_DURATIONS}
              selectedIndex={breakIdx}
              onChange={setBreakIdx}
            />
          </View>
        )}

        {/* Reassurance card */}
        <View style={[styles.reassureCard, {
          backgroundColor: theme.isDark ? 'rgba(244,236,223,0.06)' : 'rgba(244,236,223,0.8)',
          borderColor: theme.isDark ? 'rgba(201,165,126,0.2)' : 'rgba(201,165,126,0.3)',
        }]}>
          <View style={[styles.leafIcon, { backgroundColor: theme.isDark ? 'rgba(201,165,126,0.15)' : 'rgba(201,165,126,0.2)' }]}>
            <IconLeaf size={18} color={theme.colors.warm} />
          </View>
          <View style={styles.reassureText}>
            <Text style={[styles.reassureTitle, { color: theme.isDark ? '#F4ECDF' : '#8B6840' }]}>
              You'll come back stronger.
            </Text>
            <Text style={[styles.reassureSub, { color: theme.colors.textTertiary }]}>
              A short rest is part of focus.
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {showReturn && !extended ? (
            <>
              <View style={[styles.returnBox, { backgroundColor: theme.colors.surfaceAlt }]}>
                <Text style={[styles.returnLabel, { color: theme.colors.textTertiary }]}>You wanted to protect:</Text>
                <Text style={[styles.returnTask, { color: theme.colors.textPrimary }]}>{session.task}</Text>
              </View>
              <TouchableOpacity
                onPress={handleBack}
                style={[styles.primaryBtn, { backgroundColor: theme.colors.primary }]}
              >
                <Text style={styles.primaryBtnText}>Reroute back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleExtend}
                style={[styles.secondaryBtn, { backgroundColor: theme.colors.surfaceAlt }]}
              >
                <Text style={[styles.secondaryBtnText, { color: theme.colors.textPrimary }]}>Extend once</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={handleBack}
              style={[styles.primaryBtn, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={styles.primaryBtnText}>
                Back to task now
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleEnd} style={styles.textBtn}>
            <Text style={[styles.textBtnLabel, { color: theme.colors.textTertiary }]}>End session</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 48, gap: 28 },
  header: { alignItems: 'center', gap: 8 },
  headline: { fontFamily: fonts.nunitoBold, fontSize: 26, letterSpacing: -0.3, textAlign: 'center' },
  reasonLabel: { fontFamily: fonts.dmSansRegular, fontSize: 14 },
  timerBlock: { alignItems: 'center', gap: 4 },
  timerText: { fontFamily: fonts.nunitoExtraLight, fontSize: 64, letterSpacing: -2, lineHeight: 70 },
  timerSub: { fontFamily: fonts.dmSansRegular, fontSize: 14 },
  pickerSection: { gap: 10 },
  pickerLabel: { fontFamily: fonts.dmSansMedium, fontSize: 11, letterSpacing: 0.6, textAlign: 'center' },
  reassureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
  },
  leafIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  reassureText: { flex: 1, gap: 2 },
  reassureTitle: { fontFamily: fonts.nunitoSemiBold, fontSize: 15 },
  reassureSub: { fontFamily: fonts.dmSansRegular, fontSize: 13 },
  actions: { gap: 10, marginTop: 'auto' as any, paddingBottom: 24 },
  returnBox: { padding: 18, borderRadius: 14, gap: 4, marginBottom: 4 },
  returnLabel: { fontFamily: fonts.dmSansRegular, fontSize: 13, textAlign: 'center' },
  returnTask: { fontFamily: fonts.nunitoBold, fontSize: 16, textAlign: 'center' },
  primaryBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  primaryBtnText: { fontFamily: fonts.nunitoBold, fontSize: 17, color: '#fff' },
  secondaryBtn: { paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  secondaryBtnText: { fontFamily: fonts.nunitoSemiBold, fontSize: 16 },
  textBtn: { alignItems: 'center', paddingVertical: 8 },
  textBtnLabel: { fontFamily: fonts.dmSansMedium, fontSize: 14 },
});
