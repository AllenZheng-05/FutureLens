import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

export type SegmentOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel: string;
  // pill: separate rounded buttons (account switch); compact: joined row (per-topic rule).
  variant?: 'pill' | 'compact';
};

export function SegmentedControl<T extends string>({ options, value, onChange, accessibilityLabel, variant = 'compact' }: Props<T>) {
  const pill = variant === 'pill';
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={accessibilityLabel} style={pill ? styles.pillRow : styles.compactRow}>
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              pill ? styles.pill : styles.segment,
              !pill && index > 0 && styles.divider,
              selected && styles.selected,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[pill ? styles.pillLabel : styles.segmentLabel, selected && styles.selectedLabel]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  pillRow: { flexDirection: 'row', gap: theme.space.sm },
  pill: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.button, backgroundColor: theme.colors.surface, paddingHorizontal: theme.space.md },
  pillLabel: { color: theme.colors.ink, fontSize: 15, fontWeight: '500', lineHeight: 20 },
  compactRow: { flexDirection: 'row', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 10, overflow: 'hidden', backgroundColor: theme.colors.surface },
  segment: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: theme.space.sm },
  divider: { borderLeftWidth: 1, borderLeftColor: theme.colors.border },
  segmentLabel: { color: theme.colors.ink600, fontSize: 14, fontWeight: '500', lineHeight: 18 },
  selected: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  selectedLabel: { color: theme.colors.surface, fontWeight: '600' },
  pressed: { opacity: 0.75 },
});
