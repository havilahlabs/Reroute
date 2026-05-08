import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { useUserStore } from '../store/useUserStore';
import { useSubscription } from '../hooks/useSubscription';
import { useThemeStore, AppearanceMode } from '../store/useThemeStore';
import { Card } from '../components/Card';
import { Toggle } from '../components/Toggle';
import { SegmentedControl } from '../components/SegmentedControl';
import { StorageService } from '../services/StorageService';
import { PermissionService } from '../services/PermissionService';
import { SubscriptionService } from '../services/SubscriptionService';
import { MainStackParamList } from '../navigation/MainNavigator';
import {
  IconStar, IconBell, IconCalendar,
  IconLock, IconShield, IconHelp, IconChevronRight,
} from '../components/icons';
import { fonts } from '../theme';

type Nav = NativeStackNavigationProp<MainStackParamList>;

const APPEARANCE_OPTIONS: AppearanceMode[] = ['light', 'dark', 'auto'];

export function SettingsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const { user, updateUser } = useUserStore();
  const { isPro, setSubscription } = useSubscription();
  const { appearanceMode, setAppearanceMode } = useThemeStore();
  const [notifGranted, setNotifGranted] = useState(false);

  const appearanceIdx = APPEARANCE_OPTIONS.indexOf(appearanceMode);

  useEffect(() => {
    PermissionService.getPermissionState().then(p => setNotifGranted(p.notifications));
  }, []);

  const handleNotifToggle = () => {
    // Permissions can only be granted/revoked from system settings on iOS/Android
    Linking.openSettings();
  };

  const handleSupport = () => {
    Linking.openURL('mailto:hello@reroute.app?subject=Reroute%20Support');
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Delete all data?',
      'This will permanently delete all your focus data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          await StorageService.deleteAllData();
          Alert.alert('Done', 'All data has been deleted.');
        }},
      ]
    );
  };

  const handleRestore = async () => {
    const sub = await SubscriptionService.restorePurchases();
    setSubscription(sub);
    Alert.alert('Restored', `Subscription status: ${sub.status}`);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Account */}
        <SettingsSection label="Account">
          <SettingsRow
            icon={<IconStar size={18} color={theme.colors.primaryLight} />}
            iconBg={theme.isDark ? 'rgba(124,111,205,0.18)' : 'rgba(124,111,205,0.1)'}
            label="Subscription"
            sublabel={isPro ? 'Pro — thank you!' : 'Free plan · upgrade for unlimited routines'}
            sublabelColor={isPro ? theme.colors.success : theme.colors.primaryLight}
            onPress={() => navigation.navigate('Paywall')}
            theme={theme}
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection label="Notifications">
          <SettingsToggle icon={<IconBell size={18} color={theme.colors.textSecondary} />} label="Gentle reminders" value={user?.gentleReminderEnabled ?? true} onToggle={v => updateUser({ gentleReminderEnabled: v })} theme={theme} />
          <SettingsToggle icon={<IconCalendar size={18} color={theme.colors.textSecondary} />} label="Routine reminders" value={notifGranted} onToggle={handleNotifToggle} theme={theme} />
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection label="Appearance">
          <View style={styles.segmentWrapper}>
            <SegmentedControl
              options={['Light', 'Dark', 'Auto']}
              selectedIndex={appearanceIdx}
              onChange={(idx) => setAppearanceMode(APPEARANCE_OPTIONS[idx])}
            />
          </View>
        </SettingsSection>

        {/* Privacy */}
        <SettingsSection label="Privacy">
          <SettingsRow icon={<IconLock size={18} color={theme.colors.textSecondary} />} label="Privacy policy" onPress={() => navigation.navigate('Privacy')} theme={theme} />
          <SettingsRow icon={<IconShield size={18} color={theme.colors.textSecondary} />} label="App permissions" onPress={() => navigation.navigate('PermissionOnboarding')} theme={theme} />
          <SettingsRow icon={<IconHelp size={18} color={theme.colors.textSecondary} />} label="Support & help" onPress={handleSupport} theme={theme} />
        </SettingsSection>

        {/* Developer */}
        <SettingsSection label="Developer & demo">
          <SettingsRow label="Simulate blocked app" onPress={() => navigation.navigate('DemoBlocking')} theme={theme} />
          <SettingsRow label="Reset onboarding" onPress={() => updateUser({ onboardingComplete: false })} theme={theme} />
          <SettingsRow label="Restore purchases" onPress={handleRestore} theme={theme} />
          <SettingsRow label="Delete all data" onPress={handleDeleteData} theme={theme} labelColor={theme.colors.danger} />
        </SettingsSection>

        <Text style={[styles.version, { color: theme.colors.textTertiary }]}>Reroute v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsSection({ label, children }: { label: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary }]}>{label.toUpperCase()}</Text>
      <Card padding="none" style={{ overflow: 'hidden' }}>
        {children}
      </Card>
    </View>
  );
}

function SettingsRow({ icon, iconBg, label, sublabel, sublabelColor, onPress, labelColor, theme }: {
  icon?: React.ReactNode;
  iconBg?: string;
  label: string;
  sublabel?: string;
  sublabelColor?: string;
  onPress: () => void;
  labelColor?: string;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.row, { borderBottomColor: theme.colors.border }]} activeOpacity={0.7}>
      {icon && (
        <View style={[styles.iconWrap, { backgroundColor: iconBg ?? theme.colors.surfaceAlt }]}>
          {icon}
        </View>
      )}
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, { color: labelColor ?? theme.colors.textPrimary }]}>{label}</Text>
        {sublabel && <Text style={[styles.rowSublabel, { color: sublabelColor ?? theme.colors.textTertiary }]}>{sublabel}</Text>}
      </View>
      <IconChevronRight size={16} color={theme.colors.textTertiary} />
    </TouchableOpacity>
  );
}

function SettingsToggle({ icon, label, value, onToggle, theme }: {
  icon?: React.ReactNode;
  label: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={[styles.row, { borderBottomColor: theme.colors.border }]}>
      {icon && (
        <View style={[styles.iconWrap, { backgroundColor: theme.colors.surfaceAlt }]}>
          {icon}
        </View>
      )}
      <Text style={[styles.rowLabel, { color: theme.colors.textPrimary, flex: 1 }]}>{label}</Text>
      <Toggle value={value} onToggle={onToggle} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  title: { fontFamily: fonts.nunitoBold, fontSize: 26, letterSpacing: -0.3 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, gap: 8 },
  section: { gap: 8 },
  sectionLabel: { fontFamily: fonts.dmSansMedium, fontSize: 11, letterSpacing: 0.6, paddingLeft: 4 },
  segmentWrapper: { padding: 12 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  iconWrap: { width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  rowText: { flex: 1, gap: 2 },
  rowLabel: { fontFamily: fonts.nunitoSemiBold, fontSize: 15 },
  rowSublabel: { fontFamily: fonts.dmSansRegular, fontSize: 12 },
  version: { fontFamily: fonts.dmSansRegular, fontSize: 12, textAlign: 'center', paddingTop: 8 },
});
