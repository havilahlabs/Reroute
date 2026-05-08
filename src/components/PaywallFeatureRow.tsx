import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface Props {
  label: string;
  included?: boolean;
}

export function PaywallFeatureRow({ label, included = true }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <Ionicons
        name={included ? 'checkmark-circle' : 'remove-circle-outline'}
        size={18}
        color={included ? theme.colors.success : theme.colors.textTertiary}
      />
      <Text
        style={[
          theme.typography.body,
          { color: included ? theme.colors.textPrimary : theme.colors.textTertiary },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
});
