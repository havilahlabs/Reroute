import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { useSessionStore } from '../store/useSessionStore';
import { useInsightStore } from '../store/useInsightStore';
import { useSubscription } from '../hooks/useSubscription';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { BarChart, BarData } from '../components/BarChart';
import { AppGlyph, APPS, distractionName } from '../components/AppGlyph';
import { InsightService } from '../services/InsightService';
import { AnalyticsService } from '../services/AnalyticsService';
import { MainStackParamList } from '../navigation/MainNavigator';
import { IconChevronRight, IconDoc } from '../components/icons';
import { fonts } from '../theme';
import { getStartOfWeek } from '../utils/formatTime';
import { FocusSession } from '../models';

type Nav = NativeStackNavigationProp<MainStackParamList>;

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function buildWeekBars(sessions: FocusSession[]): BarData[] {
  const weekStart = getStartOfWeek();
  const minutesByDay = [0, 0, 0, 0, 0, 0, 0];
  sessions.forEach(s => {
    const d = new Date(s.startedAt);
    if (d >= weekStart) {
      const dow = (d.getDay() + 6) % 7; // Mon=0 … Sun=6
      minutesByDay[dow] += s.completedFocusMinutes;
    }
  });
  const max = Math.max(...minutesByDay, 1);
  const todayDow = (new Date().getDay() + 6) % 7;
  return minutesByDay.map((m, i) => ({
    label: DAY_LABELS[i],
    value: m / max,
    minutes: m,
    highlight: i === todayDow && m > 0,
    dim: i > todayDow,
  }));
}

function buildTopDistractions(sessions: FocusSession[]): { app: string; n: number }[] {
  const counts: Record<string, number> = {};
  sessions.filter(s => s.rerouteCount > 0 || s.unlockCount > 0).forEach(s => {
    s.selectedDistractions.forEach(d => {
      const name = distractionName(d);
      counts[name] = (counts[name] ?? 0) + 1;
    });
  });
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([app, n]) => ({ app, n }));
}

export function InsightsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const { sessionHistory, loadSessionHistory } = useSessionStore();
  const { insights, loadInsights } = useInsightStore();
  const { isPro } = useSubscription();

  useEffect(() => {
    loadSessionHistory();
    loadInsights();
    AnalyticsService.track('insight_viewed');
  }, []);

  const weekStart = getStartOfWeek();
  const completed = sessionHistory.filter(s => s.status === 'completed');
  const thisWeek = completed.filter(s => new Date(s.startedAt) >= weekStart);
  const totalSessions = thisWeek.length;
  const totalMinutes = thisWeek.reduce((sum, s) => sum + s.completedFocusMinutes, 0);
  const totalReroutes = thisWeek.reduce((sum, s) => sum + s.rerouteCount, 0);
  const daysActive = new Set(thisWeek.map(s => new Date(s.startedAt).toDateString())).size;

  const distraction = InsightService.detectRepeatedDistractions(sessionHistory);
  const commonDrift = InsightService.detectCommonDriftReason(sessionHistory);
  const weekBars = buildWeekBars(completed);
  const topDistractions = buildTopDistractions(sessionHistory);
  const peakMinutes = Math.max(...weekBars.map(b => b.minutes ?? 0), 0);

  const totalHours = Math.floor(totalMinutes / 60);
  const remainMin = totalMinutes % 60;
  const focusLabel = totalHours > 0 ? `${totalHours}h ${remainMin}m` : `${totalMinutes}m`;

  if (totalSessions === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Insights</Text>
        </View>
        <EmptyState headline="No insights yet." subtext="Complete a session to see your focus patterns." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Insights</Text>
        <View style={[styles.weekBadge, { backgroundColor: theme.colors.surfaceAlt }]}>
          <Text style={[styles.weekLabel, { color: theme.colors.textSecondary }]}>Week</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Big stats */}
        <Card padding="lg">
          <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary }]}>This week</Text>
          <View style={styles.statGrid}>
            <BigStat value={focusLabel} label="focus minutes" theme={theme} />
            <BigStat value={String(totalSessions)} label="sessions" theme={theme} />
            <BigStat value={String(totalReroutes)} label="times rerouted" theme={theme} accent />
            <BigStat value={`${daysActive}d`} label="showing up" theme={theme} />
          </View>
        </Card>

        {/* Bar chart */}
        <Card>
          <View style={styles.chartHeader}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary }]}>Daily minutes</Text>
            {peakMinutes > 0 && (
              <Text style={[styles.peakNote, { color: theme.colors.textTertiary }]}>peak: {peakMinutes}m</Text>
            )}
          </View>
          <BarChart data={weekBars} height={110} />
        </Card>

        {/* Top distractions */}
        {topDistractions.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary, paddingLeft: 4 }]}>Top distractions</Text>
            <Card padding="none">
              {topDistractions.map((row, i) => (
                <View key={row.app} style={[styles.listRow, { borderBottomWidth: i < topDistractions.length - 1 ? StyleSheet.hairlineWidth : 0, borderBottomColor: theme.colors.border }]}>
                  <AppGlyph name={row.app} color={APPS[row.app]} size={36} />
                  <Text style={[styles.appName, { color: theme.colors.textPrimary }]}>{row.app}</Text>
                  <Text style={[styles.driftCount, { color: theme.colors.textSecondary }]}>{row.n} {row.n === 1 ? 'session' : 'sessions'}</Text>
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* Weekly report link */}
        <TouchableOpacity
          onPress={() => navigation.navigate('WeeklyReport')}
          style={styles.reportLink}
          activeOpacity={0.7}
        >
          <IconDoc size={16} color={theme.colors.primary} />
          <Text style={[styles.reportLinkText, { color: theme.colors.primary }]}>View weekly report</Text>
          <IconChevronRight size={14} color={theme.colors.primary} />
        </TouchableOpacity>

        {!isPro && (
          <TouchableOpacity onPress={() => navigation.navigate('Paywall')} activeOpacity={0.85}>
            <Card variant="lavender">
              <Text style={[styles.proTitle, { color: theme.colors.textPrimary }]}>Weekly recovery report</Text>
              <Text style={[styles.proSubtext, { color: theme.colors.textSecondary }]}>See your full weekly pattern. Pro feature.</Text>
              <Text style={[styles.proLink, { color: theme.colors.primaryLight }]}>Upgrade to unlock →</Text>
            </Card>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function BigStat({ value, label, theme, accent }: { value: string; label: string; theme: ReturnType<typeof useTheme>; accent?: boolean }) {
  return (
    <View style={styles.bigStat}>
      <Text style={[styles.bigStatValue, { color: accent ? theme.colors.primaryLight : theme.colors.textPrimary }]}>{value}</Text>
      <Text style={[styles.bigStatLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  title: { fontFamily: fonts.nunitoBold, fontSize: 26, letterSpacing: -0.3 },
  weekBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  weekLabel: { fontFamily: fonts.dmSansMedium, fontSize: 13 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  sectionLabel: { fontFamily: fonts.dmSansMedium, fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 12 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 18 },
  bigStat: { width: '45%', gap: 4 },
  bigStatValue: { fontFamily: fonts.nunitoExtraLight, fontSize: 40, letterSpacing: -1.5, lineHeight: 44 },
  bigStatLabel: { fontFamily: fonts.dmSansRegular, fontSize: 12 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  peakNote: { fontFamily: fonts.dmSansRegular, fontSize: 12 },
  section: { gap: 10 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  appName: { fontFamily: fonts.nunitoSemiBold, fontSize: 15, flex: 1 },
  driftCount: { fontFamily: fonts.dmSansRegular, fontSize: 13 },
  reportLink: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4, paddingLeft: 4 },
  reportLinkText: { fontFamily: fonts.dmSansMedium, fontSize: 14, flex: 1 },
  proTitle: { fontFamily: fonts.nunitoBold, fontSize: 16, marginBottom: 4 },
  proSubtext: { fontFamily: fonts.dmSansRegular, fontSize: 13, marginBottom: 8 },
  proLink: { fontFamily: fonts.dmSansMedium, fontSize: 13 },
});
