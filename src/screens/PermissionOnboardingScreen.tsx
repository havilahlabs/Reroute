import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { PermissionService } from '../services/PermissionService';
import { IconShield, IconLock, IconCheck } from '../components/icons';
import { fonts } from '../theme';

const IOS_STEPS = [
  'Screen Time must be enabled on your device',
  'Reroute requests access to shield selected apps',
  'You choose exactly which apps to protect',
  'Protection is only active during your sessions',
];

const ANDROID_STEPS = [
  'Usage Access lets Reroute detect which app is open',
  'Accessibility Service enables stronger interruption',
  'Only used during active focus sessions',
  'You can revoke permissions at any time',
];

export function PermissionOnboardingScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [requested, setRequested] = useState(false);

  const isIOS = Platform.OS === 'ios';
  const steps = isIOS ? IOS_STEPS : ANDROID_STEPS;

  const handleEnable = async () => {
    await PermissionService.requestBlockingPermission();
    setRequested(true);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.heroIcon, { backgroundColor: theme.isDark ? 'rgba(124,111,205,0.15)' : 'rgba(124,111,205,0.1)' }]}>
            {isIOS
              ? <IconLock size={32} color={theme.colors.primaryLight} />
              : <IconShield size={32} color={theme.colors.primaryLight} />
            }
          </View>
          <Text style={[styles.heroTitle, { color: theme.colors.textPrimary }]}>
            {isIOS ? 'Enable app protection' : 'Enable app detection'}
          </Text>
          <Text style={[styles.heroSub, { color: theme.colors.textSecondary }]}>
            {PermissionService.getPermissionExplanation()}
          </Text>
        </View>

        {/* Steps */}
        <View style={[styles.stepsCard, { backgroundColor: theme.colors.surfaceAlt }]}>
          {steps.map((step, i) => (
            <View key={i} style={[styles.step, i < steps.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.border }]}>
              <View style={[styles.stepNum, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {!requested ? (
            <TouchableOpacity
              onPress={handleEnable}
              style={[styles.primaryBtn, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={styles.primaryBtnText}>{PermissionService.getPermissionCTA()}</Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.grantedCard, {
              backgroundColor: theme.isDark ? 'rgba(125,211,166,0.1)' : 'rgba(125,211,166,0.12)',
              borderColor: 'rgba(125,211,166,0.3)',
            }]}>
              <IconCheck size={18} color={theme.colors.success} />
              <Text style={[styles.grantedText, { color: theme.colors.success }]}>
                Permission requested. Running in demo mode until granted.
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.secondaryBtn, { backgroundColor: theme.colors.surfaceAlt }]}
          >
            <Text style={[styles.secondaryBtnText, { color: theme.colors.textPrimary }]}>
              Use demo mode instead
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 40, gap: 24 },
  hero: { alignItems: 'center', gap: 12 },
  heroIcon: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  heroTitle: { fontFamily: fonts.nunitoBold, fontSize: 24, letterSpacing: -0.3, textAlign: 'center' },
  heroSub: { fontFamily: fonts.dmSansRegular, fontSize: 15, lineHeight: 22, textAlign: 'center' },
  stepsCard: { borderRadius: 16, overflow: 'hidden' },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, padding: 16 },
  stepNum: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  stepNumText: { fontFamily: fonts.dmSansBold, fontSize: 12, color: '#fff' },
  stepText: { fontFamily: fonts.dmSansRegular, fontSize: 14, lineHeight: 20, flex: 1 },
  actions: { gap: 10, marginTop: 'auto' as any, paddingBottom: 24 },
  primaryBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  primaryBtnText: { fontFamily: fonts.nunitoBold, fontSize: 17, color: '#fff' },
  secondaryBtn: { paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  secondaryBtnText: { fontFamily: fonts.nunitoSemiBold, fontSize: 16 },
  grantedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  grantedText: { fontFamily: fonts.dmSansRegular, fontSize: 14, lineHeight: 20, flex: 1 },
});
