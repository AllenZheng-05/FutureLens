import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';
import { CheckMark } from './CheckMark';

type Props = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
};

// Multi-select card used by the Lens setup steps.
export function OptionCard({ label, description, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={description ? `${label}. ${description}` : label}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.card, selected && styles.selectedCard, pressed && styles.pressed]}
    >
      <View accessible={false} style={[styles.indicator, selected && styles.selectedIndicator]}>
        {selected && <CheckMark size={12} />}
      </View>
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: theme.space.md, padding: theme.space.lg, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.card, backgroundColor: theme.colors.surface },
  selectedCard: { borderColor: theme.colors.primary, backgroundColor: theme.colors.chipFill },
  indicator: { width: 24, height: 24, borderWidth: 2, borderColor: theme.colors.accountBorder, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  selectedIndicator: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary },
  text: { flex: 1, gap: 2 },
  label: { color: theme.colors.heading, fontSize: 16, lineHeight: 22 },
  description: { color: theme.colors.secondaryText, fontSize: 13, lineHeight: 18 },
  pressed: { opacity: 0.75 },
});
