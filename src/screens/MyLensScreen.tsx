import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabs } from '../components/BottomTabs';
import type { Tab } from '../components/BottomTabs';
import { PrimaryButton } from '../components/PrimaryButton';
import { theme } from '../theme';

type Props = {
  onStartSetup: () => void;
  onTabPress: (tab: Tab) => void;
  availableTabs: readonly Tab[];
};

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

export function MyLensScreen({ onStartSetup, onTabPress, availableTabs }: Props) {
  const insets = useSafeAreaInsets();

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
});
