import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, Theme } from '../theme';
import { useThemeStore } from '../store/useThemeStore';

export function useTheme(): Theme {
  const systemScheme = useColorScheme();
  const { appearanceMode } = useThemeStore();

  const isDark =
    appearanceMode === 'dark' ||
    (appearanceMode === 'auto' && systemScheme === 'dark');

  return (isDark ? darkTheme : lightTheme) as unknown as Theme;
}
