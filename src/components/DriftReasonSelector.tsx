import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { OptionChip } from './OptionChip';

const REASONS = [
  'Bored', 'Tired', 'Anxious', 'Task unclear',
  'Notification', 'Habit', 'Needed a break', 'Other',
];

interface Props {
  selected: string | null;
  onSelect: (reason: string) => void;
}

export function DriftReasonSelector({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {REASONS.map(reason => (
        <OptionChip
          key={reason}
          label={reason}
          selected={selected === reason}
          onPress={() => onSelect(reason)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
});
