import type { ReactNode } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackHeader } from '../components/BackHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextButton } from '../components/TextButton';
import { activeFootprintGoalIds, matchedGoalLabel } from '../data/footprintGoals';
import { theme } from '../theme';
import type { DemoFootprintFinding, ListingFindingDetail, PostFindingDetail } from '../types/footprint';
import type { GoalId } from '../types/lens';

type Props = {
  finding: DemoFootprintFinding | undefined;
  // Saved Lens goals; null (no Lens) falls back to the preset demo goals.
  lensGoalIds: readonly GoalId[] | null;
  onBack: () => void;
  onChooseAction: () => void;
  onKeep: () => void;
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function PostCard({ detail }: { detail: PostFindingDetail }) {
  return (
    <View style={styles.card}>
      <Text style={styles.postText}>{detail.text}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{detail.date}</Text>
        <View style={styles.metaChip}>
          <Text style={styles.metaChipLabel}>{detail.visibility}</Text>
        </View>
      </View>
    </View>
  );
}

function ListingCard({ detail }: { detail: ListingFindingDetail }) {
  return (
    <View style={styles.card}>
      <Text style={styles.listingTitle}>{detail.site} listing</Text>
      {detail.fields.map(field => (
        <Text key={field.label} style={styles.listingField}>{field.label}: {field.value}</Text>
      ))}
      <View style={[styles.metaChip, styles.sourceChip]}>
        <Text style={styles.metaChipLabel}>Source: {detail.site} (third-party site)</Text>
      </View>
    </View>
  );
}

// Figma: Footprint - 6 (76:1020) for posts, tags and mentions; Footprint - 10 (76:1262) for listings.
export function FindingDetailScreen({ finding, lensGoalIds, onBack, onChooseAction, onKeep }: Props) {
  const insets = useSafeAreaInsets();
  if (!finding) return null;
  const { detail } = finding;
  const goalLabel = matchedGoalLabel(finding, activeFootprintGoalIds(lensGoalIds));

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <BackHeader title="Review item" backLabel="Back to footprint results" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        {detail.kind === 'post' ? <PostCard detail={detail} /> : <ListingCard detail={detail} />}

        <Section title="Why it’s flagged">
          <Text style={styles.body}>{detail.whyFlagged}</Text>
        </Section>

        {detail.kind === 'post' && detail.quote && (
          <Section title="How it could be used">
            <View style={styles.quoteBox}>
              <Text style={styles.quoteLabel}>Example of how it could be quoted</Text>
              <Text style={styles.quote}>{detail.quote}</Text>
            </View>
          </Section>
        )}

        <Section title="Where people can find it">
          <Text style={styles.body}>{detail.whereFound}</Text>
        </Section>

        {goalLabel && (
          <View style={styles.goalChip}>
            <Text style={styles.goalChipLabel}>Matches your goal: {goalLabel}</Text>
          </View>
        )}
      </ScrollView>
      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {detail.kind === 'post' && (
          <TextButton
            label="Keep this one"
            accessibilityLabel="Keep this item as it is"
            compact
            onPress={onKeep}
          />
        )}
        <PrimaryButton label="Choose an action" onPress={onChooseAction} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.sm, paddingBottom: theme.space.xl, gap: theme.space.lg },
  card: { padding: theme.space.lg, gap: theme.space.sm, backgroundColor: theme.colors.surface, borderRadius: theme.radius.card },
  postText: { color: theme.colors.ink, fontSize: 16, lineHeight: 22 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: theme.space.sm },
  meta: { color: theme.colors.muted, fontSize: 13, lineHeight: 18 },
  metaChip: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, backgroundColor: theme.colors.disabledFill },
  metaChipLabel: { color: theme.colors.ink600, fontSize: 12, fontWeight: '500', lineHeight: 16 },
  sourceChip: { alignSelf: 'flex-start' },
  listingTitle: { color: theme.colors.muted, fontSize: 13, lineHeight: 18 },
  listingField: { color: theme.colors.ink, fontSize: 16, lineHeight: 22 },
  section: { gap: theme.space.sm },
  sectionTitle: { color: theme.colors.ink, fontSize: 17, fontWeight: '600', lineHeight: 24 },
  body: { color: theme.colors.muted, fontSize: 15, lineHeight: 22 },
  quoteBox: { padding: theme.space.md, gap: 2, borderRadius: 12, backgroundColor: theme.colors.highFill },
  quoteLabel: { color: theme.colors.muted, fontSize: 12, lineHeight: 16 },
  quote: { color: theme.colors.ink, fontSize: 15, fontStyle: 'italic', lineHeight: 22 },
  goalChip: { alignSelf: 'flex-start', paddingHorizontal: theme.space.md, paddingVertical: 6, borderRadius: theme.radius.chip, backgroundColor: theme.colors.chipFill },
  goalChipLabel: { color: theme.colors.primary, fontSize: 13, fontWeight: '500', lineHeight: 18 },
  actions: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.sm, gap: theme.space.sm },
});
