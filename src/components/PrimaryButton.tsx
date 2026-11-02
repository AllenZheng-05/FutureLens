import { Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '../theme';

type Props = {
  label: string;
  disabled?: boolean;
  onPress: () => void;
};

export function PrimaryButton({ label, disabled = false, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, disabled && styles.disabledLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: theme.radius.button,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.md,
  },
  disabled: { backgroundColor: theme.colors.disabledFill },
  pressed: { opacity: 0.8 },
  label: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  disabledLabel: { color: theme.colors.disabledText },
});
