import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { useInsightStore } from '../store/useInsightStore';
import { PrimaryButton } from '../components/PrimaryButton';
import { fonts } from '../theme';

const STARTERS = [
  'Study for 30 minutes',
  'Write one page',
  'Finish proposal',
  'Read one chapter',
  'Sleep without scrolling',
];

export function TodaysRouteScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { todaysRoute, setTodaysRoute, clearTodaysRoute } = useInsightStore();
  const [text, setText] = useState(todaysRoute ?? '');

  const handleSave = async () => {
    if (!text.trim()) return;
    await setTodaysRoute(text.trim());
    navigation.goBack();
  };

  const handleClear = async () => {
    await clearTodaysRoute();
    setText('');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.cancel, { color: theme.colors.textSecondary }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: theme.colors.textPrimary }]}>Today's Route</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.headline, { color: theme.colors.textPrimary }]}>
          What is the one thing you want to protect today?
        </Text>

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="e.g. Study for 30 minutes"
          placeholderTextColor={theme.colors.textTertiary}
          multiline
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              borderColor: text ? theme.colors.primary : theme.colors.border,
              color: theme.colors.textPrimary,
              borderRadius: 16,
            },
          ]}
          autoFocus
          returnKeyType="done"
        />

        <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary }]}>
          QUICK STARTERS
        </Text>
        <View style={styles.chips}>
          {STARTERS.map(s => (
            <TouchableOpacity
              key={s}
              onPress={() => setText(s)}
              style={[
                styles.chip,
                {
                  backgroundColor: text === s
                    ? (theme.isDark ? 'rgba(124,111,205,0.18)' : 'rgba(124,111,205,0.1)')
                    : theme.colors.surfaceAlt,
                  borderColor: text === s ? theme.colors.primaryLight : 'transparent',
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.chipText, { color: text === s ? theme.colors.primaryLight : theme.colors.textSecondary }]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {todaysRoute && (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <Text style={[styles.clearText, { color: theme.colors.danger }]}>Clear today's route</Text>
          </TouchableOpacity>
        )}
        <PrimaryButton label="Set today's route" onPress={handleSave} disabled={!text.trim()} />
      </View>
    </SafeAreaView>
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
  cancel: { fontFamily: fonts.dmSansMedium, fontSize: 15 },
  navTitle: { fontFamily: fonts.nunitoBold, fontSize: 17 },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, gap: 20 },
  headline: {
    fontFamily: fonts.nunitoBold,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.2,
  },
  input: {
    borderWidth: 1.5,
    padding: 16,
    fontFamily: fonts.nunitoSemiBold,
    fontSize: 17,
    lineHeight: 26,
    minHeight: 80,
  },
  sectionLabel: {
    fontFamily: fonts.dmSansMedium,
    fontSize: 11,
    letterSpacing: 0.6,
    paddingLeft: 2,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
  },
  chipText: { fontFamily: fonts.dmSansRegular, fontSize: 14 },
  footer: { paddingHorizontal: 20, paddingBottom: 32, gap: 10, alignItems: 'center' },
  clearBtn: { paddingVertical: 8 },
  clearText: { fontFamily: fonts.dmSansMedium, fontSize: 14 },
});
