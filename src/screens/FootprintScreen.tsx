
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabs } from '../components/BottomTabs';
import type { Tab } from '../components/BottomTabs';
import { PrimaryButton } from '../components/PrimaryButton';
import { theme } from '../theme';

type Props = {
  onConnectAccounts: () => void;
  onTabPress: (tab: Tab) => void;
  availableTabs: readonly Tab[];
};

// Decorative fingerprint illustration.
function FootprintIllustration() {
  return (
    <View
      style={styles.illustration}
      accessible
      accessibilityLabel="Digital footprint and privacy illustration"
    >
      <View style={styles.outerCircle}>
        <View style={styles.innerCircle}>
          <View style={styles.fingerprint}>
            <View style={[styles.fingerprintLine, styles.ringOne]} />
            <View style={[styles.fingerprintLine, styles.ringTwo]} />
            <View style={[styles.fingerprintLine, styles.ringThree]} />
            <View style={[styles.fingerprintLine, styles.ringFour]} />
            <View style={styles.fingerprintCenter} />
          </View>
        </View>
      </View>

      <View style={[styles.iconBubble, styles.lockBubble]}>
        <Text style={styles.iconText}>🔒</Text>
      </View>

      <View style={[styles.iconBubble, styles.eyeBubble]}>
        <Text style={styles.iconText}>👁️</Text>
      </View>

      <View style={[styles.iconBubble, styles.shieldBubble]}>
        <Text style={styles.iconText}>🛡️</Text>
      </View>
    </View>
  );
}

// Figma: Footprint - 1 (60:676). Connection and scan logic live outside this page.
export function FootprintScreen({ onConnectAccounts, onTabPress, availableTabs }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 48) + 14 }]}>
        <Text accessibilityRole="header" style={styles.title}>Your Digital Footprint</Text>
        <Text style={styles.subtitle}>See what a stranger could find on you</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.content}>
        <FootprintIllustration />

        <Text style={styles.description}>
          Footprint Lens scans your accounts and the open web, then helps you clean up.
        </Text>
      </ScrollView>

      <View style={styles.action}>
        <PrimaryButton
          label="Connect Accounts"
          onPress={onConnectAccounts}
          style={styles.connectButton}
        />
      </View>
      <BottomTabs activeTab="Footprint" onTabPress={onTabPress} availableTabs={availableTabs} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    paddingHorizontal: theme.space.lg,
    paddingBottom: theme.space.lg,
  },
  title: {
    color: theme.colors.ink,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  subtitle: {
    marginTop: 14,
    color: theme.colors.accentText,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
  },
  body: { flex: 1 },
  content: {
    flexGrow: 1,
    minHeight: 340,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.space.xl,
    paddingVertical: 20,
  },
  description: {
    width: '100%',
    maxWidth: 320,
    color: theme.colors.ink,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 30,
    textAlign: 'center',
  },
  action: {
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.sm,
    paddingBottom: 10,
  },
  connectButton: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 287,
    minHeight: 54,
  },

  // Fingerprint illustration styles.
  illustration: {
    width: 260,
    height: 235,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  outerCircle: {
    width: 202,
    height: 202,
    borderRadius: 101,
    backgroundColor: '#EAE9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 154,
    height: 154,
    borderRadius: 77,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: '#D8D7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fingerprint: {
    width: 112,
    height: 125,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fingerprintLine: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: theme.colors.primary,
    borderBottomColor: 'transparent',
  },
  ringOne: {
    width: 102,
    height: 112,
    borderRadius: 52,
  },
  ringTwo: {
    width: 82,
    height: 94,
    borderRadius: 42,
  },
  ringThree: {
    width: 62,
    height: 76,
    borderRadius: 32,
  },
  ringFour: {
    width: 42,
    height: 58,
    borderRadius: 22,
  },
  fingerprintCenter: {
    width: 17,
    height: 34,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    borderBottomColor: 'transparent',
  },
  iconBubble: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  iconText: {
    fontSize: 23,
    textAlign: 'center',
  },
  lockBubble: {
    top: 22,
    left: 12,
  },
  eyeBubble: {
    top: 43,
    right: 4,
  },
  shieldBubble: {
    bottom: 10,
    right: 14,
  },
});
