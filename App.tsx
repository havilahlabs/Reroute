import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Nunito_200ExtraLight,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import {
  Fraunces_300Light,
  Fraunces_400Regular,
} from '@expo-google-fonts/fraunces';
import { RootNavigator } from './src/navigation';
import { StorageService } from './src/services/StorageService';
import { NotificationService } from './src/services/NotificationService';
import { SubscriptionService } from './src/services/SubscriptionService';
import { useUserStore } from './src/store/useUserStore';
import { useThemeStore } from './src/store/useThemeStore';
import { SplashScreen as BrandedSplashScreen } from './src/screens/SplashScreen';

SplashScreen.preventAutoHideAsync();
SubscriptionService.configure();

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const { loadUser } = useUserStore();
  const { loadAppearanceMode } = useThemeStore();

  const [fontsLoaded] = useFonts({
    Nunito_200ExtraLight,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    Fraunces_300Light,
    Fraunces_400Regular,
  });

  useEffect(() => {
    if (!fontsLoaded) return;
    async function prepare() {
      try {
        await StorageService.initialize();
        await Promise.all([loadUser(), loadAppearanceMode()]);
        await NotificationService.requestPermission();
      } catch (e) {
        console.warn('App init error:', e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded, loadUser]);

  if (!appReady || !fontsLoaded) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <BrandedSplashScreen />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
