import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, fonts } from '../theme';
import { IconHome, IconRoutine, IconInsights, IconSettings } from '../components/icons';

import { HomeScreen } from '../screens/HomeScreen';
import { RoutinesScreen } from '../screens/RoutinesScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TodaysRouteScreen } from '../screens/TodaysRouteScreen';
import { StartSessionScreen } from '../screens/StartSessionScreen';
import { ActiveSessionScreen } from '../screens/ActiveSessionScreen';
import { DriftRerouteScreen } from '../screens/DriftRerouteScreen';
import { TemporaryUnlockScreen } from '../screens/TemporaryUnlockScreen';
import { EndSessionScreen } from '../screens/EndSessionScreen';
import { RoutineDetailScreen } from '../screens/RoutineDetailScreen';
import { WeeklyReportScreen } from '../screens/WeeklyReportScreen';
import { PaywallScreen } from '../screens/PaywallScreen';
import { PrivacyScreen } from '../screens/PrivacyScreen';
import { PermissionOnboardingScreen } from '../screens/PermissionOnboardingScreen';
import { DemoBlockingScreen } from '../screens/DemoBlockingScreen';
import { FocusSession } from '../models';

export type MainStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  TodaysRoute: undefined;
  StartSession: { routineId?: string };
  ActiveSession: { sessionId: string };
  DriftReroute: { sessionId: string; driftEventId: string; appName?: string };
  TemporaryUnlock: { sessionId: string; unlockEventId: string; reason: string };
  EndSession: { session: FocusSession };
  RoutineDetail: { routineId: string };
  WeeklyReport: undefined;
  Paywall: undefined;
  Privacy: undefined;
  PermissionOnboarding: undefined;
  DemoBlocking: undefined;
};

export type TabParamList = {
  Home: undefined;
  Routines: undefined;
  Insights: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarLabelStyle: {
          fontFamily: fonts.dmSansMedium,
          fontSize: 11,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 4,
          height: 60,
        },
        tabBarIcon: ({ color, size }) => {
          const iconMap = {
            Home: IconHome,
            Routines: IconRoutine,
            Insights: IconInsights,
            Settings: IconSettings,
          } as const;
          const IconComponent = iconMap[route.name as keyof typeof iconMap];
          return IconComponent ? <IconComponent size={size} color={color} /> : null;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Routines" component={RoutinesScreen} options={{ title: 'Routines' }} />
      <Tab.Screen name="Insights" component={InsightsScreen} options={{ title: 'Insights' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}

export function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="TodaysRoute" component={TodaysRouteScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="StartSession" component={StartSessionScreen} options={{ presentation: 'modal', fullScreenGestureEnabled: true }} />
      <Stack.Screen name="ActiveSession" component={ActiveSessionScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="DriftReroute" component={DriftRerouteScreen} options={{ presentation: 'modal', gestureEnabled: false }} />
      <Stack.Screen name="TemporaryUnlock" component={TemporaryUnlockScreen} options={{ presentation: 'modal', gestureEnabled: false }} />
      <Stack.Screen name="EndSession" component={EndSessionScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="RoutineDetail" component={RoutineDetailScreen} />
      <Stack.Screen name="WeeklyReport" component={WeeklyReportScreen} />
      <Stack.Screen name="Paywall" component={PaywallScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="PermissionOnboarding" component={PermissionOnboardingScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="DemoBlocking" component={DemoBlockingScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
