import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

type Props = {
  visible: boolean;
  // Readers rated medium or high on the checked draft.
  concernCount: number;
  onCancel: () => void;
  onPostAnyway: () => void;
};

// Figma: Check - 5a. Confirms posting a draft unchanged when some readers could misread it.
export function PostAnywayDialog({ visible, concernCount, onCancel, onPostAnyway }: Props) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Pressable
          accessible={false}
          importantForAccessibility="no"
          onPress={onCancel}
          style={styles.backdrop}
        />
        <View
          accessibilityViewIsModal
          importantForAccessibility="yes"
          onAccessibilityEscape={onCancel}
          style={styles.dialog}
        >
          <Text accessibilityRole="header" style={styles.title}>Post without changes?</Text>
          <Text style={styles.body}>
            {concernCount} {concernCount === 1 ? 'reader' : 'readers'} could take this the wrong way. It’s your call.
          </Text>
          <View style={styles.buttons}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back to the readings"
              onPress={onCancel}
              style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            >
              <Text style={styles.cancelLabel}>Go back</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Post anyway without changes"
              onPress={onPostAnyway}
              style={({ pressed }) => [styles.button, styles.primaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.primaryLabel}>Post anyway</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.space.xl },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: theme.colors.backdrop,
  },
  dialog: {
    width: '100%',
    maxWidth: 340,
    padding: theme.space.xl,
    gap: theme.space.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
  },
  title: { color: theme.colors.ink, fontSize: 17, fontWeight: '600', lineHeight: 24, textAlign: 'center' },
  body: { color: theme.colors.ink600, fontSize: 15, lineHeight: 22, textAlign: 'center' },
  buttons: { flexDirection: 'row', gap: theme.space.md, marginTop: theme.space.md },
  button: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.button,
    backgroundColor: theme.colors.background,
  },
  primaryButton: { backgroundColor: theme.colors.primary },
  cancelLabel: { color: theme.colors.ink, fontSize: 16, fontWeight: '600', lineHeight: 22 },
  primaryLabel: { color: theme.colors.surface, fontSize: 16, fontWeight: '600', lineHeight: 22 },
  pressed: { opacity: 0.7 },
});
