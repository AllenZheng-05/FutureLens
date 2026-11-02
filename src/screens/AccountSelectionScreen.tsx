import { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackHeader } from '../components/BackHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { Toggle } from '../components/Toggle';
import { demoAccounts } from '../data/demoAccounts';
import { theme } from '../theme';
import type { DemoAccountId } from '../types/footprint';

type Props = {
  onBack: () => void;
  onContinue: (accountIds: readonly DemoAccountId[]) => void;
};

// Figma: Footprint - 2 (61:711). This screen only selects fictional demo accounts.
export function AccountSelectionScreen({ onBack, onContinue }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedIds, setSelectedIds] = useState<readonly DemoAccountId[]>(() =>
    demoAccounts.filter(account => account.available && account.initiallySelected).map(account => account.id),
  );
  const selectedAccountIds = demoAccounts
    .filter(account => account.available && selectedIds.includes(account.id))
    .map(account => account.id);

  function setAccountSelected(id: DemoAccountId, checked: boolean) {
    if (!demoAccounts.find(account => account.id === id)?.available) return;
    setSelectedIds(previous => checked
      ? previous.includes(id) ? previous : [...previous, id]
      : previous.filter(selectedId => selectedId !== id));
  }

  function continueWithSelection() {
    if (selectedAccountIds.length === 0) return;
    onContinue(selectedAccountIds);
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <BackHeader title="Choose accounts to scan" onBack={onBack} backLabel="Back to Footprint" />

      <ScrollView contentContainerStyle={styles.content}>
        {demoAccounts.map(account => (
          <View key={account.id} style={[styles.account, !account.available && styles.unavailable]}>
            <Image
              accessible={false}
              source={require('../../assets/icons/account-avatar.png')}
              style={styles.avatar}
            />
            <View style={styles.accountText}>
              <Text style={styles.accountLabel}>{account.label}</Text>
              <Text style={styles.accountSubtitle}>{account.subtitle}</Text>
            </View>
            <Toggle
              label={`Scan ${account.label}, ${account.subtitle}`}
              checked={selectedIds.includes(account.id)}
              disabled={!account.available}
              onChange={checked => setAccountSelected(account.id, checked)}
            />
          </View>
        ))}
        <Text style={styles.demoNote}>Demo accounts. No real accounts are connected.</Text>
      </ScrollView>

      <View style={[styles.action, { paddingBottom: Math.max(insets.bottom, 16) + 48 }]}>
        {selectedAccountIds.length === 0 && (
          <Text accessibilityLiveRegion="polite" style={styles.validation}>
            Select at least one account to continue.
          </Text>
        )}
        <PrimaryButton label="Continue" disabled={selectedAccountIds.length === 0} onPress={continueWithSelection} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.space.lg, paddingBottom: theme.space.xl, gap: theme.space.md },
  account: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    gap: theme.space.md,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.accountBorder,
    borderRadius: theme.radius.card,
  },
  avatar: { width: 36, height: 36 },
  accountText: { flex: 1, minWidth: 0, gap: 2 },
  accountLabel: { color: theme.colors.accountInk, fontSize: 15, fontWeight: '600', lineHeight: 20 },
  accountSubtitle: { color: theme.colors.accountMuted, fontSize: 13, lineHeight: 18 },
  unavailable: { opacity: 0.5 },
  demoNote: { marginTop: theme.space.xs, color: theme.colors.accountMuted, fontSize: 13, lineHeight: 18 },
  action: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.sm, gap: theme.space.sm },
  validation: { color: theme.colors.muted, fontSize: 13, lineHeight: 18, textAlign: 'center' },
});
