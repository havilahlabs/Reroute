import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { useRoutineStore } from '../store/useRoutineStore';
import { useSessionStore } from '../store/useSessionStore';
import { Card } from '../components/Card';
import { MainStackParamList } from '../navigation/MainNavigator';
import { RoutineService } from '../services/RoutineService';
import { formatDuration } from '../utils/formatTime';
import { fonts } from '../theme';

type Nav = NativeStackNavigationProp<MainStackParamList>;
type RouteT = RouteProp<MainStackParamList, 'RoutineDetail'>;

const MODE_EMOJI: Record<string, string> = {
  study: '📚',
  work: '💼',
  writing: '✍️',
  bedtime: '🌙',
  custom: '⚡',
};

export function RoutineDetailScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteT>();
  const { routines, deleteRoutine } = useRoutineStore();
  const { sessionHistory } = useSessionStore();

  const routine = routines.find(r => r.id === route.params.routineId);
  if (!routine) return null;

  const routineSessions = sessionHistory.filter(
    s => s.routineId === routine.id && s.status === 'completed'
  );
  const completionRate =
    routineSessions.length > 0
      ? Math.round(
          (routineSessions.filter(s => s.completedFocusMinutes >= s.durationMinutes * 0.8).length /
            routineSessions.length) * 100
        )
      : null;

  const handleDelete = () => {
    Alert.alert('Delete routine?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteRoutine(routine.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backBtn, { color: theme.colors.textSecondary }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: theme.colors.textPrimary }]}>{routine.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header card */}
        <View style={[styles.heroCard, {
          backgroundColor: theme.isDark ? 'rgba(124,111,205,0.1)' : 'rgba(124,111,205,0.06)',
          borderColor: 'rgba(169,159,224,0.3)',
        }]}>
          <Text style={styles.modeEmoji}>{MODE_EMOJI[routine.mode] ?? '⚡'}</Text>
          <Text style={[styles.heroName, { color: theme.colors.textPrimary }]}>{routine.name}</Text>
          <Text style={[styles.heroSub, { color: theme.colors.primaryLight }]}>
            {formatDuration(routine.defaultDurationMinutes)} · {routine.mode}
          </Text>
        </View>

        {/* Details */}
        <Card padding="none">
          <InfoRow label="Default intention" value={routine.taskTemplate} theme={theme} />
          <InfoRow label="Duration" value={formatDuration(routine.defaultDurationMinutes)} theme={theme} />
          <InfoRow label="Mode" value={routine.mode} theme={theme} />
          <InfoRow label="Strictness" value={routine.strictness} theme={theme} />
          <InfoRow label="Notifications" value={routine.notificationEnabled ? 'On' : 'Off'} theme={theme} last />
        </Card>

        {/* History */}
        {routineSessions.length > 0 && (
          <Card padding="lg">
            <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary }]}>SESSION HISTORY</Text>
            <View style={styles.historyGrid}>
              <HistoryStat value={String(routineSessions.length)} label="sessions" theme={theme} />
              {completionRate !== null && (
                <HistoryStat value={`${completionRate}%`} label="completion" theme={theme} accent />
              )}
            </View>
          </Card>
        )}

        {/* Start CTA */}
        <TouchableOpacity
          onPress={() => {
            RoutineService.startRoutineSession(routine);
            navigation.navigate('StartSession', { routineId: routine.id });
          }}
          style={[styles.startBtn, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={styles.startBtnText}>Start this routine</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Text style={[styles.deleteBtnText, { color: theme.colors.danger }]}>Delete routine</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value, theme, last }: {
  label: string;
  value: string;
  theme: ReturnType<typeof useTheme>;
  last?: boolean;
}) {
  return (
    <View style={[styles.infoRow, {
      borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    }]}>
      <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

function HistoryStat({ value, label, theme, accent }: {
  value: string;
  label: string;
  theme: ReturnType<typeof useTheme>;
  accent?: boolean;
}) {
  return (
    <View style={styles.historyStat}>
      <Text style={[styles.historyStatValue, { color: accent ? theme.colors.primaryLight : theme.colors.textPrimary }]}>
        {value}
      </Text>
      <Text style={[styles.historyStatLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
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
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 48, gap: 12 },
  heroCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    marginBottom: 4,
  },
  modeEmoji: { fontSize: 40, marginBottom: 4 },
  heroName: { fontFamily: fonts.nunitoBold, fontSize: 22, letterSpacing: -0.3 },
  heroSub: { fontFamily: fonts.dmSansMedium, fontSize: 14 },
  sectionLabel: { fontFamily: fonts.dmSansMedium, fontSize: 11, letterSpacing: 0.6, marginBottom: 16 },
  historyGrid: { flexDirection: 'row', gap: 24 },
  historyStat: { gap: 4 },
  historyStatValue: { fontFamily: fonts.nunitoExtraLight, fontSize: 40, letterSpacing: -1, lineHeight: 44 },
  historyStatLabel: { fontFamily: fonts.dmSansRegular, fontSize: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  infoLabel: { fontFamily: fonts.dmSansRegular, fontSize: 14 },
  infoValue: { fontFamily: fonts.nunitoSemiBold, fontSize: 14 },
  startBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 4 },
  startBtnText: { fontFamily: fonts.nunitoBold, fontSize: 17, color: '#fff' },
  deleteBtn: { alignItems: 'center', paddingVertical: 12 },
  deleteBtnText: { fontFamily: fonts.dmSansMedium, fontSize: 14 },
});
