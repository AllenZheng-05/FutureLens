import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackHeader } from '../components/BackHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { RiskBadge } from '../components/RiskBadge';
import { theme } from '../theme';
import type { CheckRisk, FixOption } from '../types/checkPost';

type Props = {
  mode: 'rewrite' | 'context';
  options: readonly FixOption[];
  // The worst reader concern on the original draft, for the severity comparison.
  originalRisk: CheckRisk;
  onBack: () => void;
  onUse: (option: FixOption) => void;
};

const subtitles = {
  rewrite: 'A fresh way to say it — the version you pick replaces your post.',
  context: 'Your post stays as written — the version you pick appends a clarifier.',
} as const;

// Figma: Check - 6 (Choose a Rewrite) and Check - 8 (Choose Additional Context).
// Same list-and-confirm layout: every option shows the risk the post is left
// at, the selected one explains what it fixes, and the button sits under an
// original → this version severity comparison.
export function ChooseFixScreen({ mode, options, originalRisk, onBack, onUse }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const title = mode === 'rewrite' ? 'Choose a Rewrite' : 'Choose Additional Context';
  const buttonLabel = mode === 'rewrite' ? 'Use this Rewrite' : 'Use this Context';
  const selected = options.find(option => option.id === selectedId) ?? null;

  return (
    <View style={styles.screen}>
      <BackHeader title={title} onBack={onBack} backLabel="Back to the reading" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>{subtitles[mode]}</Text>

        {options.map(option => {
          const selectedOption = option.id === selectedId;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="radio"
              accessibilityLabel={`${option.text}${option.risk ? `, ${option.risk} risk` : ''}`}
              accessibilityState={{ checked: selectedOption }}
              onPress={() => setSelectedId(option.id)}
              style={({ pressed }) => [
                styles.option,
                selectedOption && styles.selectedOption,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.optionText}>{option.text}</Text>
              {option.risk && (
                <View style={styles.badgeRow}>
                  <RiskBadge risk={option.risk} />
                </View>
              )}
              {selectedOption && option.why && (
                <View style={styles.whyBlock}>
                  <Text style={styles.whyLabel}>What this fixes</Text>
                  <Text style={styles.whyText}>{option.why}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
        {options.length === 0 && (
          <Text style={styles.empty}>
            No preset {mode === 'rewrite' ? 'rewrites' : 'contexts'} for this draft. Load a sample on
            the Check page to see the presets.
          </Text>
        )}
      </ScrollView>

      <View style={styles.action}>
        {selected && (
          <View
            accessibilityLabel={`Original: ${originalRisk} risk. This version: ${selected.risk ?? originalRisk} risk.`}
            style={styles.compare}
          >
            <Text style={styles.compareLabel}>Original</Text>
            <RiskBadge risk={originalRisk} compact />
            <Text accessible={false} style={styles.compareArrow}>{'→'}</Text>
            <Text style={styles.compareLabel}>This version</Text>
            <RiskBadge risk={selected.risk ?? originalRisk} compact />
          </View>
        )}
        <PrimaryButton
          label={buttonLabel}
          disabled={!selected}
          onPress={() => selected && onUse(selected)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.md, paddingBottom: theme.space.xl, gap: theme.space.md },
  subtitle: { color: theme.colors.muted, fontSize: 13, lineHeight: 18 },
  option: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.card,
    padding: theme.space.lg,
  },
  selectedOption: { backgroundColor: theme.colors.chipFill, borderColor: theme.colors.primary },
  optionText: { color: theme.colors.ink, fontSize: 15, lineHeight: 21 },
  badgeRow: { flexDirection: 'row', marginTop: theme.space.sm },
  whyBlock: { marginTop: theme.space.md, gap: 2 },
  whyLabel: { color: theme.colors.primary, fontSize: 12, fontWeight: '600', lineHeight: 16 },
  whyText: { color: theme.colors.ink600, fontSize: 13, lineHeight: 19 },
  empty: { color: theme.colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', paddingVertical: theme.space.xl },
  action: { paddingHorizontal: theme.space.lg, paddingVertical: theme.space.sm, gap: theme.space.sm },
  compare: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.space.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.sm,
  },
  compareLabel: { color: theme.colors.muted, fontSize: 12, lineHeight: 16 },
  compareArrow: { color: theme.colors.ink600, fontSize: 14 },
  pressed: { opacity: 0.75 },
});
