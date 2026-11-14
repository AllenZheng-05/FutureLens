import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackHeader } from '../components/BackHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { theme } from '../theme';
import type { DemoFootprintFinding } from '../types/footprint';

type Props = {
  finding: DemoFootprintFinding | undefined;
  onBack: () => void;
  onSave: () => void;
};

// Not in Figma: the "Edit caption" choice from Footprint - 7, styled like Request removal (Footprint - 12).
// The new wording stays on this screen; no post is changed.
export function EditCaptionScreen({ finding, onBack, onSave }: Props) {
  const insets = useSafeAreaInsets();
  const original = finding?.detail.kind === 'post' ? finding.detail.text : '';
  const [caption, setCaption] = useState(original);
  if (!finding || finding.detail.kind !== 'post') return null;
  const trimmed = caption.trim();
  const canSave = trimmed.length > 0 && trimmed !== original.trim();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <StatusBar barStyle="dark-content" />
      <BackHeader title="Edit caption" backLabel="Back to Review item" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      >
        <View style={styles.field}>
          <Text style={styles.label}>Original</Text>
          <View style={styles.readOnly}>
            <Text style={styles.originalText}>{original}</Text>
          </View>
          <Text style={styles.hint}>Flagged because: {finding.detail.whyFlagged}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>New caption</Text>
          <TextInput
            accessibilityLabel="New caption"
            accessibilityHint="Reword the post so it can't be read the wrong way"
            multiline
            textAlignVertical="top"
            value={caption}
            onChangeText={setCaption}
            style={styles.input}
          />
        </View>
        {!canSave && (
          <Text style={styles.hint}>Change the wording to save.</Text>
        )}
      </ScrollView>
      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <PrimaryButton label="Save caption" disabled={!canSave} onPress={onSave} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.sm, paddingBottom: theme.space.xl, gap: theme.space.lg },
  field: { gap: 6 },
  label: { color: theme.colors.muted, fontSize: 13, lineHeight: 18 },
  readOnly: { padding: theme.space.lg, borderRadius: 12, backgroundColor: theme.colors.disabledFill },
  originalText: { color: theme.colors.ink600, fontSize: 15, lineHeight: 22 },
  hint: { color: theme.colors.muted, fontSize: 13, lineHeight: 18 },
  input: {
    minHeight: 120,
    padding: theme.space.lg,
    color: theme.colors.ink,
    fontSize: 15,
    lineHeight: 22,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.accountBorder,
    borderRadius: 12,
  },
  actions: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.sm },
});
