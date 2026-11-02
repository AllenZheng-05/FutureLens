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
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.space.xl,
    paddingBottom: 32,
  },
  description: {
    width: '100%',
    maxWidth: 332,
    color: theme.colors.ink,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 24,
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
});
