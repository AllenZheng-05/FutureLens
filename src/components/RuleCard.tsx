import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';
import { SegmentedControl } from './SegmentedControl';
import type { SegmentOption } from './SegmentedControl';

type Props<T extends string> = {
  title: string;
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

// One topic's sharing rule in Lens setup step 4.
export function RuleCard<T extends string>({ title, options, value, onChange }: Props<T>) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <SegmentedControl options={options} value={value} onChange={onChange} accessibilityLabel={`Who sees ${title}`} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: theme.space.sm, padding: theme.space.lg, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.card, backgroundColor: theme.colors.surface },
  title: { color: theme.colors.ink, fontSize: 15, fontWeight: '600', lineHeight: 20 },
});
