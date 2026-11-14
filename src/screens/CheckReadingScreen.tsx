import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackHeader } from '../components/BackHeader';
import { FixActionSheet } from '../components/FixActionSheet';
import { PrimaryButton } from '../components/PrimaryButton';
import { RiskBadge } from '../components/RiskBadge';
import { theme } from '../theme';
import type { CheckPostRequest, FixKind, PostCheckResult, ReaderId } from '../types/checkPost';

type Props = {
  request: CheckPostRequest;
  result: PostCheckResult;
  onBack: () => void;
  onPostAnyway: () => void;
  onChooseFix: (kind: FixKind) => void;
};

const riskRank = { high: 2, medium: 1, low: 0 } as const;

// Figma: Check - 5. Reader cards with the selected reader's interpretation shown
// inline (instead of Check - 5b1's popup), plus the dashed draft preview.
export function CheckReadingScreen({ request, result, onBack, onPostAnyway, onChooseFix }: Props) {
  const [selectedId, setSelectedId] = useState<ReaderId>(
    // Open on the reader with the biggest concern.
    [...result.readers].sort((a, b) => riskRank[b.risk] - riskRank[a.risk])[0]?.id ?? 'employers',
  );
  const [showFixSheet, setShowFixSheet] = useState(false);
  const selected = result.readers.find(reader => reader.id === selectedId) ?? result.readers[0];

  return (
    <View style={styles.screen}>
      <BackHeader title="How this could be read" onBack={onBack} backLabel="Back to draft" />

      <ScrollView contentContainerStyle={styles.content}>
        <View accessibilityRole="radiogroup" accessibilityLabel="How this could be read" style={styles.grid}>
          {result.readers.map(reader => {
            const selectedReader = reader.id === selected?.id;
            return (
              <Pressable
                key={reader.id}
                accessibilityRole="radio"
                accessibilityLabel={`${reader.label}: ${reader.risk} concern`}
                accessibilityState={{ checked: selectedReader }}
                onPress={() => setSelectedId(reader.id)}
                style={({ pressed }) => [
                  styles.readerCard,
                  selectedReader && styles.selectedReaderCard,
                  pressed && styles.pressed,
                ]}
              >
                <Text numberOfLines={1} style={styles.readerLabel}>{reader.label}</Text>
                <View accessible={false} style={[styles.dot, { backgroundColor: theme.colors[`${reader.risk}Dot`] }]} />
              </Pressable>
            );
          })}
        </View>

        {selected && (
          <View accessibilityLiveRegion="polite" style={styles.interpretation}>
            <View style={styles.interpretationHead}>
              <Text style={styles.readerTitle}>{selected.label}</Text>
              <RiskBadge risk={selected.risk} compact />
            </View>
            <Text style={styles.reading}>{selected.reading}</Text>
          </View>
        )}

        <View style={styles.draftBox}>
          <Text style={styles.draftText}>{request.draft}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Post anyway as written"
          onPress={onPostAnyway}
          style={({ pressed }) => [styles.postAnyway, pressed && styles.pressed]}
        >
          <Text style={styles.postAnywayLabel}>Post anyway</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.action}>
        <PrimaryButton label="Fix this post" onPress={() => setShowFixSheet(true)} />
      </View>

      <FixActionSheet
        visible={showFixSheet}
        hasRewrites={result.rewrites.length > 0}
        hasContexts={result.contexts.length > 0}
        onSelect={(kind) => {
          setShowFixSheet(false);
          onChooseFix(kind);
        }}
        onCancel={() => setShowFixSheet(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.md, paddingBottom: theme.space.xl, gap: theme.space.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm },
  readerCard: {
    width: '48%',
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.space.sm,
    paddingHorizontal: theme.space.md,
    paddingVertical: 10,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
  },
  selectedReaderCard: { backgroundColor: theme.colors.chipFill, borderColor: theme.colors.primary },
  readerLabel: { flex: 1, minWidth: 0, color: theme.colors.ink, fontSize: 13, fontWeight: '600', lineHeight: 18 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  interpretation: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.card,
    padding: theme.space.lg,
    gap: theme.space.sm,
  },
  interpretationHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.space.sm },
  readerTitle: { color: theme.colors.ink, fontSize: 15, fontWeight: '600', lineHeight: 20 },
  reading: { color: theme.colors.ink600, fontSize: 14, lineHeight: 21 },
  draftBox: {
    minHeight: 160,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.colors.accountBorder,
    borderRadius: theme.radius.card,
    padding: theme.space.lg,
  },
  draftText: { color: theme.colors.ink, fontSize: 16, lineHeight: 24 },
  postAnyway: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  postAnywayLabel: { color: theme.colors.primary, fontSize: 13, fontWeight: '600', lineHeight: 18 },
  action: { paddingHorizontal: theme.space.lg, paddingVertical: theme.space.sm },
  pressed: { opacity: 0.75 },
});
