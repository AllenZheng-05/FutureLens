import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from './PrimaryButton';
import { theme } from '../theme';
import type { DemoAccountId, DemoScanRequest } from '../types/footprint';

type Props = {
  visible: boolean;
  accountIds: readonly DemoAccountId[];
  onCancel: () => void;
  onAllow: (request: DemoScanRequest) => void;
};

const permissions = [
  'See your posts and tags',
  'Never post or delete without your OK',
] as const;

// Figma: Footprint - 3 (76:854). A local demo confirmation, not an OAuth grant.
export function ScanConfirmationSheet({ visible, accountIds, onCancel, onAllow }: Props) {
  const insets = useSafeAreaInsets();
  if (!visible) return null;

  function allowPreview() {
    if (accountIds.length === 0) return;
    onAllow({ accountIds: [...accountIds], access: 'read-only' });
  }

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
            contentContainerStyle={[
              styles.content,
              { paddingBottom: Math.max(insets.bottom, 18) },
            ]}
          >
            <View accessible={false} style={styles.handle} />
            <Text accessibilityRole="header" style={styles.title}>Allow read-only access?</Text>

            <View style={styles.permissions}>
              {permissions.map(permission => (
                <View key={permission} style={styles.permission}>
                  <Text accessible={false} style={styles.checkmark}>✓</Text>
                  <Text style={styles.permissionLabel}>{permission}</Text>
                </View>
              ))}
            </View>

            <View style={styles.allow}>
              <PrimaryButton label="Allow" disabled={accountIds.length === 0} onPress={allowPreview} />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel read-only access preview"
              onPress={onCancel}
              style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}
            >
              <Text style={styles.cancelLabel}>Cancel</Text>
            </Pressable>
            <Text style={styles.demoNote}>
              Demo only. {accountIds.length} account{accountIds.length === 1 ? '' : 's'}. No real access.
            </Text>
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
  content: { minHeight: 360, paddingHorizontal: theme.space.lg, paddingTop: theme.space.md },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: theme.colors.border, alignSelf: 'center' },
  title: { marginTop: 20, color: theme.colors.ink, fontSize: 17, fontWeight: '600', lineHeight: 24, textAlign: 'center' },
  permissions: { marginTop: theme.space.xl, gap: theme.space.md },
  permission: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.space.lg,
    paddingVertical: 13,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
  },
  checkmark: { color: theme.colors.inactive, fontSize: 15, lineHeight: 22 },
  permissionLabel: { flex: 1, color: theme.colors.ink, fontSize: 15, lineHeight: 22 },
  allow: { marginTop: theme.space.xl },
  cancel: { minHeight: 44, marginTop: theme.space.sm, alignItems: 'center', justifyContent: 'center' },
  cancelLabel: { color: theme.colors.primary, fontSize: 13, fontWeight: '500', lineHeight: 18 },
  demoNote: { marginTop: theme.space.xs, color: theme.colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  pressed: { opacity: 0.7 },
});
