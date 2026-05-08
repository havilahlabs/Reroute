import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { useSessionStore } from '../store/useSessionStore';
import { useInsightStore } from '../store/useInsightStore';
import { useUserStore } from '../store/useUserStore';
import { SessionService } from '../services/SessionService';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { Card } from '../components/Card';
import { MainStackParamList } from '../navigation/MainNavigator';
import { getGreeting } from '../utils/formatTime';
import { IconLogo, IconRoutine, IconLeaf } from '../components/icons';
import { fonts } from '../theme';

type Nav = NativeStackNavigationProp<MainStackParamList>;

export function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const { sessionHistory, loadSessionHistory, setActiveSession } = useSessionStore();
  const { todaysRoute, insights, loadInsights, loadTodaysRoute } = useInsightStore();
  const { user } = useUserStore();

  useEffect(() => {
    loadSessionHistory();
    loadInsights();
    loadTodaysRoute();
    // Resume any active session that survived an app restart
    SessionService.resumeSession().then(session => {
      if (session) {
        setActiveSession(session);
        navigation.navigate('ActiveSession', { sessionId: session.id });
      }
    });
  }, []);

  const today = new Date().toDateString();
  const todaysSessions = sessionHistory.filter(
    s => new Date(s.startedAt).toDateString() === today && s.status === 'completed'
  );
  const todaysMinutes = todaysSessions.reduce((sum, s) => sum + s.completedFocusMinutes, 0);
  const todaysReroutes = todaysSessions.reduce((sum, s) => sum + s.rerouteCount, 0);

  const distractionCounts: Record<string, number> = {};
  todaysSessions.forEach(s =>
    s.distractionReasons.forEach(r => {
      distractionCounts[r] = (distractionCounts[r] ?? 0) + 1;
    })
  );
  const mainDistraction = Object.entries(distractionCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? '—';
  const topInsight = insights[0];

  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={[styles.dateLabel, { color: theme.colors.textTertiary }]}>{dateLabel}</Text>
          <Text style={[styles.greeting, { color: theme.colors.textPrimary }]}>{getGreeting(user?.firstName)}</Text>
        </View>

        {/* Today's Route card */}
        <TouchableOpacity onPress={() => navigation.navigate('TodaysRoute')} activeOpacity={0.85}>
          <Card style={[styles.routeCard, {
            backgroundColor: todaysRoute
              ? (theme.isDark ? 'rgba(124,111,205,0.1)' : 'rgba(124,111,205,0.06)')
              : theme.colors.surface,
            borderColor: todaysRoute ? 'rgba(169,159,224,0.3)' : theme.colors.border,
            borderStyle: todaysRoute ? 'solid' : 'dashed',
          }]} padding="none">
            <View style={styles.routeCardInner}>
              <View style={styles.routeTop}>
                <Text style={[styles.routeLabel, { color: todaysRoute ? theme.colors.primaryLight : theme.colors.textTertiary }]}>
                  Today's Route
                </Text>
                <Text style={[styles.routeEdit, { color: theme.colors.textTertiary }]}>
                  {todaysRoute ? 'Edit' : 'Set →'}
                </Text>
              </View>
              <Text style={[
                todaysRoute ? styles.routeText : styles.routePrompt,
                { color: todaysRoute ? theme.colors.textPrimary : theme.colors.primary },
              ]} numberOfLines={2}>
                {todaysRoute ?? 'Set your focus intention for today'}
              </Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* CTAs */}
        <View style={styles.ctas}>
          <PrimaryButton
            label="Start focus session"
            onPress={() => navigation.navigate('StartSession', {})}
            style={styles.mainCta}
            icon={<IconLogo size={18} color="#fff" />}
          />
          <SecondaryButton
            label="Start from routine"
            onPress={() => navigation.navigate('Tabs', { screen: 'Routines' })}
            icon={<IconRoutine size={18} color={theme.colors.textSecondary} />}
          />
        </View>

        {/* Today's stats */}
        {todaysSessions.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary }]}>Today's focus</Text>
            <Card padding="lg">
              <View style={styles.statGrid}>
                <StatCell value={String(todaysSessions.length)} label="sessions" theme={theme} />
                <StatCell value={`${todaysMinutes}m`} label="focused" theme={theme} />
                <StatCell value={String(todaysReroutes)} label="reroutes" theme={theme} accent />
                <StatCell value={mainDistraction} label="main drift" theme={theme} small />
              </View>
            </Card>
          </View>
        )}

        {todaysSessions.length === 0 && (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: theme.colors.textTertiary }]}>No sessions yet today.</Text>
            <Text style={[styles.emptyHint, { color: theme.colors.textTertiary }]}>Start your first focus session.</Text>
          </View>
        )}

        {/* Insight */}
        {topInsight && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary }]}>Insight</Text>
            <Card variant="cream">
              <View style={styles.insightRow}>
                <View style={[styles.insightIcon, { backgroundColor: theme.isDark ? 'rgba(244,236,223,0.12)' : 'rgba(201,165,126,0.18)' }]}>
                  <IconLeaf size={18} color={theme.colors.warm} />
                </View>
                <Text style={[styles.insightText, { color: theme.isDark ? theme.colors.cream : theme.colors.textPrimary }]}>
                  {topInsight.message}
                </Text>
              </View>
            </Card>
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
    <View style={styles.stat}>
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
  scroll: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  header: { paddingTop: 8, gap: 2 },
  dateLabel: { fontFamily: fonts.dmSansMedium, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase' },
  greeting: { fontFamily: fonts.nunitoBold, fontSize: 26, letterSpacing: -0.3 },
  routeCard: { borderWidth: 1 },
  routeCardInner: { padding: 18, gap: 8 },
  routeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  routeLabel: { fontFamily: fonts.dmSansMedium, fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase' },
  routeEdit: { fontFamily: fonts.dmSansRegular, fontSize: 12 },
  routeText: { fontFamily: fonts.nunitoBold, fontSize: 17, lineHeight: 24 },
  routePrompt: { fontFamily: fonts.nunitoSemiBold, fontSize: 15 },
  ctas: { gap: 10 },
  mainCta: { width: '100%' },
  section: { gap: 10 },
  sectionLabel: { fontFamily: fonts.dmSansMedium, fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', paddingLeft: 4 },
  statGrid: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontFamily: fonts.nunitoExtraLight, fontSize: 36, letterSpacing: -1, lineHeight: 40 },
  statValueSmall: { fontFamily: fonts.nunitoBold, fontSize: 15, lineHeight: 22, textAlign: 'center' },
  statLabel: { fontFamily: fonts.dmSansRegular, fontSize: 11, textAlign: 'center' },
  empty: { paddingVertical: 24, gap: 4 },
  emptyText: { fontFamily: fonts.dmSansRegular, fontSize: 15, textAlign: 'center' },
  emptyHint: { fontFamily: fonts.dmSansRegular, fontSize: 13, textAlign: 'center' },
  insightRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  insightIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  insightText: { fontFamily: fonts.nunitoMedium, fontSize: 15, lineHeight: 22, flex: 1 },
});
