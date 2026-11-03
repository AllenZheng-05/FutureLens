import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackHeader } from '../components/BackHeader';
import { OptionCard } from '../components/OptionCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { StepProgress } from '../components/StepProgress';
import { TextButton } from '../components/TextButton';
import { theme } from '../theme';
import type { LensOption } from '../types/lens';

type Props<T extends string> = {
  step: number;
  totalSteps: number;
  title: string;
  options: readonly LensOption<T>[];
  backLabel: string;
  skipLabel: string;
  onBack: () => void;
  onSkip: () => void;
  onContinue: (ids: readonly T[]) => void;
};

// Shared layout for the multi-select Lens setup steps (goals, perspectives, topics).
// Selections live in component state; the page stays mounted, so they survive navigation.
export function MultiSelectStepScreen<T extends string>({
  step, totalSteps, title, options, backLabel, skipLabel, onBack, onSkip, onContinue,
}: Props<T>) {
  const insets = useSafeAreaInsets();
  const [selectedIds, setSelectedIds] = useState<readonly T[]>([]);
  const orderedIds = options.filter(option => selectedIds.includes(option.id)).map(option => option.id);

  function toggle(id: T) {
    setSelectedIds(previous => previous.includes(id)
      ? previous.filter(selectedId => selectedId !== id)
      : [...previous, id]);
  }

  function continueWithSelection() {
    if (orderedIds.length === 0) return;
    onContinue(orderedIds);
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <BackHeader
        title="Lens setup"
        backLabel={backLabel}
        onBack={onBack}
        centerContent={<StepProgress current={step} total={totalSteps} label="Lens setup progress" />}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.introduction}>
          <Text accessibilityRole="header" style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Choose all that apply.</Text>
        </View>

        <View style={styles.options}>
          {options.map(option => (
            <OptionCard
              key={option.id}
              label={option.label}
              selected={selectedIds.includes(option.id)}
              onPress={() => toggle(option.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 16) + 48 }]}>
        <TextButton label="Skip for now" accessibilityLabel={skipLabel} onPress={onSkip} />
        <PrimaryButton label="Next" disabled={orderedIds.length === 0} onPress={continueWithSelection} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.space.lg, paddingTop: 28, paddingBottom: theme.space.xl },
  introduction: { paddingHorizontal: theme.space.xs },
  title: { color: theme.colors.ink, fontSize: 24, fontWeight: '700', lineHeight: 32 },
  subtitle: { marginTop: theme.space.sm, color: theme.colors.secondaryText, fontSize: 16, lineHeight: 22 },
  options: { marginTop: 32, gap: theme.space.md },
  actions: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.sm, gap: theme.space.sm },
});
