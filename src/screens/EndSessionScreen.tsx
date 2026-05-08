import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { useSessionStore } from '../store/useSessionStore';
import { useInsightStore } from '../store/useInsightStore';
import { AppGlyph, APPS, distractionName } from '../components/AppGlyph';
import { InsightService } from '../services/InsightService';
import { BlockingService } from '../services/BlockingService';
import { AnalyticsService } from '../services/AnalyticsService';
import { MainStackParamList } from '../navigation/MainNavigator';
import { IconLeaf } from '../components/icons';
import { fonts } from '../theme';
import { Insight } from '../models';

type Nav = NativeStackNavigationProp<MainStackParamList>;
type RouteT = RouteProp<MainStackParamList, 'EndSession'>;

const DRIFT_REASONS = [
  'Social media',
  'Email',
  'Phone call',
  'News',
  'Boredom',
  'Work-related',
  'Other',
];

export function EndSessionScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteT>();
  const { addSessionToHistory } = useSessionStore();
  const { addInsight } = useInsightStore();
  const session = route.params.session;

  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [step, setStep] = useState<'reason' | 'summary'>('reason');

  useEffect(() => {
    BlockingService.stopProtection();
    addSessionToHistory(session);
    AnalyticsService.track('session_completed', {
      duration: session.durationMinutes,
      reroutes: session.rerouteCount,
      status: session.status,
    });
  }, []);

  const handleReasonSelected = async (reason: string) => {
    setSelectedReason(reason);
    const sessionWithReason = { ...session, distractionReasons: [...session.distractionReasons, reason] };
    const generatedInsight = InsightService.generatePostSessionInsight(sessionWithReason);
    setInsight(generatedInsight);
    addInsight(generatedInsight);
    await AnalyticsService.track('insight_viewed');
    setStep('summary');
  };

  const goHome = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
  };

  const totalMinutes = session.completedFocusMinutes ?? session.durationMinutes;
  const totalHours = Math.floor(totalMinutes / 60);
  const remainMin = totalMinutes % 60;
  const focusLabel = totalHours > 0 ? `${totalHours}h ${remainMin}m` : `${totalMinutes}m`;
  const rerouteCount = session.rerouteCount ?? 0;
  const breakCount = session.unlockCount ?? 0;
  const focusPct = session.durationMinutes > 0
    ? Math.round((totalMinutes / session.durationMinutes) * 100)
    : 100;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>✨</Text>
          <Text style={[styles.heroTitle, { color: theme.colors.textPrimary }]}>
            You came back.{'\n'}That counts.
          </Text>
          <Text style={[styles.heroSub, { color: theme.colors.textSecondary }]}>
            {session.task}
          </Text>
        </View>

        {/* Stat grid */}
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.statGrid}>
            <StatCell value={focusLabel} label="focus time" theme={theme} />
            <StatCell value={String(rerouteCount)} label="reroutes" theme={theme} accent />
            <StatCell value={String(breakCount)} label="breaks" theme={theme} />
            <StatCell value={`${focusPct}%`} label="focus" theme={theme} />
          </View>
        </View>

        {step === 'reason' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              What pulled you away most?
            </Text>
            <View style={styles.chips}>
              {DRIFT_REASONS.map(r => {
                const selected = selectedReason === r;
                return (
                  <TouchableOpacity
                    key={r}
                    onPress={() => handleReasonSelected(r)}
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
            <TouchableOpacity onPress={() => setStep('summary')} style={styles.skipBtn}>
              <Text style={[styles.skipText, { color: theme.colors.textTertiary }]}>Skip</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'summary' && (
          <>
            {/* Distraction summary — only shown when something actually happened */}
            {(rerouteCount > 0 || breakCount > 0) && (
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary }]}>WHAT HAPPENED</Text>

                {selectedReason && (
                  <View style={[styles.reasonRow, {
                    backgroundColor: theme.isDark ? 'rgba(124,111,205,0.1)' : 'rgba(124,111,205,0.06)',
                    borderColor: 'rgba(169,159,224,0.25)',
                  }]}>
                    <Text style={[styles.reasonLabel, { color: theme.colors.textSecondary }]}>What pulled you away</Text>
                    <Text style={[styles.reasonValue, { color: theme.colors.primaryLight }]}>{selectedReason}</Text>
                  </View>
                )}

                {session.selectedDistractions.length > 0 && (
                  <>
                    <Text style={[styles.protectedLabel, { color: theme.colors.textTertiary }]}>Protected apps</Text>
                    <View style={styles.appChips}>
                      {session.selectedDistractions.slice(0, 6).map(d => {
                        const name = distractionName(d);
                        return (
                          <View key={d} style={[styles.appChip, { backgroundColor: theme.colors.surfaceAlt }]}>
                            <AppGlyph name={name} color={APPS[name]} size={22} />
                            <Text style={[styles.appChipText, { color: theme.colors.textSecondary }]}>{name}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </>
                )}
              </View>
            )}

            {/* Insight card */}
            {insight && (
              <View style={[styles.insightCard, {
                backgroundColor: theme.isDark ? 'rgba(244,236,223,0.06)' : 'rgba(244,236,223,0.8)',
                borderColor: theme.isDark ? 'rgba(201,165,126,0.2)' : 'rgba(201,165,126,0.3)',
              }]}>
                <View style={[styles.leafIcon, { backgroundColor: theme.isDark ? 'rgba(201,165,126,0.15)' : 'rgba(201,165,126,0.2)' }]}>
                  <IconLeaf size={18} color={theme.colors.warm} />
                </View>
                <Text style={[styles.insightText, { color: theme.isDark ? '#F4ECDF' : theme.colors.textPrimary }]}>
                  {insight.message}
                </Text>
              </View>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => navigation.navigate('StartSession', {})}
                style={[styles.primaryBtn, { backgroundColor: theme.colors.primary }]}
              >
                <Text style={styles.primaryBtnText}>Start another session</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={goHome} style={styles.textBtn}>
                <Text style={[styles.textBtnLabel, { color: theme.colors.textTertiary }]}>Done</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCell({ value, label, theme, accent }: {
  value: string;
  label: string;
  theme: ReturnType<typeof useTheme>;
  accent?: boolean;
}) {
  return (
    <View style={styles.statCell}>
      <Text style={[styles.statValue, { color: accent ? theme.colors.primaryLight : theme.colors.textPrimary }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 48, gap: 24 },
  hero: { alignItems: 'center', gap: 10 },
  heroEmoji: { fontSize: 52 },
  heroTitle: {
    fontFamily: fonts.nunitoBold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  heroSub: { fontFamily: fonts.dmSansRegular, fontSize: 15, textAlign: 'center' },
  statCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
  },
  statGrid: { flexDirection: 'row', gap: 8 },
  statCell: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontFamily: fonts.nunitoExtraLight, fontSize: 34, letterSpacing: -1, lineHeight: 38 },
  statLabel: { fontFamily: fonts.dmSansRegular, fontSize: 11, textAlign: 'center' },
  section: { gap: 12 },
  sectionTitle: { fontFamily: fonts.nunitoBold, fontSize: 18 },
  sectionLabel: { fontFamily: fonts.dmSansMedium, fontSize: 11, letterSpacing: 0.6, paddingLeft: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },
  chipText: { fontFamily: fonts.dmSansMedium, fontSize: 14 },
  skipBtn: { alignItems: 'center', paddingVertical: 8 },
  skipText: { fontFamily: fonts.dmSansRegular, fontSize: 14 },
  reasonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1 },
  reasonLabel: { fontFamily: fonts.dmSansRegular, fontSize: 14 },
  reasonValue: { fontFamily: fonts.nunitoSemiBold, fontSize: 14 },
  protectedLabel: { fontFamily: fonts.dmSansMedium, fontSize: 11, letterSpacing: 0.5, paddingLeft: 2 },
  appChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  appChip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  appChipText: { fontFamily: fonts.dmSansRegular, fontSize: 13 },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
  },
  leafIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  insightText: { fontFamily: fonts.nunitoMedium, fontSize: 15, lineHeight: 22, flex: 1 },
  actions: { gap: 10 },
  primaryBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  primaryBtnText: { fontFamily: fonts.nunitoBold, fontSize: 17, color: '#fff' },
  textBtn: { alignItems: 'center', paddingVertical: 8 },
  textBtnLabel: { fontFamily: fonts.dmSansMedium, fontSize: 14 },
});
