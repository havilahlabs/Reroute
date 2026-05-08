import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface Props {
  route: string | null;
  onSet: () => void;
}

export function TodayRouteCard({ route, onSet }: Props) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onSet}
      activeOpacity={0.8}
      style={[
        styles.card,
        {
          backgroundColor: route ? theme.colors.primary : theme.colors.surfaceAlt,
          borderRadius: theme.radius.lg,
          borderWidth: route ? 0 : 1.5,
          borderStyle: 'dashed',
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.row}>
        <Ionicons
          name={route ? 'navigate' : 'navigate-outline'}
          size={20}
          color={route ? theme.colors.white : theme.colors.textTertiary}
        />
        <View style={styles.text}>
          <Text
            style={[
              theme.typography.caption,
              { color: route ? 'rgba(255,255,255,0.7)' : theme.colors.textTertiary },
            ]}
          >
            Today's route
          </Text>
          <Text
            style={[
              theme.typography.bodyMedium,
              { color: route ? theme.colors.white : theme.colors.textSecondary },
            ]}
          >
            {route ?? 'Set your one thing for today'}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={route ? 'rgba(255,255,255,0.6)' : theme.colors.textTertiary}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  text: { flex: 1 },
});
