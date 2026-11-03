import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';
import { CheckMark } from './CheckMark';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

// Multi-select card used by the Lens setup steps.
export function OptionCard({ label, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.card, selected && styles.selectedCard, pressed && styles.pressed]}
    >
      <View accessible={false} style={[styles.indicator, selected && styles.selectedIndicator]}>
        {selected && <CheckMark size={12} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: theme.space.md, padding: theme.space.lg, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.card, backgroundColor: theme.colors.surface },
  selectedCard: { borderColor: theme.colors.primary, backgroundColor: theme.colors.chipFill },
  indicator: { width: 24, height: 24, borderWidth: 2, borderColor: theme.colors.accountBorder, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  selectedIndicator: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary },
  label: { flex: 1, color: theme.colors.heading, fontSize: 16, lineHeight: 22 },
  pressed: { opacity: 0.75 },
});
