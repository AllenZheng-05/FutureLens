import { Image, Pressable, StyleSheet } from 'react-native';

type Props = {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

// Original Figma on/off assets, with a larger accessible touch target.
export function Toggle({ label, checked, disabled = false, onChange }: Props) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked, disabled }}
      accessibilityHint={disabled ? 'Coming soon' : undefined}
      disabled={disabled}
      onPress={() => { if (!disabled) onChange(!checked); }}
      style={({ pressed }) => [styles.touchTarget, pressed && styles.pressed]}
    >
      <Image
        accessible={false}
        source={checked
          ? require('../../assets/icons/toggle-on.png')
          : require('../../assets/icons/toggle-off.png')}
        style={styles.image}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchTarget: { width: 48, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  image: { width: 48, height: 28 },
  pressed: { opacity: 0.75 },
});
