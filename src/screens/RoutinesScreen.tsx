import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { useRoutineStore } from '../store/useRoutineStore';
import { useSessionStore } from '../store/useSessionStore';
import { useSubscription } from '../hooks/useSubscription';
import { RoutineCard } from '../components/RoutineCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { EmptyState } from '../components/EmptyState';
import { OptionChip } from '../components/OptionChip';
import { Card } from '../components/Card';
import { RoutineService } from '../services/RoutineService';
import { AnalyticsService } from '../services/AnalyticsService';
import { generateId } from '../utils/generateId';
import { Routine, RoutineMode, StrictnessLevel } from '../models';
import { MainStackParamList } from '../navigation/MainNavigator';
import { IconPlus, IconStar, IconClose } from '../components/icons';
import { fonts } from '../theme';

type Nav = NativeStackNavigationProp<MainStackParamList>;

const MODES: { id: RoutineMode; label: string; emoji: string }[] = [
  { id: 'study', label: 'Study', emoji: '📚' },
  { id: 'work', label: 'Work', emoji: '💼' },
  { id: 'writing', label: 'Writing', emoji: '✍️' },
  { id: 'bedtime', label: 'Bedtime', emoji: '🌙' },
  { id: 'custom', label: 'Custom', emoji: '⚡' },
];

export function RoutinesScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const { routines, loadRoutines, addRoutine } = useRoutineStore();
  const { setDraft } = useSessionStore();
  const { isPro } = useSubscription();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [taskTemplate, setTaskTemplate] = useState('');
  const [duration, setDuration] = useState(25);
  const [mode, setMode] = useState<RoutineMode>('custom');
  const [strictness, setStrictness] = useState<StrictnessLevel>('balanced');

  useEffect(() => { loadRoutines(); }, []);

  const canCreate = isPro || routines.length === 0;

  const handleCreate = async () => {
    if (!name.trim() || !canCreate) return;
    const now = new Date().toISOString();
    await addRoutine({
      id: generateId(),
      name: name.trim(),
      taskTemplate: taskTemplate.trim() || name.trim(),
      defaultDurationMinutes: duration,
      defaultDistractions: [],
      defaultReroutePlan: 'Take one breath and continue',
      isEnabled: true,
      mode,
      strictness,
      notificationEnabled: false,
      createdAt: now,
      updatedAt: now,
    });
    await AnalyticsService.track('routine_created');
    setShowCreate(false);
    setName(''); setTaskTemplate(''); setDuration(25); setMode('custom'); setStrictness('balanced');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Routines</Text>
        {canCreate && (
          <TouchableOpacity
            onPress={() => setShowCreate(true)}
            style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}
          >
            <IconPlus size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Preset focus modes for recurring situations.
        </Text>

        {routines.length === 0 ? (
          <EmptyState
            headline="No routines yet."
            subtext="Create a preset to quickly start your most common focus modes."
            ctaLabel="Create routine"
            onCta={() => setShowCreate(true)}
          />
        ) : (
          <View style={styles.list}>
            {routines.map(r => (
              <RoutineCard
                key={r.id}
                routine={r}
                onPress={() => navigation.navigate('RoutineDetail', { routineId: r.id })}
                onStart={async () => {
                  const data = await RoutineService.startRoutineSession(r);
                  setDraft({
                    task: data.task,
                    durationMinutes: data.durationMinutes,
                    selectedDistractions: data.selectedDistractions,
                    reroutePlan: data.reroutePlan,
                  });
                  navigation.navigate('StartSession', { routineId: r.id });
                }}
              />
            ))}
          </View>
        )}

        {!isPro && (
          <TouchableOpacity onPress={() => navigation.navigate('Paywall')} activeOpacity={0.85}>
            <View style={[styles.upgradeBanner, {
              backgroundColor: theme.isDark ? 'rgba(244,162,97,0.08)' : 'rgba(244,162,97,0.06)',
              borderColor: 'rgba(244,162,97,0.3)',
            }]}>
              <IconStar size={16} color={theme.colors.warning} />
              <Text style={[styles.upgradeText, { color: theme.colors.warning }]}>
                Free includes one routine.{' '}
                <Text style={[styles.upgradeLink, { color: theme.colors.textPrimary }]}>
                  Upgrade for unlimited →
                </Text>
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal visible={showCreate} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreate(false)}>
              <IconClose size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>New routine</Text>
            <TouchableOpacity onPress={handleCreate} disabled={!name.trim()}>
              <Text style={[styles.saveBtn, { color: name.trim() ? theme.colors.primary : theme.colors.textTertiary }]}>Save</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
            <FormField label="Name">
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Deep Work"
                placeholderTextColor={theme.colors.textTertiary}
                style={[styles.textInput, { backgroundColor: theme.colors.surfaceAlt, color: theme.colors.textPrimary, borderRadius: theme.radius.lg }]}
              />
            </FormField>
            <FormField label="Default intention">
              <TextInput
                value={taskTemplate}
                onChangeText={setTaskTemplate}
                placeholder="Work on {task} — one section at a time."
                placeholderTextColor={theme.colors.textTertiary}
                style={[styles.textInput, { backgroundColor: theme.colors.surfaceAlt, color: theme.colors.textPrimary, borderRadius: theme.radius.lg }]}
              />
            </FormField>
            <FormField label="Mode">
              <View style={styles.chips}>
                {MODES.map(m => (
                  <OptionChip key={m.id} label={`${m.emoji} ${m.label}`} selected={mode === m.id} onPress={() => setMode(m.id)} />
                ))}
              </View>
            </FormField>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label.toUpperCase()}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  title: { fontFamily: fonts.nunitoBold, fontSize: 26, letterSpacing: -0.3 },
  addBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  subtitle: { fontFamily: fonts.dmSansRegular, fontSize: 15, lineHeight: 22, marginBottom: 4 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, gap: 12 },
  list: { gap: 12 },
  upgradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 4,
  },
  upgradeText: { fontFamily: fonts.dmSansRegular, fontSize: 13, flex: 1 },
  upgradeLink: { fontFamily: fonts.dmSansBold },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  modalTitle: { fontFamily: fonts.nunitoBold, fontSize: 17 },
  saveBtn: { fontFamily: fonts.dmSansBold, fontSize: 15 },
  modalContent: { padding: 20, gap: 20 },
  formField: { gap: 10 },
  formLabel: { fontFamily: fonts.dmSansMedium, fontSize: 11, letterSpacing: 0.6, color: '#9896AA' },
  textInput: { padding: 14, fontFamily: fonts.dmSansRegular, fontSize: 15 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
