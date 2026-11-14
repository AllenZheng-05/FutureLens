import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackHeader } from '../components/BackHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextButton } from '../components/TextButton';
import { Toggle } from '../components/Toggle';
import { summarizeFootprintProgress } from '../data/footprintProgress';
import { theme } from '../theme';
import type { DemoFootprintFinding, Resolution } from '../types/footprint';

type Props = {
  findings: readonly DemoFootprintFinding[];
  resolutions: Readonly<Record<string, Resolution>>;
  onBack: () => void;
  onDone: () => void;
  onBackToCheck: () => void;
};

// Figma: Footprint - 14 (93:1439). Rescan monthly is a session-only preference; no scan is scheduled.
export function FootprintProgressScreen({ findings, resolutions, onBack, onDone, onBackToCheck }: Props) {
  const insets = useSafeAreaInsets();
  const [rescanMonthly, setRescanMonthly] = useState(true);
  const progress = summarizeFootprintProgress(findings, resolutions);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <BackHeader title="Your footprint now" backLabel="Back to footprint results" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <View
          accessible
          accessibilityLabel={`Things worth a look: ${progress.before} before, ${progress.now} now`}
          style={styles.compare}
        >
          <View style={styles.count}>
            <Text style={styles.number}>{progress.before}</Text>
            <Text style={styles.countLabel}>Before</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
          <View style={styles.count}>
            <Text style={styles.number}>{progress.now}</Text>
            <Text style={styles.countLabel}>Now</Text>
          </View>
        </View>
        <Text style={styles.note}>Things worth a look that match your goals.</Text>

        <Text accessibilityRole="header" style={styles.sectionTitle}>What a stranger can find</Text>
        <View style={styles.lines}>
          {progress.lines.map(line => (
            <View key={line} style={styles.line}>
              <Text style={styles.lineLabel}>{line}</Text>
            </View>
          ))}
        </View>

        <View style={styles.rescan}>
          <Text style={styles.lineLabel}>Rescan monthly</Text>
          <Toggle label="Rescan monthly" checked={rescanMonthly} onChange={setRescanMonthly} />
        </View>
      </ScrollView>
      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TextButton label="Back to Check" compact onPress={onBackToCheck} />
        <PrimaryButton label="Done" onPress={onDone} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.sm, paddingBottom: theme.space.xl, gap: theme.space.md },
  compare: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: theme.space.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.accountBorder,
    borderRadius: theme.radius.card,
  },
  count: { alignItems: 'center', gap: theme.space.xs },
  number: { color: theme.colors.ink, fontSize: 28, fontWeight: '700', lineHeight: 34 },
  countLabel: { color: theme.colors.muted, fontSize: 13, lineHeight: 18 },
  arrow: { color: theme.colors.ink, fontSize: 24, fontWeight: '600' },
  note: { marginTop: -theme.space.xs, color: theme.colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  sectionTitle: { marginTop: theme.space.sm, color: theme.colors.ink, fontSize: 17, fontWeight: '600', lineHeight: 24 },
  lines: { gap: theme.space.sm },
  line: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.accountBorder,
    borderRadius: 12,
  },
  lineLabel: { flex: 1, color: theme.colors.ink, fontSize: 15, fontWeight: '600', lineHeight: 20 },
  rescan: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.md,
    marginTop: theme.space.sm,
    paddingHorizontal: theme.space.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.accountBorder,
    borderRadius: 12,
  },
  actions: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.sm, gap: theme.space.sm },
});
