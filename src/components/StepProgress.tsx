import { StyleSheet, View } from 'react-native';

import { theme } from '../theme';

type Props = { current: number; total: number; label?: string };

// Segments up to and including the current step are filled.
export function StepProgress({ current, total, label = 'Setup progress' }: Props) {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 1, max: total, now: current, text: `Step ${current} of ${total}` }}
      style={styles.progress}
    >
      {Array.from({ length: total }, (_, step) => (
        <View key={step} style={[styles.segment, step < current && styles.filled]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  progress: { flexDirection: 'row', gap: theme.space.sm },
  segment: { flex: 1, height: 4, borderRadius: 2, backgroundColor: theme.colors.border },
  filled: { backgroundColor: theme.colors.primary },
});
