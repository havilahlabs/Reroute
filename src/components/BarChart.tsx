import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { fonts } from '../theme';

export interface BarData {
  label: string;
  value: number; // 0–1 normalized
  minutes?: number;
  highlight?: boolean;
  dim?: boolean;
}

interface BarChartProps {
  data: BarData[];
  height?: number;
}

export function BarChart({ data, height = 100 }: BarChartProps) {
  const theme = useTheme();
  return (
    <View>
      <View style={[styles.barsRow, { height }]}>
        {data.map((d, i) => (
          <View key={i} style={styles.barCol}>
            {d.highlight && d.minutes != null && (
              <Text style={[styles.peakLabel, { color: theme.colors.warm }]}>{d.minutes}</Text>
            )}
            <View
              style={[
                styles.bar,
                {
                  height: `${Math.max(6, d.value * 100)}%`,
                  backgroundColor: d.highlight
                    ? theme.colors.warm
                    : theme.colors.primary,
                  opacity: d.dim ? 0.25 : 1,
                  borderRadius: 6,
                },
              ]}
            />
          </View>
        ))}
      </View>
      <View style={styles.labelsRow}>
        {data.map((d, i) => (
          <Text
            key={i}
            style={[
              styles.barLabel,
              {
                color: d.highlight ? theme.colors.warm : theme.colors.textTertiary,
                fontFamily: d.highlight ? fonts.dmSansBold : fonts.dmSansRegular,
              },
            ]}
          >
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 6,
  },
  peakLabel: {
    fontFamily: fonts.dmSansBold,
    fontSize: 10,
    marginBottom: 3,
  },
  labelsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  barLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
});
