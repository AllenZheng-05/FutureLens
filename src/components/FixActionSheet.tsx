import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '../theme';
import type { FixKind } from '../types/checkPost';

type Props = {
  visible: boolean;
  // Presets exist for rewrite and context fixes only on the sample drafts.
  hasRewrites: boolean;
  hasContexts: boolean;
  onSelect: (kind: FixKind) => void;
  onCancel: () => void;
};

// Figma: Check - 5c. The sheet over the reading page with the three fix paths.
export function FixActionSheet({ visible, hasRewrites, hasContexts, onSelect, onCancel }: Props) {
  const insets = useSafeAreaInsets();
  if (!visible) return null;

  const options: readonly { kind: FixKind; label: string }[] = [
    hasRewrites ? { kind: 'rewrite', label: 'Rewrite it' } : null,
    hasContexts ? { kind: 'context', label: 'Add context' } : null,
    { kind: 'private', label: 'Share somewhere more private' },
  ].filter(Boolean) as readonly { kind: FixKind; label: string }[];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
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
          style={styles.sheet}
        >
          <ScrollView
            style={styles.scroll}
            bounces={false}
            contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 18) }]}
          >
            <View accessible={false} style={styles.handle} />
            <Text accessibilityRole="header" style={styles.title}>How do you want to fix it?</Text>

            <View style={styles.options}>
              {options.map(option => (
                <Pressable
                  key={option.kind}
                  accessibilityRole="button"
                  accessibilityLabel={option.label}
                  onPress={() => onSelect(option.kind)}
                  style={({ pressed }) => [styles.option, pressed && styles.pressed]}
                >
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text accessible={false} style={styles.chevron}>{'>'}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel and go back to the reading"
              onPress={onCancel}
              style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}
            >
              <Text style={styles.cancelLabel}>Cancel</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: theme.colors.backdrop,
  },
  sheet: {
    maxHeight: '90%',
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scroll: { flexGrow: 0 },
  content: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.md },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: theme.colors.border, alignSelf: 'center' },
  title: { marginTop: 20, color: theme.colors.ink, fontSize: 17, fontWeight: '600', lineHeight: 24, textAlign: 'center' },
  options: { marginTop: theme.space.lg, gap: theme.space.md },
  option: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.md,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.md,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
  },
  optionLabel: { flex: 1, color: theme.colors.ink, fontSize: 15, lineHeight: 20 },
  chevron: { color: theme.colors.inactive, fontSize: 15 },
  cancel: { minHeight: 44, marginTop: theme.space.md, alignItems: 'center', justifyContent: 'center' },
  cancelLabel: { color: theme.colors.primary, fontSize: 13, fontWeight: '500', lineHeight: 18 },
  pressed: { opacity: 0.7 },
});
