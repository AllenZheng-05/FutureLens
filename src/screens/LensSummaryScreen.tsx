import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackHeader } from '../components/BackHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { SummaryCard } from '../components/SummaryCard';
import { TagPill } from '../components/TagPill';
import { goalOptions } from '../data/goalOptions';
import { accountOptions, perspectiveOptions, sharingAudienceOptions, topicOptions } from '../data/lensOptions';
import { theme } from '../theme';
import type { GoalId, LensOption, PerspectiveId, SharingRules, TopicId } from '../types/lens';

export type LensSection = 'goals' | 'perspectives' | 'topics' | 'sharing';

type Props = {
  goalIds: readonly GoalId[];
  perspectiveIds: readonly PerspectiveId[];
  topicIds: readonly TopicId[];
  rules: SharingRules;
  onBack: () => void;
  onEdit: (section: LensSection) => void;
  onSave: () => void;
};

function Tags<T extends string>({ options, ids }: { options: readonly LensOption<T>[]; ids: readonly T[] }) {
  const chosen = options.filter(option => ids.includes(option.id));
  if (chosen.length === 0) return <Text style={styles.empty}>Skipped</Text>;
  return (
    <View style={styles.tags}>
      {chosen.map(option => <TagPill key={option.id} label={option.label} />)}
    </View>
  );
}

// "Your Lens": review of all four setup steps before saving.
export function LensSummaryScreen({ goalIds, perspectiveIds, topicIds, rules, onBack, onEdit, onSave }: Props) {
  const insets = useSafeAreaInsets();
  const topics = topicOptions.filter(topic => topicIds.includes(topic.id));

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <BackHeader title="Your Lens" backLabel="Back to sharing rules" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Check your choices. You can change them any time.</Text>

        <SummaryCard title="Goals" onEdit={() => onEdit('goals')}>
          <Tags options={goalOptions} ids={goalIds} />
        </SummaryCard>
        <SummaryCard title="Perspectives" onEdit={() => onEdit('perspectives')}>
          <Tags options={perspectiveOptions} ids={perspectiveIds} />
        </SummaryCard>
        <SummaryCard title="Watching for" onEdit={() => onEdit('topics')}>
          <Tags options={topicOptions} ids={topicIds} />
        </SummaryCard>
        <SummaryCard title="Sharing rules" onEdit={() => onEdit('sharing')}>
          {topics.length === 0 ? (
            <Text style={styles.empty}>No topics to set rules for</Text>
          ) : accountOptions.map(account => (
            <View key={account.id} style={styles.account}>
              <Text style={styles.accountLabel}>{account.label}</Text>
              {topics.map(topic => {
                const audience = sharingAudienceOptions.find(option => option.id === rules[account.id][topic.id]);
                return (
                  <View key={topic.id} style={styles.ruleRow}>
                    <Text style={styles.ruleTopic}>{topic.label}</Text>
                    <Text style={styles.ruleAudience}>{audience?.label}</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </SummaryCard>
      </ScrollView>

      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 16) + 48 }]}>
        <PrimaryButton label="Save my Lens" onPress={onSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.sm, paddingBottom: theme.space.xl, gap: theme.space.md },
  subtitle: { paddingHorizontal: theme.space.xs, marginBottom: theme.space.xs, color: theme.colors.secondaryText, fontSize: 15, lineHeight: 22 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm },
  empty: { color: theme.colors.secondaryText, fontSize: 15, lineHeight: 20 },
  account: { gap: theme.space.xs },
  accountLabel: { color: theme.colors.muted, fontSize: 13, fontWeight: '600', lineHeight: 18 },
  ruleRow: { flexDirection: 'row', justifyContent: 'space-between', gap: theme.space.md },
  ruleTopic: { flex: 1, color: theme.colors.ink, fontSize: 15, lineHeight: 22 },
  ruleAudience: { color: theme.colors.primary, fontSize: 15, fontWeight: '600', lineHeight: 22 },
  actions: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.sm },
});
