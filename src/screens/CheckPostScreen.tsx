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
import { PrimaryButton } from '../components/PrimaryButton';
import { sampleDrafts } from '../data/sampleDrafts';
import { theme } from '../theme';
import { audiences, platforms } from '../types/checkPost';
import type { Audience, CheckPostRequest, Platform as SharingPlatform } from '../types/checkPost';

type Props = {
  onCheck: (request: CheckPostRequest) => void;
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

export function CheckPostScreen({ onCheck }: Props) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState('');
  const [platform, setPlatform] = useState<SharingPlatform>('LinkedIn');
  const [audience, setAudience] = useState<Audience>('Public');
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
          <Text style={styles.sectionLabel}>Your draft</Text>
          <Text style={styles.helper}>See how your words could land before you share.</Text>
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

        <ChoiceGroup label="Platform" options={platforms} value={platform} onChange={setPlatform} />
        <ChoiceGroup label="Audience" options={audiences} value={audience} onChange={setAudience} />

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
              <Text style={styles.sampleTitle}>{sample.title}</Text>
              <Text numberOfLines={2} style={styles.sampleText}>{sample.draft}</Text>
              <Text style={styles.caption}>{sample.platform} · {sample.audience}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.action}>
        <PrimaryButton label="Check with Lens" disabled={!canCheck} onPress={checkDraft} />
      </View>
      {!keyboardVisible && <BottomTabs activeTab="Check" />}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingHorizontal: theme.space.lg, paddingBottom: theme.space.lg },
  title: { color: theme.colors.ink, fontSize: 28, fontWeight: '700', lineHeight: 34 },
  content: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.xl, paddingBottom: theme.space.xl, gap: theme.space.xl },
  composer: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.card, padding: theme.space.lg },
  sectionLabel: { color: theme.colors.ink, fontSize: 15, fontWeight: '600', lineHeight: 20 },
  helper: { color: theme.colors.muted, fontSize: 13, lineHeight: 18, marginTop: theme.space.xs },
  input: { minHeight: 160, color: theme.colors.ink, fontSize: 17, lineHeight: 25, paddingHorizontal: 0, paddingTop: theme.space.lg, paddingBottom: theme.space.sm },
  composerFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: theme.colors.border },
  caption: { color: theme.colors.muted, fontSize: 12, lineHeight: 18 },
  clearButton: { minHeight: 44, minWidth: 44, alignItems: 'flex-end', justifyContent: 'center' },
  clearLabel: { color: theme.colors.primary, fontSize: 13, fontWeight: '600' },
  inactive: { color: theme.colors.inactive },
  choiceSection: { gap: theme.space.sm },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm },
  chip: { minHeight: 44, borderRadius: theme.radius.chip, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, paddingHorizontal: theme.space.lg, paddingVertical: theme.space.md, alignItems: 'center', justifyContent: 'center' },
  selectedChip: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  chipLabel: { color: theme.colors.ink, fontSize: 14, fontWeight: '500', lineHeight: 18 },
  selectedChipLabel: { color: theme.colors.surface },
  samples: { gap: theme.space.sm },
  sample: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.card, padding: theme.space.lg, gap: theme.space.xs },
  sampleTitle: { color: theme.colors.ink, fontSize: 14, fontWeight: '600', lineHeight: 20 },
  sampleText: { color: theme.colors.ink, fontSize: 13, lineHeight: 19 },
  action: { paddingHorizontal: theme.space.lg, paddingVertical: theme.space.sm, backgroundColor: theme.colors.background },
  pressed: { opacity: 0.75 },
});
