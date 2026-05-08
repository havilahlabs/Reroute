import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { useSessionStore } from '../store/useSessionStore';
import { useInsightStore } from '../store/useInsightStore';
import { PrimaryButton } from '../components/PrimaryButton';
import { SegmentedControl } from '../components/SegmentedControl';
import { AppGlyph, APPS } from '../components/AppGlyph';
import { SessionService } from '../services/SessionService';
import { BlockingService } from '../services/BlockingService';
import { AnalyticsService } from '../services/AnalyticsService';
import { MainStackParamList } from '../navigation/MainNavigator';
import { fonts } from '../theme';

type Nav = NativeStackNavigationProp<MainStackParamList>;
type RouteT = RouteProp<MainStackParamList, 'StartSession'>;

const DURATION_OPTIONS = ['25 min', '45 min', '60 min', '90 min'];
const DURATION_VALUES = [25, 45, 60, 90];

const DISTRACTIONS = [
  { id: 'tiktok', name: 'TikTok' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'twitter', name: 'X' },
  { id: 'safari', name: 'Safari' },
  { id: 'messages', name: 'Messages' },
  { id: 'email', name: 'Email' },
  { id: 'reddit', name: 'Reddit' },
  { id: 'games', name: 'Games' },
  { id: 'other', name: 'Other' },
];

const REROUTE_PLANS = [
  'Take one breath and continue',
  'Read one paragraph',
  'Write one sentence',
  'Solve one question',
  'Open the document',
  'Put the phone down',
];

export function StartSessionScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteT>();
  const { draft, setDraft, clearDraft, setActiveSession } = useSessionStore();
  const { todaysRoute } = useInsightStore();

  const [step, setStep] = useState(1);
  const [task, setTask] = useState(draft.task ?? '');
  const draftDurationIdx = DURATION_VALUES.indexOf(draft.durationMinutes ?? 25);
  const [durationIdx, setDurationIdx] = useState(draftDurationIdx >= 0 ? draftDurationIdx : 0);
  const [customDuration, setCustomDuration] = useState(
    draftDurationIdx < 0 && draft.durationMinutes ? String(draft.durationMinutes) : ''
  );
  const [useCustom, setUseCustom] = useState(draftDurationIdx < 0 && !!draft.durationMinutes);
  const [distractions, setDistractions] = useState<string[]>(draft.selectedDistractions ?? []);
  const [reroutePlan, setReroutePlan] = useState(draft.reroutePlan ?? '');
  const [customPlan, setCustomPlan] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const parsedCustom = parseInt(customDuration) || 25;
  const clampedCustom = Math.min(240, Math.max(5, parsedCustom));
  const finalDuration = useCustom ? clampedCustom : DURATION_VALUES[durationIdx];
  const finalPlan = reroutePlan || customPlan;

  const toggleDistraction = (id: string) => {
    setDistractions(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const canGoNext = () => {
    if (step === 1) return task.trim().length > 0;
    if (step === 2) return distractions.length > 0;
    if (step === 3) return finalPlan.trim().length > 0;
    return true;
  };

  const goBack = () => {
    if (step === 1) navigation.goBack();
    else setStep(s => s - 1);
  };

  const handleBegin = async () => {
    if (!task.trim() || !finalPlan.trim() || distractions.length === 0) return;
    setIsStarting(true);
    try {
      const session = await SessionService.startSession({
        task: task.trim(),
        durationMinutes: finalDuration,
        selectedDistractions: distractions,
        reroutePlan: finalPlan.trim(),
        routineId: route.params?.routineId,
      });
      await BlockingService.startProtection(session.id, distractions);
      setActiveSession(session);
      clearDraft();
      await AnalyticsService.track('session_started', { duration: finalDuration });
      navigation.replace('ActiveSession', { sessionId: session.id });
    } catch (e) {
      Alert.alert('Could not start session', 'Something went wrong. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  const todaysIntention = todaysRoute ?? null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={goBack}>
            <Text style={[styles.navBtn, { color: theme.colors.textSecondary }]}>
              {step === 1 ? 'Cancel' : 'Back'}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.stepLabel, { color: theme.colors.textTertiary }]}>
            Step {step} of 3
          </Text>
          <View style={{ width: 56 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 1 && (
            <View style={styles.stepContent}>
              <Text style={[styles.headline, { color: theme.colors.textPrimary }]}>
                What are you focusing on?
              </Text>
              <TextInput
                value={task}
                onChangeText={setTask}
                placeholder="e.g. Finish biology notes"
                placeholderTextColor={theme.colors.textTertiary}
                multiline
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: task ? theme.colors.primary : theme.colors.border,
                    color: theme.colors.textPrimary,
                  },
                ]}
                autoFocus
              />

              {todaysIntention && (
                <TouchableOpacity
                  onPress={() => setTask(todaysIntention)}
                  style={[styles.suggestionCard, {
                    backgroundColor: theme.isDark ? 'rgba(124,111,205,0.1)' : 'rgba(124,111,205,0.06)',
                    borderColor: 'rgba(169,159,224,0.3)',
                  }]}
                >
                  <Text style={[styles.suggestionLabel, { color: theme.colors.primaryLight }]}>
                    TODAY'S ROUTE
                  </Text>
                  <Text style={[styles.suggestionText, { color: theme.colors.textPrimary }]}>
                    {todaysIntention}
                  </Text>
                </TouchableOpacity>
              )}

              <View style={styles.durationSection}>
                <Text style={[styles.fieldLabel, { color: theme.colors.textTertiary }]}>HOW LONG?</Text>
                <SegmentedControl
                  options={DURATION_OPTIONS}
                  selectedIndex={useCustom ? -1 : durationIdx}
                  onChange={i => { setDurationIdx(i); setUseCustom(false); }}
                />
                <TouchableOpacity
                  onPress={() => setUseCustom(true)}
                  style={[
                    styles.customDurationBtn,
                    {
                      borderColor: useCustom ? theme.colors.primary : theme.colors.border,
                      backgroundColor: useCustom ? (theme.isDark ? 'rgba(124,111,205,0.1)' : 'rgba(124,111,205,0.06)') : 'transparent',
                    },
                  ]}
                >
                  {useCustom ? (
                    <TextInput
                      value={customDuration}
                      onChangeText={setCustomDuration}
                      placeholder="Enter minutes"
                      placeholderTextColor={theme.colors.textTertiary}
                      keyboardType="number-pad"
                      style={[styles.customInput, { color: theme.colors.textPrimary }]}
                      autoFocus
                    />
                  ) : (
                    <Text style={[styles.customLabel, { color: theme.colors.textTertiary }]}>
                      + Custom duration
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContent}>
              <Text style={[styles.headline, { color: theme.colors.textPrimary }]}>
                What might distract you?
              </Text>
              <Text style={[styles.subtext, { color: theme.colors.textSecondary }]}>
                Select apps to protect against.
              </Text>
              <View style={styles.appGrid}>
                {DISTRACTIONS.map(d => {
                  const selected = distractions.includes(d.id);
                  return (
                    <TouchableOpacity
                      key={d.id}
                      onPress={() => toggleDistraction(d.id)}
                      style={[
                        styles.appChip,
                        {
                          backgroundColor: selected
                            ? (theme.isDark ? 'rgba(124,111,205,0.18)' : 'rgba(124,111,205,0.1)')
                            : theme.colors.surfaceAlt,
                          borderColor: selected ? theme.colors.primaryLight : 'transparent',
                          borderWidth: 1.5,
                        },
                      ]}
                    >
                      <AppGlyph name={d.name} color={APPS[d.name]} size={28} />
                      <Text style={[styles.appChipLabel, { color: selected ? theme.colors.primaryLight : theme.colors.textSecondary }]}>
                        {d.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContent}>
              <Text style={[styles.headline, { color: theme.colors.textPrimary }]}>
                If you drift, what's your smallest step back?
              </Text>
              <Text style={[styles.subtext, { color: theme.colors.textSecondary }]}>
                A tiny first step makes rerouting easier.
              </Text>
              {REROUTE_PLANS.map(plan => (
                <TouchableOpacity
                  key={plan}
                  onPress={() => { setReroutePlan(plan); setCustomPlan(''); }}
                  style={[
                    styles.planRow,
                    {
                      backgroundColor: reroutePlan === plan
                        ? (theme.isDark ? 'rgba(124,111,205,0.15)' : 'rgba(124,111,205,0.08)')
                        : theme.colors.surfaceAlt,
                      borderColor: reroutePlan === plan ? theme.colors.primaryLight : 'transparent',
                      borderWidth: 1.5,
                    },
                  ]}
                >
                  <Text style={[styles.planText, { color: reroutePlan === plan ? theme.colors.primaryLight : theme.colors.textSecondary }]}>
                    {plan}
                  </Text>
                  {reroutePlan === plan && (
                    <View style={[styles.checkDot, { backgroundColor: theme.colors.primary }]} />
                  )}
                </TouchableOpacity>
              ))}
              <TextInput
                value={customPlan}
                onChangeText={t => { setCustomPlan(t); setReroutePlan(''); }}
                placeholder="Write your own..."
                placeholderTextColor={theme.colors.textTertiary}
                style={[
                  styles.customPlanInput,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: customPlan ? theme.colors.primary : theme.colors.border,
                    color: theme.colors.textPrimary,
                  },
                ]}
              />
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {step < 3 ? (
            <PrimaryButton label="Continue" onPress={() => setStep(s => s + 1)} disabled={!canGoNext()} />
          ) : (
            <PrimaryButton
              label="Begin session"
              onPress={handleBegin}
              loading={isStarting}
              disabled={!canGoNext() || isStarting}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  navBtn: { fontFamily: fonts.dmSansMedium, fontSize: 15 },
  stepLabel: { fontFamily: fonts.dmSansRegular, fontSize: 14 },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  stepContent: { gap: 20 },
  headline: {
    fontFamily: fonts.nunitoBold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  subtext: { fontFamily: fonts.dmSansRegular, fontSize: 15, lineHeight: 22, marginTop: -8 },
  input: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    fontFamily: fonts.nunitoSemiBold,
    fontSize: 17,
    lineHeight: 26,
    minHeight: 72,
  },
  suggestionCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  suggestionLabel: { fontFamily: fonts.dmSansMedium, fontSize: 10, letterSpacing: 0.6 },
  suggestionText: { fontFamily: fonts.nunitoSemiBold, fontSize: 15 },
  durationSection: { gap: 12 },
  fieldLabel: { fontFamily: fonts.dmSansMedium, fontSize: 11, letterSpacing: 0.6 },
  customDurationBtn: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  customLabel: { fontFamily: fonts.dmSansRegular, fontSize: 14 },
  customInput: { fontFamily: fonts.dmSansMedium, fontSize: 15, width: '100%', textAlign: 'center' },
  appGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  appChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  appChipLabel: { fontFamily: fonts.dmSansMedium, fontSize: 14 },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
  },
  planText: { fontFamily: fonts.nunitoSemiBold, fontSize: 15, flex: 1 },
  checkDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  customPlanInput: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    fontFamily: fonts.dmSansRegular,
    fontSize: 15,
    marginTop: 4,
  },
  footer: { paddingHorizontal: 20, paddingBottom: 32 },
});
