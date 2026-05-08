import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { PrimaryButton } from './PrimaryButton';

interface Props {
  headline: string;
  subtext?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export function EmptyState({ headline, subtext, ctaLabel, onCta }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[theme.typography.h3, { color: theme.colors.textPrimary, textAlign: 'center' }]}>
        {headline}
      </Text>
      {subtext && (
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.textSecondary, textAlign: 'center', marginTop: 8 },
          ]}
        >
          {subtext}
        </Text>
      )}
      {ctaLabel && onCta && (
        <PrimaryButton label={ctaLabel} onPress={onCta} style={{ marginTop: 24 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 48,
  },
});
