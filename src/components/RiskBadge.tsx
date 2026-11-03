import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';
import type { FindingRisk } from '../types/footprint';

type Props = { risk: FindingRisk; compact?: boolean };

const appearances = {
  high: { label: 'High', width: 65, fill: theme.colors.highFill, text: theme.colors.highText, dot: theme.colors.highDot },
  medium: { label: 'Medium', width: 86, fill: theme.colors.mediumFill, text: theme.colors.mediumText, dot: theme.colors.mediumDot },
  low: { label: 'Low', width: 62, fill: theme.colors.lowFill, text: theme.colors.lowText, dot: theme.colors.lowDot },
} as const;

export function RiskBadge({ risk, compact = false }: Props) {
  const appearance = appearances[risk];
  return (
    <View style={[
      styles.badge,
      { backgroundColor: appearance.fill, minWidth: appearance.width },
      compact && styles.compact,
    ]}>
      <View accessible={false} style={[styles.dot, { backgroundColor: appearance.dot }]} />
      <Text style={[styles.label, { color: appearance.text }]}>{appearance.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { minHeight: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  compact: { minHeight: 16, paddingVertical: 0 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  label: { fontSize: 13, fontWeight: '500', lineHeight: 16 },
});
