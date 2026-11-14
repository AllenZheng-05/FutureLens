import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { findingActionGuidance, findingActions } from '../data/findingActions';
import { theme } from '../theme';
import type { DemoFootprintFinding, FindingAction } from '../types/footprint';

type Props = {
  visible: boolean;
  finding: DemoFootprintFinding | undefined;
  onSelect: (action: FindingAction) => void;
  onCancel: () => void;
};

// Figma: Footprint - 7 (76:1082) for posts, Footprint - 11 (76:1292) for listings.
export function FindingActionSheet({ visible, finding, onSelect, onCancel }: Props) {
  const insets = useSafeAreaInsets();
  if (!visible || !finding) return null;
  const actions = findingActions[finding.category];

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
            <Text accessibilityRole="header" style={styles.title}>What do you want to do?</Text>
            <Text style={styles.guidance}>{findingActionGuidance[finding.category]}</Text>

            <View style={styles.options}>
              {actions.map(action => (
                <Pressable
                  key={action.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${action.label}. ${action.description}`}
                  onPress={() => onSelect(action.id)}
                  style={({ pressed }) => [styles.option, pressed && styles.pressed]}
                >
                  <Text style={[styles.optionLabel, action.destructive && styles.destructive]}>{action.label}</Text>
                  <Text style={styles.optionDescription}>{action.description}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel and keep reviewing"
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
  guidance: { marginTop: theme.space.xs, color: theme.colors.muted, fontSize: 13, lineHeight: 18, textAlign: 'center' },
  options: { marginTop: theme.space.lg, gap: theme.space.md },
  option: {
    minHeight: 56,
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.md,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
  },
  optionLabel: { color: theme.colors.ink, fontSize: 15, fontWeight: '600', lineHeight: 20 },
  destructive: { color: theme.colors.highText },
  optionDescription: { color: theme.colors.muted, fontSize: 13, lineHeight: 18 },
  cancel: { minHeight: 44, marginTop: theme.space.sm, alignItems: 'center', justifyContent: 'center' },
  cancelLabel: { color: theme.colors.primary, fontSize: 13, fontWeight: '500', lineHeight: 18 },
  pressed: { opacity: 0.7 },
});
