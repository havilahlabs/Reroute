import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { useSessionStore } from '../store/useSessionStore';
import { useInsightStore } from '../store/useInsightStore';
import { Card } from '../components/Card';
import { BarChart, BarData } from '../components/BarChart';
import { InsightService } from '../services/InsightService';
import { IconLeaf } from '../components/icons';
import { formatDuration, getStartOfWeek } from '../utils/formatTime';
import { fonts } from '../theme';
import { FocusSession } from '../models';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function buildWeekBars(sessions: FocusSession[]): BarData[] {
  const weekStart = getStartOfWeek();
  const minutesByDay = [0, 0, 0, 0, 0, 0, 0];
  sessions.forEach(s => {
    const d = new Date(s.startedAt);
    if (d >= weekStart) {
      const dow = (d.getDay() + 6) % 7;
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

export function WeeklyReportScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { sessionHistory, loadSessionHistory } = useSessionStore();
  const { setWeeklyInsight, weeklyInsight } = useInsightStore();

  useEffect(() => {
    loadSessionHistory();
  }, []);

  useEffect(() => {
    if (sessionHistory.length > 0) {
      const insight = InsightService.generateWeeklyInsights(sessionHistory);
      setWeeklyInsight(insight);
    }
  }, [sessionHistory]);

  const wi = weeklyInsight;
  const weekBars = buildWeekBars(sessionHistory.filter(s => s.status === 'completed'));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backBtn, { color: theme.colors.textSecondary }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: theme.colors.textPrimary }]}>Weekly Report</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Weekly Recovery Report</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Your focus patterns this week.
          </Text>
        </View>

        {/* Bar chart */}
        <Card>
          <View style={styles.chartHeader}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary }]}>DAILY MINUTES</Text>
          </View>
          <BarChart data={weekBars} height={110} />
        </Card>

        {wi ? (
          <>
            {/* Stats */}
            <Card padding="lg">
              <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary }]}>THIS WEEK</Text>
              <View style={styles.statGrid}>
                <StatCell value={String(wi.sessionsCompleted)} label="sessions" theme={theme} />
                <StatCell value={String(wi.timesRerouted)} label="reroutes" theme={theme} accent />
                <StatCell value={wi.biggestDistraction ?? '—'} label="main drift" theme={theme} small />
                <StatCell
                  value={wi.bestSessionLength ? formatDuration(wi.bestSessionLength) : '—'}
                  label="best session"
                  theme={theme}
                  small
                />
              </View>
            </Card>

            {/* Main pattern */}
            {wi.mainPattern && (
              <View style={[styles.highlight, {
                backgroundColor: theme.colors.surfaceAlt,
                borderLeftColor: theme.colors.primaryLight,
              }]}>
                <Text style={[styles.highlightLabel, { color: theme.colors.textTertiary }]}>MAIN PATTERN</Text>
                <Text style={[styles.highlightText, { color: theme.colors.textPrimary }]}>{wi.mainPattern}</Text>
              </View>
            )}

            {/* Suggested experiment */}
            {wi.suggestedExperiment && (
              <View style={[styles.highlight, {
                backgroundColor: theme.isDark ? 'rgba(124,111,205,0.1)' : 'rgba(124,111,205,0.06)',
                borderLeftColor: theme.colors.primary,
              }]}>
                <Text style={[styles.highlightLabel, { color: theme.colors.primaryLight }]}>TRY NEXT WEEK</Text>
                <Text style={[styles.highlightText, { color: theme.colors.textPrimary }]}>{wi.suggestedExperiment}</Text>
              </View>
            )}

            {/* Gentle note */}
            <View style={[styles.gentleCard, {
              backgroundColor: theme.isDark ? 'rgba(244,236,223,0.06)' : 'rgba(244,236,223,0.8)',
              borderColor: theme.isDark ? 'rgba(201,165,126,0.2)' : 'rgba(201,165,126,0.3)',
            }]}>
              <View style={[styles.leafWrap, { backgroundColor: theme.isDark ? 'rgba(201,165,126,0.15)' : 'rgba(201,165,126,0.2)' }]}>
                <IconLeaf size={18} color={theme.colors.warm} />
              </View>
              <Text style={[styles.gentleText, { color: theme.isDark ? '#F4ECDF' : theme.colors.textPrimary }]}>
                Every reroute is a small win. You're building the habit of coming back.
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.emptyBlock}>
            <Text style={[styles.emptyText, { color: theme.colors.textTertiary }]}>
              Complete a session this week to generate your report.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCell({ value, label, theme, accent, small }: {
  value: string;
  label: string;
  theme: ReturnType<typeof useTheme>;
  accent?: boolean;
  small?: boolean;
}) {
  return (
    <View style={styles.statCell}>
      <Text style={[
        small ? styles.statValueSmall : styles.statValue,
        { color: accent ? theme.colors.primaryLight : theme.colors.textPrimary },
      ]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
    </View>
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
  scroll: { paddingHorizontal: 20, paddingBottom: 48, gap: 16 },
  header: { gap: 4, paddingTop: 4 },
  title: { fontFamily: fonts.nunitoBold, fontSize: 26, letterSpacing: -0.3 },
  subtitle: { fontFamily: fonts.dmSansRegular, fontSize: 15 },
  chartHeader: { marginBottom: 8 },
  sectionLabel: { fontFamily: fonts.dmSansMedium, fontSize: 11, letterSpacing: 0.6, marginBottom: 16 },
  statGrid: { flexDirection: 'row', gap: 8 },
  statCell: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontFamily: fonts.nunitoExtraLight, fontSize: 36, letterSpacing: -1, lineHeight: 40 },
  statValueSmall: { fontFamily: fonts.nunitoBold, fontSize: 15, lineHeight: 22, textAlign: 'center' },
  statLabel: { fontFamily: fonts.dmSansRegular, fontSize: 11, textAlign: 'center' },
  highlight: {
    padding: 18,
    borderRadius: 14,
    borderLeftWidth: 3,
    gap: 6,
  },
  highlightLabel: { fontFamily: fonts.dmSansMedium, fontSize: 10, letterSpacing: 0.6 },
  highlightText: { fontFamily: fonts.nunitoSemiBold, fontSize: 15, lineHeight: 22 },
  gentleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
  },
  leafWrap: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  gentleText: { fontFamily: fonts.nunitoMedium, fontSize: 14, lineHeight: 20, flex: 1 },
  emptyBlock: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { fontFamily: fonts.dmSansRegular, fontSize: 15, textAlign: 'center' },
});
