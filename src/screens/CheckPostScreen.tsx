
import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabs } from '../components/BottomTabs';
import type { Tab } from '../components/BottomTabs';
import { PrimaryButton } from '../components/PrimaryButton';
import { sampleDrafts } from '../data/sampleDrafts';
import { theme } from '../theme';
import { audiences, platforms } from '../types/checkPost';
import type { Audience, CheckPostRequest, Platform as SharingPlatform } from '../types/checkPost';

type Props = {
  onCheck: (request: CheckPostRequest) => void;
  // Seed for a remount, e.g. when a rewrite from the results page replaces the draft.
  initialRequest?: CheckPostRequest;
  onTabPress?: (tab: Tab) => void;
  availableTabs?: readonly Tab[];
};

function ChoiceGroup<T extends string>({
  label, options, value, onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.choiceSection}>
      <Text accessibilityRole="header" style={styles.sectionLabel}>{label}</Text>
      <View accessibilityRole="radiogroup" accessibilityLabel={label} style={styles.choices}>
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityLabel={`${label}: ${option}`}
              accessibilityState={{ checked: selected }}
              onPress={() => onChange(option)}
              style={({ pressed }) => [
                styles.chip,
                selected && styles.selectedChip,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.chipLabel, selected && styles.selectedChipLabel]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function CheckPostScreen({ onCheck, initialRequest, onTabPress, availableTabs }: Props) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState(initialRequest?.draft ?? '');
  const [platform, setPlatform] = useState<SharingPlatform>(initialRequest?.platform ?? 'LinkedIn');
  const [audience, setAudience] = useState<Audience>(initialRequest?.audience ?? 'Public');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const canCheck = draft.trim().length > 0;

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  function loadSample(sample: CheckPostRequest) {
    setDraft(sample.draft);
    setPlatform(sample.platform);
    setAudience(sample.audience);
  }

  function checkDraft() {
    if (!canCheck) return;
    Keyboard.dismiss();
    onCheck({ draft: draft.trim(), platform, audience });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 48) + 14 }]}>
        <Text accessibilityRole="header" style={styles.title}>Check a post</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        automaticallyAdjustKeyboardInsets={false}
      >
        <View style={styles.composer}>
          <View style={styles.composerHeading}>
            <View style={styles.headingIcon}>
              <Text style={styles.headingIconText}>✎</Text>
            </View>
            <View style={styles.headingText}>
              <Text style={styles.sectionLabel}>Your draft</Text>
              <Text style={styles.helper}>See how your words could land before you share.</Text>
            </View>
          </View>

          <View style={styles.inputCard}>
            <TextInput
              accessibilityLabel="Post draft"
              accessibilityHint="Write or paste the post you want to check"
              placeholder="Write or paste a post, comment, or caption…"
              placeholderTextColor={theme.colors.muted}
              multiline
              textAlignVertical="top"
              value={draft}
              onChangeText={setDraft}
              style={styles.input}
            />
            <View style={styles.composerFooter}>
              <Text style={styles.caption}>{draft.length} characters</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear draft"
                disabled={draft.length === 0}
                accessibilityState={{ disabled: draft.length === 0 }}
                onPress={() => setDraft('')}
                style={styles.clearButton}
              >
                <Text style={[styles.clearLabel, draft.length === 0 && styles.inactive]}>Clear</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <ChoiceGroup label="Platform" options={platforms} value={platform} onChange={setPlatform} />
          <View style={styles.settingsDivider} />
          <ChoiceGroup label="Audience" options={audiences} value={audience} onChange={setAudience} />
        </View>

        <View style={styles.samples}>
          <Text accessibilityRole="header" style={styles.sectionLabel}>Try a sample</Text>
          <Text style={styles.helper}>Fictional drafts to explore the preview.</Text>
          {sampleDrafts.map((sample) => (
            <Pressable
              key={sample.id}
              accessibilityRole="button"
              accessibilityLabel={`Use sample: ${sample.title}`}
              accessibilityHint="Replaces your current draft and sharing choices"
              onPress={() => loadSample(sample)}
              style={({ pressed }) => [styles.sample, pressed && styles.pressed]}
            >
              <View style={styles.sampleRow}>
                <View style={styles.sampleIcon}>
                  <Text style={styles.sampleIconText}>✎</Text>
                </View>
                <View style={styles.sampleContent}>
                  <Text style={styles.sampleTitle}>{sample.title}</Text>
                  <Text numberOfLines={2} style={styles.sampleText}>{sample.draft}</Text>
                  <Text style={styles.caption}>{sample.platform} · {sample.audience}</Text>
                </View>
                <Text style={styles.sampleArrow}>›</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.action}>
        <PrimaryButton label="Check with Lens" disabled={!canCheck} onPress={checkDraft} />
      </View>
      {!keyboardVisible && (
        <BottomTabs activeTab="Check" onTabPress={onTabPress} availableTabs={availableTabs} />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingHorizontal: theme.space.lg, paddingBottom: theme.space.lg },
  title: { color: theme.colors.ink, fontSize: 28, fontWeight: '700', lineHeight: 34 },

  content: {
    paddingHorizontal: theme.space.lg,
    paddingTop: theme.space.sm,
    paddingBottom: theme.space.xl,
    gap: theme.space.lg,
  },

  composer: {
    backgroundColor: '#F1F0FF',
    borderWidth: 1,
    borderColor: '#DCD9FF',
    borderRadius: theme.radius.card,
    padding: theme.space.md,
    gap: theme.space.md,
  },
  composerHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
  },
  headingIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#E4E1FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingIconText: {
    color: theme.colors.primary,
    fontSize: 21,
    fontWeight: '700',
  },
  headingText: { flex: 1 },
  sectionLabel: {
    color: theme.colors.ink,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  helper: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: theme.space.xs,
  },

  inputCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    paddingHorizontal: theme.space.md,
    paddingTop: theme.space.sm,
  },
  input: {
    minHeight: 100,
    color: theme.colors.ink,
    fontSize: 17,
    lineHeight: 25,
    paddingHorizontal: 0,
    paddingTop: theme.space.sm,
    paddingBottom: theme.space.sm,
  },
  composerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  caption: { color: theme.colors.muted, fontSize: 12, lineHeight: 18 },
  clearButton: {
    minHeight: 44,
    minWidth: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  clearLabel: { color: theme.colors.primary, fontSize: 13, fontWeight: '600' },
  inactive: { color: theme.colors.inactive },

  settingsCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.card,
    padding: theme.space.md,
    gap: theme.space.md,
  },
  settingsDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  choiceSection: { gap: theme.space.sm },
  choices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.sm,
  },
  chip: {
    minHeight: 40,
    borderRadius: theme.radius.chip,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipLabel: {
    color: theme.colors.ink,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  selectedChipLabel: { color: theme.colors.surface },

  samples: { gap: theme.space.sm },
  sample: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.card,
    padding: theme.space.md,
  },
  sampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
  },
  sampleIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#EEECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sampleIconText: {
    color: theme.colors.primary,
    fontSize: 19,
    fontWeight: '700',
  },
  sampleContent: { flex: 1, gap: theme.space.xs },
  sampleTitle: {
    color: theme.colors.ink,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  sampleText: { color: theme.colors.ink, fontSize: 13, lineHeight: 19 },
  sampleArrow: {
    color: theme.colors.primary,
    fontSize: 26,
    fontWeight: '400',
  },

  action: {
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.sm,
    backgroundColor: theme.colors.background,
  },
  pressed: { opacity: 0.75 },
});
