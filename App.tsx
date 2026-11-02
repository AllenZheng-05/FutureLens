import { useEffect, useState } from 'react';
import { Alert, BackHandler, Keyboard, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import type { Tab } from './src/components/BottomTabs';
import { ScanConfirmationSheet } from './src/components/ScanConfirmationSheet';
import { AccountSelectionScreen } from './src/screens/AccountSelectionScreen';
import { CheckPostScreen } from './src/screens/CheckPostScreen';
import { FootprintScreen } from './src/screens/FootprintScreen';
import { MyLensScreen } from './src/screens/MyLensScreen';
import { theme } from './src/theme';
import type { CheckPostRequest } from './src/types/checkPost';
import type { DemoAccountId, DemoScanRequest } from './src/types/footprint';

const availableTabs: readonly Tab[] = ['Check', 'My Lens', 'Footprint'];

function previewCheck(_request: CheckPostRequest) {
  // Replace this callback with the teammate-owned check/results flow.
  Alert.alert(
    'Post checking preview',
    'Your draft is ready. Post analysis is not available in this preview yet.',
    [{ text: 'Keep editing' }],
  );
}

function previewLensSetup() {
  Alert.alert(
    'Lens setup preview',
    'Goal selection is not available in this preview yet.',
    [{ text: 'Back to My Lens' }],
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Check');
  const [footprintPage, setFootprintPage] = useState<'intro' | 'accounts'>('intro');
  const [scanAccountIds, setScanAccountIds] = useState<readonly DemoAccountId[]>([]);
  const [showScanConfirmation, setShowScanConfirmation] = useState(false);
  const showingFootprint = activeTab === 'Footprint' && footprintPage === 'intro';
  const showingAccounts = activeTab === 'Footprint' && footprintPage === 'accounts';

  function changeTab(tab: Tab) {
    if (!availableTabs.includes(tab)) return;
    Keyboard.dismiss();
    setShowScanConfirmation(false);
    if (tab === 'Footprint') setFootprintPage('intro');
    setActiveTab(tab);
  }

  function confirmSelectedAccounts(accountIds: readonly DemoAccountId[]) {
    if (accountIds.length === 0) return;
    setScanAccountIds([...accountIds]);
    setShowScanConfirmation(true);
  }

  function previewScan(request: DemoScanRequest) {
    setShowScanConfirmation(false);
    Alert.alert(
      'Read-only scan preview',
      `${request.accountIds.length} demo account${request.accountIds.length === 1 ? '' : 's'} selected. Scanning is not available in this preview yet.`,
      [{ text: 'Keep choosing' }],
    );
  }

  useEffect(() => {
    if (activeTab === 'Check') return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showScanConfirmation) {
        setShowScanConfirmation(false);
      } else if (activeTab === 'Footprint' && footprintPage === 'accounts') {
        setFootprintPage('intro');
      } else {
        setActiveTab('Check');
      }
      return true;
    });
    return () => subscription.remove();
  }, [activeTab, footprintPage, showScanConfirmation]);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <View style={styles.app}>
        {/* Keep pages mounted so switching tabs preserves the draft and choices. */}
        <View
          style={[styles.page, activeTab !== 'Check' && styles.hidden]}
          accessibilityElementsHidden={activeTab !== 'Check'}
          importantForAccessibility={activeTab === 'Check' ? 'auto' : 'no-hide-descendants'}
        >
          <CheckPostScreen
            onCheck={previewCheck}
            onTabPress={changeTab}
            availableTabs={availableTabs}
          />
        </View>
        <View
          style={[styles.page, activeTab !== 'My Lens' && styles.hidden]}
          accessibilityElementsHidden={activeTab !== 'My Lens'}
          importantForAccessibility={activeTab === 'My Lens' ? 'auto' : 'no-hide-descendants'}
        >
          <MyLensScreen
            onStartSetup={previewLensSetup}
            onTabPress={changeTab}
            availableTabs={availableTabs}
          />
        </View>
        <View
          style={[styles.page, !showingFootprint && styles.hidden]}
          accessibilityElementsHidden={!showingFootprint}
          importantForAccessibility={showingFootprint ? 'auto' : 'no-hide-descendants'}
        >
          <FootprintScreen
            onConnectAccounts={() => setFootprintPage('accounts')}
            onTabPress={changeTab}
            availableTabs={availableTabs}
          />
        </View>
        <View
          style={[styles.page, !showingAccounts && styles.hidden]}
          accessibilityElementsHidden={!showingAccounts}
          importantForAccessibility={showingAccounts ? 'auto' : 'no-hide-descendants'}
        >
          <AccountSelectionScreen
            onBack={() => setFootprintPage('intro')}
            onContinue={confirmSelectedAccounts}
          />
        </View>
      </View>
      <ScanConfirmationSheet
        visible={showScanConfirmation}
        accountIds={scanAccountIds}
        onCancel={() => setShowScanConfirmation(false)}
        onAllow={previewScan}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: theme.colors.background },
  page: { flex: 1 },
  hidden: { display: 'none' },
});
