import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackHeader } from '../components/BackHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { RiskBadge } from '../components/RiskBadge';
import { theme } from '../theme';
import type { FixOption } from '../types/checkPost';

type Props = {
  mode: 'rewrite' | 'context';
  options: readonly FixOption[];
  onBack: () => void;
  onUse: (option: FixOption) => void;
};

// Figma: Check - 6 (Choose a Rewrite) and Check - 8 (Choose Additional Context).
// Same list-and-confirm layout; context options also show the risk they leave.
export function ChooseFixScreen({ mode, options, onBack, onUse }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const title = mode === 'rewrite' ? 'Choose a Rewrite' : 'Choose Additional Context';
  const buttonLabel = mode === 'rewrite' ? 'Use this Rewrite' : 'Use this Context';
  const selected = options.find(option => option.id === selectedId) ?? null;

  return (
    <View style={styles.screen}>
      <BackHeader title={title} onBack={onBack} backLabel={`Back to the reading`} />

      <ScrollView contentContainerStyle={styles.content}>
        {options.map(option => {
          const selectedOption = option.id === selectedId;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="radio"
              accessibilityLabel={mode === 'context' ? `${option.text} ${option.risk} risk` : option.text}
              accessibilityState={{ checked: selectedOption }}
              onPress={() => setSelectedId(option.id)}
              style={({ pressed }) => [
                styles.option,
                selectedOption && styles.selectedOption,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.optionText}>{option.text}</Text>
              {mode === 'context' && option.risk && (
                <View style={styles.badgeRow}>
                  <RiskBadge risk={option.risk} />
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
  empty: { color: theme.colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', paddingVertical: theme.space.xl },
  action: { paddingHorizontal: theme.space.lg, paddingVertical: theme.space.sm },
  pressed: { opacity: 0.75 },
});
