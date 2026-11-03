import { Pressable, StyleSheet, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { theme } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

// Primary-colored text action, e.g. "Skip for now", "Done", "Edit".
export function TextButton({ label, onPress, accessibilityLabel, compact = false, style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      hitSlop={compact ? 10 : undefined}
      style={({ pressed }) => [styles.button, compact && styles.compact, style, pressed && styles.pressed]}
    >
      <Text style={[styles.label, compact && styles.compactLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  compact: { minHeight: 24 },
  label: { color: theme.colors.primary, fontSize: 16, fontWeight: '500', lineHeight: 22 },
  compactLabel: { fontSize: 14, lineHeight: 20 },
  pressed: { opacity: 0.6 },
});
