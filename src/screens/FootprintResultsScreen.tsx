import { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabs } from '../components/BottomTabs';
import type { Tab } from '../components/BottomTabs';
import { RiskBadge } from '../components/RiskBadge';
import { Toggle } from '../components/Toggle';
import { demoScannedSites, findingFilters } from '../data/demoFootprintFindings';
import { demoScan } from '../data/demoScan';
import { resolutionLabels } from '../data/findingActions';
import { theme } from '../theme';
import type { DemoFootprintFinding, FindingFilter, FindingRisk, Resolution, ResolutionNotice } from '../types/footprint';

type Props = {
  findings: readonly DemoFootprintFinding[];
  resolutions: Readonly<Record<string, Resolution>>;
  notice: ResolutionNotice | null;
  availableTabs: readonly Tab[];
  onTabPress: (tab: Tab) => void;
  onChooseAccounts: () => void;
  onOpenFinding: (findingId: string) => void;
  onUndo: () => void;
};

const risks: readonly FindingRisk[] = ['high', 'medium', 'low'];

// Footprint - 5: user-provided screenshot plus previously retrieved Figma geometry.
// Footprint - 9 and 13: resolved items leave the list, with Undo and a Resolved section.
// All filtering is over static fixtures; there is no analysis or personalization.
export function FootprintResultsScreen({
  findings,
  resolutions,
  notice,
  availableTabs,
  onTabPress,
  onChooseAccounts,
  onOpenFinding,
  onUndo,
}: Props) {
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState<FindingFilter>('all');
  const [matchesGoalsOnly, setMatchesGoalsOnly] = useState(true);
  const [showResolved, setShowResolved] = useState(false);
  const filteredFindings = findings.filter(finding =>
    (!matchesGoalsOnly || finding.matchesDemoGoals)
    && (category === 'all' || finding.category === category),
  );
  const visibleFindings = filteredFindings.filter(finding => !resolutions[finding.id]);
  const resolvedFindings = filteredFindings.filter(finding => resolutions[finding.id]);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 48) + 14 }]}>
        <Text accessibilityRole="header" style={styles.title}>Footprint</Text>
        <Text style={styles.subtitle}>
          Demo · Scanned {demoScan.postCount.toLocaleString('en-US')} posts · {demoScannedSites} sites
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summary}>
          <Text accessibilityRole="header" accessibilityLiveRegion="polite" style={styles.sectionTitle}>
            {visibleFindings.length} {visibleFindings.length === 1 ? 'thing' : 'things'} worth a look
            {resolvedFindings.length > 0 && (
              <Text style={styles.resolvedCount}>  {resolvedFindings.length} resolved</Text>
            )}
          </Text>
          <View style={styles.summaryCounts}>
            {risks.map(risk => (
              <View key={risk} style={styles.riskCount}>
                <RiskBadge risk={risk} />
                <Text style={styles.count}>{visibleFindings.filter(finding => finding.risk === risk).length}</Text>
              </View>
            ))}
          </View>
        </View>

        <View accessibilityRole="radiogroup" accessibilityLabel="Finding category" style={styles.filters}>
          {findingFilters.map(filter => (
            <Pressable
              key={filter.id}
              accessibilityRole="radio"
              accessibilityLabel={`Filter: ${filter.label}`}
              accessibilityState={{ checked: category === filter.id }}
              hitSlop={{ top: 4, bottom: 4 }}
              onPress={() => setCategory(filter.id)}
              style={({ pressed }) => [
                styles.chip,
                filter.id === 'directories' && styles.directoryChip,
                category === filter.id && styles.selectedChip,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.chipLabel, category === filter.id && styles.selectedChipLabel]}>{filter.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.goalRow}>
          <Text style={styles.goalLabel}>Matches my goals</Text>
          <Toggle label="Matches my goals" checked={matchesGoalsOnly} onChange={setMatchesGoalsOnly} />
        </View>

        <View style={styles.findings}>
          {visibleFindings.map(finding => (
            <Pressable
              key={finding.id}
              accessibilityRole="button"
              accessibilityLabel={`${finding.title}. ${finding.reason}. ${finding.source}. ${finding.risk} risk`}
              accessibilityHint="Opens this item for review"
              onPress={() => onOpenFinding(finding.id)}
              style={({ pressed }) => [styles.finding, pressed && styles.pressed]}
            >
              <View accessible={false} style={styles.avatar} />
              <View style={styles.findingText}>
                <Text numberOfLines={1} style={styles.findingTitle}>{finding.title}</Text>
                <Text numberOfLines={2} style={styles.findingReason}>{finding.reason}</Text>
                <Text style={styles.findingSource}>{finding.source}</Text>
              </View>
              <RiskBadge risk={finding.risk} compact />
            </Pressable>
          ))}
          {visibleFindings.length === 0 && (
            <Text accessibilityLiveRegion="polite" style={styles.empty}>
              {resolvedFindings.length > 0 ? 'Nothing left to review here.' : 'No sample findings match these filters.'}
            </Text>
          )}
        </View>

        {resolvedFindings.length > 0 && (
          <View style={styles.resolvedSection}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: showResolved }}
              accessibilityLabel={`Resolved, ${resolvedFindings.length} ${resolvedFindings.length === 1 ? 'item' : 'items'}`}
              onPress={() => setShowResolved(shown => !shown)}
              style={({ pressed }) => [styles.resolvedHeader, pressed && styles.pressed]}
            >
              <Text style={styles.resolvedTitle}>Resolved ({resolvedFindings.length})</Text>
              <Text accessible={false} style={styles.chevron}>{showResolved ? '⌃' : '⌄'}</Text>
            </Pressable>
            {showResolved && resolvedFindings.map(finding => (
              <View key={finding.id} style={styles.resolvedRow}>
                <Text numberOfLines={1} style={styles.resolvedRowTitle}>{finding.title}</Text>
                <Text style={styles.resolvedRowLabel}>{resolutionLabels[resolutions[finding.id]]}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.demoNote}>Sample findings only. Goal matches are preset.</Text>
        <Pressable accessibilityRole="button" onPress={onChooseAccounts} style={styles.chooseAccounts}>
          <Text style={styles.chooseAccountsLabel}>Choose demo accounts again</Text>
        </Pressable>
      </ScrollView>
      {notice && (
        <View accessibilityLiveRegion="polite" style={styles.notice}>
          <Text style={styles.noticeLabel}>{resolutionLabels[notice.resolution]}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Undo: ${resolutionLabels[notice.resolution]}`}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={onUndo}
            style={({ pressed }) => [styles.undo, pressed && styles.pressed]}
          >
            <Text style={styles.undoLabel}>Undo</Text>
          </Pressable>
        </View>
      )}
      <BottomTabs activeTab="Footprint" onTabPress={onTabPress} availableTabs={availableTabs} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingHorizontal: theme.space.lg, paddingBottom: theme.space.md },
  title: { color: theme.colors.ink, fontSize: 28, fontWeight: '700', lineHeight: 34 },
  subtitle: { marginTop: theme.space.xs, color: theme.colors.ink600, fontSize: 13, lineHeight: 18 },
  content: { paddingHorizontal: theme.space.lg, paddingBottom: theme.space.xl },
  summary: { paddingHorizontal: theme.space.lg, paddingVertical: theme.space.md, borderWidth: 1, borderColor: theme.colors.accountBorder, borderRadius: theme.radius.card, backgroundColor: theme.colors.surface },
  sectionTitle: { color: theme.colors.ink, fontSize: 15, fontWeight: '600', lineHeight: 20 },
  summaryCounts: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.lg, marginTop: theme.space.md },
  riskCount: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  count: { color: theme.colors.ink, fontSize: 15, fontWeight: '600', lineHeight: 20 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm, marginTop: 6 },
  chip: { minHeight: 36, alignItems: 'center', justifyContent: 'center', paddingHorizontal: theme.space.md, paddingVertical: 9, backgroundColor: theme.colors.chipFill, borderRadius: theme.radius.chip },
  directoryChip: { width: 168 },
  selectedChip: { backgroundColor: theme.colors.primary },
  chipLabel: { color: theme.colors.primary, fontSize: 13, fontWeight: '600', lineHeight: 18 },
  selectedChipLabel: { color: theme.colors.surface },
  goalRow: { minHeight: 48, marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: theme.space.md, paddingHorizontal: theme.space.lg, paddingVertical: 1, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.accountBorder, borderRadius: theme.radius.card },
  goalLabel: { flex: 1, color: theme.colors.ink, fontSize: 15, fontWeight: '600', lineHeight: 20 },
  findings: { marginTop: theme.space.xs, gap: theme.space.sm },
  finding: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: theme.space.md, paddingHorizontal: theme.space.lg, paddingVertical: 15, borderWidth: 1, borderColor: theme.colors.accountBorder, borderRadius: theme.radius.card, backgroundColor: theme.colors.surface },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: theme.colors.avatarFill },
  findingText: { flex: 1, minWidth: 0, gap: 2 },
  findingTitle: { color: theme.colors.ink, fontSize: 15, fontWeight: '600', lineHeight: 20 },
  findingReason: { color: theme.colors.ink600, fontSize: 13, lineHeight: 18 },
  findingSource: { color: theme.colors.accountMuted, fontSize: 12, lineHeight: 16 },
  resolvedCount: { color: theme.colors.muted, fontSize: 13, fontWeight: '400' },
  resolvedSection: { marginTop: theme.space.md, overflow: 'hidden', borderRadius: theme.radius.card, backgroundColor: theme.colors.disabledFill },
  resolvedHeader: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.space.lg },
  resolvedTitle: { color: theme.colors.ink600, fontSize: 15, fontWeight: '600', lineHeight: 20 },
  chevron: { color: theme.colors.ink600, fontSize: 16, lineHeight: 20 },
  resolvedRow: { gap: 2, paddingHorizontal: theme.space.lg, paddingVertical: theme.space.md, borderTopWidth: 1, borderTopColor: theme.colors.border, backgroundColor: theme.colors.surface },
  resolvedRowTitle: { color: theme.colors.ink600, fontSize: 15, lineHeight: 20 },
  resolvedRowLabel: { color: theme.colors.lowText, fontSize: 13, fontWeight: '500', lineHeight: 18 },
  notice: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: theme.space.md, marginHorizontal: theme.space.lg, marginBottom: theme.space.sm, paddingHorizontal: theme.space.lg, borderRadius: 12, backgroundColor: theme.colors.ink },
  noticeLabel: { flex: 1, color: theme.colors.surface, fontSize: 15, fontWeight: '600', lineHeight: 20 },
  undo: { minHeight: 44, justifyContent: 'center' },
  undoLabel: { color: theme.colors.chipFill, fontSize: 15, fontWeight: '700', lineHeight: 20 },
  empty: { paddingVertical: theme.space.xl, color: theme.colors.muted, fontSize: 15, lineHeight: 22, textAlign: 'center' },
  demoNote: { marginTop: theme.space.lg, color: theme.colors.muted, fontSize: 12, lineHeight: 18 },
  chooseAccounts: { minHeight: 44, alignItems: 'center', justifyContent: 'center', marginTop: theme.space.sm },
  chooseAccountsLabel: { color: theme.colors.primary, fontSize: 13, fontWeight: '500', lineHeight: 18 },
  pressed: { opacity: 0.7 },
});
