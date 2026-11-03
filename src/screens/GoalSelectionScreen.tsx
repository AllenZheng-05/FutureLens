import { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackHeader } from '../components/BackHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { goalOptions } from '../data/goalOptions';
import { theme } from '../theme';
import type { GoalId } from '../types/lens';

type Props = {
  onBack: () => void;
  onSkip: () => void;
  onContinue: (goalIds: readonly GoalId[]) => void;
};

// Lens - 2 (32:498): supplied screenshot and previously retrieved Figma geometry.
// Draft selections only. No preferences are stored or applied to post analysis.
export function GoalSelectionScreen({ onBack, onSkip, onContinue }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedIds, setSelectedIds] = useState<readonly GoalId[]>([]);
  const selectedGoals = goalOptions.filter(goal => selectedIds.includes(goal.id)).map(goal => goal.id);

  function toggleGoal(id: GoalId) {
    setSelectedIds(previous => previous.includes(id)
      ? previous.filter(selectedId => selectedId !== id)
      : [...previous, id]);
  }

  function continueWithGoals() {
    if (selectedGoals.length === 0) return;
    onContinue(selectedGoals);
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <BackHeader
        title="Lens setup"
        backLabel="Back to My Lens"
        onBack={onBack}
        centerContent={(
          <View
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel="Lens setup progress"
            accessibilityValue={{ min: 1, max: 4, now: 1, text: 'Step 1 of 4' }}
            style={styles.progress}
          >
            {[0, 1, 2, 3].map(step => (
              <View key={step} style={[styles.segment, step === 0 && styles.currentSegment]} />
            ))}
          </View>
        )}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.introduction}>
          <Text accessibilityRole="header" style={styles.title}>{'What are you working\ntoward?'}</Text>
          <Text style={styles.subtitle}>Choose all that apply.</Text>
        </View>

        <View style={styles.goals}>
          {goalOptions.map(goal => {
            const selected = selectedIds.includes(goal.id);
            return (
              <Pressable
                key={goal.id}
                accessibilityRole="checkbox"
                accessibilityLabel={goal.label}
                accessibilityState={{ checked: selected }}
                onPress={() => toggleGoal(goal.id)}
                style={({ pressed }) => [styles.goal, selected && styles.selectedGoal, pressed && styles.pressed]}
              >
                <View accessible={false} style={[styles.indicator, selected && styles.selectedIndicator]}>
                  {selected && <View style={styles.indicatorDot} />}
                </View>
                <Text style={styles.goalLabel}>{goal.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 16) + 48 }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Skip goal selection for now" onPress={onSkip} style={styles.skip}>
          <Text style={styles.skipLabel}>Skip for now</Text>
        </Pressable>
        <PrimaryButton label="Next" disabled={selectedGoals.length === 0} onPress={continueWithGoals} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  progress: { flexDirection: 'row', gap: theme.space.sm },
  segment: { flex: 1, height: 4, borderRadius: 2, backgroundColor: theme.colors.border },
  currentSegment: { backgroundColor: theme.colors.primary },
  content: { paddingHorizontal: theme.space.lg, paddingTop: 28, paddingBottom: theme.space.xl },
  introduction: { paddingHorizontal: theme.space.xs },
  title: { color: theme.colors.ink, fontSize: 24, fontWeight: '700', lineHeight: 32 },
  subtitle: { marginTop: theme.space.sm, color: theme.colors.secondaryText, fontSize: 16, lineHeight: 22 },
  goals: { marginTop: 32, gap: theme.space.md },
  goal: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: theme.space.md, padding: theme.space.lg, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.card, backgroundColor: theme.colors.surface },
  selectedGoal: { borderColor: theme.colors.primary, backgroundColor: theme.colors.chipFill },
  indicator: { width: 24, height: 24, borderWidth: 2, borderColor: theme.colors.accountBorder, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  selectedIndicator: { borderColor: theme.colors.primary },
  indicatorDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: theme.colors.primary },
  goalLabel: { flex: 1, color: theme.colors.heading, fontSize: 16, lineHeight: 22 },
  actions: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.sm, gap: theme.space.sm },
  skip: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  skipLabel: { color: theme.colors.primary, fontSize: 16, fontWeight: '500', lineHeight: 22 },
  pressed: { opacity: 0.75 },
});
