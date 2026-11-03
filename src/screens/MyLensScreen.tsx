import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabs } from '../components/BottomTabs';
import type { Tab } from '../components/BottomTabs';
import { PrimaryButton } from '../components/PrimaryButton';
import { SuccessBadge } from '../components/SuccessBadge';
import { TagPill } from '../components/TagPill';
import { theme } from '../theme';

// Display-ready labels for a saved Lens.
export type SavedLensSummary = {
  focus: string;
  goals: readonly string[];
  perspectives: readonly string[];
  topics: readonly string[];
};

type Props = {
  savedLens?: SavedLensSummary;
  onStartSetup: () => void;
  onEditLens?: () => void;
  onTabPress: (tab: Tab) => void;
  availableTabs: readonly Tab[];
};

function SavedSection({ title, labels }: { title: string; labels: readonly string[] }) {
  return (
    <View style={styles.savedSection}>
      <Text style={styles.savedSectionTitle}>{title}</Text>
      {labels.length === 0 ? (
        <Text style={styles.savedEmpty}>Skipped</Text>
      ) : (
        <View style={styles.tags}>
          {labels.map(label => <TagPill key={label} label={label} />)}
        </View>
      )}
    </View>
  );
}

// Original layers from Figma's Lens - 1 frame (26:458), in their design order.
// Absolute positioning is limited to this fixed-size decorative illustration.
function LensIllustration() {
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={styles.illustration}
    >
      <Image source={require('../../assets/illustrations/lens-disc.png')} style={styles.disc} />
      <Image source={require('../../assets/illustrations/lens-center.png')} style={styles.center} />
      <Image source={require('../../assets/illustrations/lens-yellow.png')} style={styles.yellow} />
      <Image source={require('../../assets/illustrations/lens-green.png')} style={styles.greenTop} />
      <Image source={require('../../assets/illustrations/lens-orange.png')} style={styles.orange} />
      <Image source={require('../../assets/illustrations/lens-red.png')} style={styles.red} />
      <Image source={require('../../assets/illustrations/lens-green.png')} style={styles.greenBottom} />
      <Image source={require('../../assets/illustrations/lens-ring.png')} style={styles.ring} />
    </View>
  );
}

export function MyLensScreen({ savedLens, onStartSetup, onEditLens, onTabPress, availableTabs }: Props) {
  const insets = useSafeAreaInsets();

  if (savedLens) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle="dark-content" />
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 48) + 14 }]}>
          <Text accessibilityRole="header" style={styles.title}>My Future Lens</Text>
        </View>

        <ScrollView contentContainerStyle={styles.savedContent}>
          <View style={styles.statusCard}>
            <SuccessBadge size={40} />
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>Your Lens is on</Text>
              <Text style={styles.statusFocus}>{`Checks focus on ${savedLens.focus}.`}</Text>
            </View>
          </View>
          <SavedSection title="Goals" labels={savedLens.goals} />
          <SavedSection title="Perspectives" labels={savedLens.perspectives} />
          <SavedSection title="Watching for" labels={savedLens.topics} />
        </ScrollView>

        <View style={styles.action}>
          <PrimaryButton label="Edit my Lens" onPress={onEditLens ?? onStartSetup} style={styles.setupButton} />
        </View>
        <BottomTabs activeTab="My Lens" onTabPress={onTabPress} availableTabs={availableTabs} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 48) + 14 }]}>
        <Text accessibilityRole="header" style={styles.title}>Set up my Future Lens</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <LensIllustration />
        <Text accessibilityRole="header" style={styles.introTitle}>
          Tell Future Lens what matters to you
        </Text>
        <Text style={styles.description}>
          Your goals decide what gets flagged, so every check fits your future.
        </Text>
      </ScrollView>

      <View style={styles.action}>
        <PrimaryButton
          label="Set up my Lens"
          onPress={onStartSetup}
          style={styles.setupButton}
        />
      </View>
      <BottomTabs activeTab="My Lens" onTabPress={onTabPress} availableTabs={availableTabs} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingHorizontal: theme.space.lg, paddingBottom: theme.space.lg },
  title: { color: theme.colors.ink, fontSize: 28, fontWeight: '700', lineHeight: 34 },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 48,
    paddingBottom: theme.space.xl,
  },
  illustration: { width: 160, height: 160 },
  disc: { position: 'absolute', left: 0, top: 0, width: 160, height: 160 },
  center: { position: 'absolute', left: 52, top: 52, width: 56, height: 56 },
  yellow: { position: 'absolute', left: 112.5, top: 33.5, width: 14, height: 14 },
  greenTop: { position: 'absolute', left: 0.5, top: 1, width: 20, height: 20 },
  orange: { position: 'absolute', left: 139.5, top: 1, width: 20, height: 20 },
  red: { position: 'absolute', left: 0.5, top: 139, width: 20, height: 20 },
  greenBottom: { position: 'absolute', left: 139.5, top: 139, width: 20, height: 20 },
  ring: { position: 'absolute', left: 24, top: 24, width: 112, height: 112 },
  introTitle: {
    maxWidth: 329,
    marginTop: 40,
    color: theme.colors.heading,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center',
  },
  description: {
    maxWidth: 329,
    marginTop: 14,
    color: theme.colors.secondaryText,
    fontSize: 15,
    lineHeight: 19,
    textAlign: 'center',
  },
  action: { paddingHorizontal: theme.space.sm, paddingVertical: theme.space.sm },
  setupButton: { minHeight: 54 },
  savedContent: { paddingHorizontal: theme.space.lg, paddingBottom: theme.space.xl, gap: theme.space.lg },
  statusCard: { flexDirection: 'row', alignItems: 'center', gap: theme.space.md, padding: theme.space.lg, borderWidth: 1, borderColor: theme.colors.primary, borderRadius: theme.radius.card, backgroundColor: theme.colors.chipFill },
  statusText: { flex: 1 },
  statusTitle: { color: theme.colors.ink, fontSize: 17, fontWeight: '700', lineHeight: 22 },
  statusFocus: { marginTop: 2, color: theme.colors.ink600, fontSize: 15, lineHeight: 20 },
  savedSection: { gap: theme.space.sm },
  savedSectionTitle: { color: theme.colors.muted, fontSize: 14, fontWeight: '600', lineHeight: 20 },
  savedEmpty: { color: theme.colors.secondaryText, fontSize: 15, lineHeight: 20 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm },
});
