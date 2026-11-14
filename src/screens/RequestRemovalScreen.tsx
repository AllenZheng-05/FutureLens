import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackHeader } from '../components/BackHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { removalReasons } from '../data/findingActions';
import { theme } from '../theme';
import type { DemoFootprintFinding } from '../types/footprint';

type Props = {
  finding: DemoFootprintFinding | undefined;
  onBack: () => void;
  onSend: () => void;
};

// Figma: Footprint - 12 (76:1310). Nothing is sent; the listing is only marked as requested.
export function RequestRemovalScreen({ finding, onBack, onSend }: Props) {
  const insets = useSafeAreaInsets();
  const [reasonId, setReasonId] = useState(removalReasons[0].id);
  const [message, setMessage] = useState(removalReasons[0].message);
  const [choosingReason, setChoosingReason] = useState(false);
  if (!finding || finding.detail.kind !== 'listing') return null;
  const { detail } = finding;
  const reason = removalReasons.find(option => option.id === reasonId) ?? removalReasons[0];

  function chooseReason(id: string) {
    const next = removalReasons.find(option => option.id === id);
    if (!next) return;
    // Keep the user's own wording; only swap in a template they haven't changed.
    if (message === reason.message) setMessage(next.message);
    setReasonId(id);
    setChoosingReason(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <StatusBar barStyle="dark-content" />
      <BackHeader title="Request removal" backLabel="Back to Review item" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      >
        <View style={styles.field}>
          <Text style={styles.label}>Site</Text>
          <View style={styles.box}>
            <Text style={styles.value}>{detail.site}</Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Page</Text>
          <View style={styles.box}>
            <Text style={styles.value}>{detail.page}</Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Reason</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Reason: ${reason.label}`}
            accessibilityHint="Opens the list of reasons"
            accessibilityState={{ expanded: choosingReason }}
            onPress={() => setChoosingReason(open => !open)}
            style={({ pressed }) => [styles.box, styles.picker, pressed && styles.pressed]}
          >
            <Text style={styles.value}>{reason.label}</Text>
            <Text accessible={false} style={styles.chevron}>{choosingReason ? '⌃' : '⌄'}</Text>
          </Pressable>
          {choosingReason && (
            <View accessibilityRole="radiogroup" accessibilityLabel="Reason" style={styles.options}>
              {removalReasons.map(option => (
                <Pressable
                  key={option.id}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: option.id === reasonId }}
                  onPress={() => chooseReason(option.id)}
                  style={({ pressed }) => [styles.option, pressed && styles.pressed]}
                >
                  <Text style={[styles.value, option.id === reasonId && styles.selected]}>{option.label}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <TextInput
          accessibilityLabel="Message to the site"
          multiline
          textAlignVertical="top"
          value={message}
          onChangeText={setMessage}
          style={styles.message}
        />
      </ScrollView>
      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <PrimaryButton label="Send removal request" disabled={message.trim().length === 0} onPress={onSend} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.sm, paddingBottom: theme.space.xl, gap: theme.space.md },
  field: { gap: 6 },
  label: { color: theme.colors.muted, fontSize: 13, lineHeight: 18 },
  box: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: theme.space.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.accountBorder,
    borderRadius: 12,
  },
  value: { color: theme.colors.ink, fontSize: 15, lineHeight: 22 },
  picker: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chevron: { color: theme.colors.ink600, fontSize: 16, lineHeight: 20 },
  options: { overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, backgroundColor: theme.colors.surface },
  option: { minHeight: 44, justifyContent: 'center', paddingHorizontal: theme.space.lg },
  selected: { color: theme.colors.primary, fontWeight: '600' },
  message: {
    minHeight: 120,
    marginTop: theme.space.xs,
    padding: theme.space.lg,
    color: theme.colors.ink,
    fontSize: 15,
    lineHeight: 22,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  },
  actions: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.sm },
  pressed: { opacity: 0.7 },
});
