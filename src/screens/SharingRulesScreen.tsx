import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackHeader } from '../components/BackHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { RuleCard } from '../components/RuleCard';
import { SegmentedControl } from '../components/SegmentedControl';
import { StepProgress } from '../components/StepProgress';
import { accountOptions, defaultSharingRules, sharingAudienceOptions, topicOptions } from '../data/lensOptions';
import { theme } from '../theme';
import type { LensAccount, SharingAudience, SharingRules, TopicId } from '../types/lens';

type Props = {
  topicIds: readonly TopicId[];
  onBack: () => void;
  onReview: (rules: SharingRules) => void;
};

const accountSegments = accountOptions.map(option => ({ value: option.id, label: option.label }));
const audienceSegments = sharingAudienceOptions.map(option => ({ value: option.id, label: option.label }));

// Lens setup Step 4: one Public/Friends/Private rule per watched topic, per account.
// Rules are kept for every topic, so going back and changing Step 3 does not lose them.
export function SharingRulesScreen({ topicIds, onBack, onReview }: Props) {
  const insets = useSafeAreaInsets();
  const [account, setAccount] = useState<LensAccount>('public');
  const [rules, setRules] = useState<SharingRules>(defaultSharingRules);
  const topics = topicOptions.filter(topic => topicIds.includes(topic.id));

  function setRule(topic: TopicId, audience: SharingAudience) {
    setRules(previous => ({ ...previous, [account]: { ...previous[account], [topic]: audience } }));
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <BackHeader
        title="Lens setup"
        backLabel="Back to topics"
        onBack={onBack}
        centerContent={<StepProgress current={4} total={4} label="Lens setup progress" />}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.introduction}>
          <Text accessibilityRole="header" style={styles.title}>Who should see what?</Text>
          <Text style={styles.subtitle}>Choose an audience for each topic on each account.</Text>
        </View>

        <View style={styles.accountSwitch}>
          <SegmentedControl
            variant="pill"
            options={accountSegments}
            value={account}
            onChange={setAccount}
            accessibilityLabel="Account to set rules for"
          />
        </View>

        {topics.length > 0 ? (
          <View style={styles.rules}>
            <Text style={styles.sectionLabel}>{`On your ${account} account`}</Text>
            {topics.map(topic => (
              <RuleCard
                key={topic.id}
                title={topic.label}
                options={audienceSegments}
                value={rules[account][topic.id]}
                onChange={audience => setRule(topic.id, audience)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              You didn't pick any topics to watch, so there are no sharing rules to set. Go back to choose topics, or continue to review.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 16) + 48 }]}>
        <PrimaryButton label="Review" onPress={() => onReview(rules)} />
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
  accountSwitch: { marginTop: theme.space.xl },
  rules: { marginTop: theme.space.xl, gap: theme.space.md },
  sectionLabel: { paddingHorizontal: theme.space.xs, color: theme.colors.muted, fontSize: 14, fontWeight: '600', lineHeight: 20 },
  empty: { marginTop: theme.space.xl, padding: theme.space.lg, borderRadius: theme.radius.card, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
  emptyText: { color: theme.colors.secondaryText, fontSize: 15, lineHeight: 22 },
  actions: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.sm },
});
