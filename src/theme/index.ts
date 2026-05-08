import { TextStyle, ViewStyle } from 'react-native';

export const palette = {
  primary: '#7C6FCD',
  primaryLight: '#A99FE0',
  primaryDark: '#5D52A8',

  // Light mode
  background: '#F5F0EB',
  surface: '#FFFFFF',
  surfaceAlt: '#EDE8E3',
  border: '#DDD8D2',

  // Dark mode
  backgroundDark: '#1A1828',
  surfaceDark: '#252140',
  surfaceAltDark: '#2E2A4A',
  borderDark: '#3A3654',

  // Text light
  textPrimary: '#1A1828',
  textSecondary: '#5A5770',
  textTertiary: '#9896AA',

  // Text dark
  textPrimaryDark: '#E8E4F0',
  textSecondaryDark: '#9B97B0',
  textTertiaryDark: '#6A6680',

  // Accents
  cream: '#F4ECDF',
  warm: '#C9A57E',
  success: '#7DD3A6',
  warning: '#F4A261',
  danger: '#E76F51',

  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.15)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

// Font family constants — loaded in App.tsx via expo-google-fonts
export const fonts = {
  // Nunito — primary UI font (headings, labels, prominent text)
  nunitoRegular: 'Nunito_400Regular',
  nunitoMedium: 'Nunito_500Medium',
  nunitoSemiBold: 'Nunito_600SemiBold',
  nunitoBold: 'Nunito_700Bold',
  nunitoExtraLight: 'Nunito_200ExtraLight',

  // DM Sans — body, captions, meta text
  dmSansRegular: 'DMSans_400Regular',
  dmSansMedium: 'DMSans_500Medium',
  dmSansBold: 'DMSans_700Bold',

  // Fraunces — display serif for emotional moments
  frauncesLight: 'Fraunces_300Light',
  frauncesRegular: 'Fraunces_400Regular',
} as const;

export const typography = {
  // Display — Fraunces for emotional moments (Active Session, End Session)
  display: {
    fontFamily: fonts.frauncesLight,
    fontSize: 56,
    lineHeight: 64,
    letterSpacing: -1.5,
  } as TextStyle,
  displaySmall: {
    fontFamily: fonts.frauncesRegular,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -1,
  } as TextStyle,

  // Headings — Nunito
  h1: {
    fontFamily: fonts.nunitoBold,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.3,
  } as TextStyle,
  h2: {
    fontFamily: fonts.nunitoBold,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.2,
  } as TextStyle,
  h3: {
    fontFamily: fonts.nunitoBold,
    fontSize: 17,
    lineHeight: 24,
  } as TextStyle,

  // Body — Nunito for UI, DM Sans for prose
  body: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 16,
    lineHeight: 26,
  } as TextStyle,
  bodyNunito: {
    fontFamily: fonts.nunitoSemiBold,
    fontSize: 15,
    lineHeight: 22,
  } as TextStyle,
  bodyMedium: {
    fontFamily: fonts.dmSansMedium,
    fontSize: 16,
    lineHeight: 26,
  } as TextStyle,

  // Small / labels
  small: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 14,
    lineHeight: 20,
  } as TextStyle,
  smallMedium: {
    fontFamily: fonts.dmSansMedium,
    fontSize: 14,
    lineHeight: 20,
  } as TextStyle,
  label: {
    fontFamily: fonts.dmSansMedium,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  } as TextStyle,
  caption: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 12,
    lineHeight: 16,
  } as TextStyle,

  // Mono numbers
  mono: {
    fontFamily: fonts.nunitoExtraLight,
    fontSize: 44,
    lineHeight: 48,
    letterSpacing: -1.5,
  } as TextStyle,

  // Timer display (used by TimerDisplay component)
  timer: {
    fontFamily: fonts.nunitoExtraLight,
    fontSize: 64,
    lineHeight: 72,
    letterSpacing: -2,
  } as TextStyle,
  timerSmall: {
    fontFamily: fonts.nunitoExtraLight,
    fontSize: 40,
    lineHeight: 46,
    letterSpacing: -1.5,
  } as TextStyle,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#1A1828',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,
  md: {
    shadowColor: '#1A1828',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  } as ViewStyle,
  lg: {
    shadowColor: '#7C6FCD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  } as ViewStyle,
} as const;

const lightColors = {
  primary: palette.primary,
  primaryLight: palette.primaryLight,
  primaryDark: palette.primaryDark,
  background: palette.background,
  surface: palette.surface,
  surfaceAlt: palette.surfaceAlt,
  border: palette.border,
  textPrimary: palette.textPrimary,
  textSecondary: palette.textSecondary,
  textTertiary: palette.textTertiary,
  cream: palette.cream,
  warm: palette.warm,
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  white: palette.white,
  black: palette.black,
  overlay: palette.overlay,
  overlayLight: palette.overlayLight,
};

const darkColors = {
  primary: palette.primary,
  primaryLight: palette.primaryLight,
  primaryDark: palette.primaryDark,
  background: palette.backgroundDark,
  surface: palette.surfaceDark,
  surfaceAlt: palette.surfaceAltDark,
  border: palette.borderDark,
  textPrimary: palette.textPrimaryDark,
  textSecondary: palette.textSecondaryDark,
  textTertiary: palette.textTertiaryDark,
  cream: palette.cream,
  warm: palette.warm,
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  white: palette.white,
  black: palette.black,
  overlay: palette.overlay,
  overlayLight: palette.overlayLight,
};

export const lightTheme = {
  colors: lightColors,
  spacing,
  radius,
  typography,
  fonts,
  shadows,
  isDark: false,
} as const;

export const darkTheme = {
  colors: darkColors,
  spacing,
  radius,
  typography,
  fonts,
  shadows,
  isDark: true,
} as const;

export type Theme = typeof lightTheme;
export type ThemeColors = Theme['colors'];
