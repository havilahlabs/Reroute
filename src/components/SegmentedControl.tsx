import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { fonts } from '../theme';

interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export function SegmentedControl({ options, selectedIndex, onChange }: SegmentedControlProps) {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radius.lg }]}>
      {options.map((opt, i) => {
        const active = i === selectedIndex;
        return (
          <TouchableOpacity
            key={opt}
            style={[
              styles.option,
              { borderRadius: theme.radius.md },
              active && { backgroundColor: theme.colors.surface, ...theme.shadows.sm },
            ]}
            onPress={() => onChange(i)}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, { color: active ? theme.colors.textPrimary : theme.colors.textTertiary }]}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.dmSansMedium,
    fontSize: 14,
  },
});
