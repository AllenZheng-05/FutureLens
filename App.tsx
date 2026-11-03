import { useEffect, useState } from 'react';
import { Alert, BackHandler, Keyboard, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import type { Tab } from './src/components/BottomTabs';
import { ScanConfirmationSheet } from './src/components/ScanConfirmationSheet';
import { AccountSelectionScreen } from './src/screens/AccountSelectionScreen';
import { CheckPostScreen } from './src/screens/CheckPostScreen';
import { FootprintScreen } from './src/screens/FootprintScreen';
import { FootprintResultsScreen } from './src/screens/FootprintResultsScreen';
import { MyLensScreen } from './src/screens/MyLensScreen';
import { GoalSelectionScreen } from './src/screens/GoalSelectionScreen';
import { ScanProgressScreen } from './src/screens/ScanProgressScreen';
import { theme } from './src/theme';
import { demoFootprintFindings } from './src/data/demoFootprintFindings';
import { goalOptions } from './src/data/goalOptions';
import type { CheckPostRequest } from './src/types/checkPost';
import type { DemoAccountId, DemoScanRequest } from './src/types/footprint';
import type { GoalId } from './src/types/lens';

const availableTabs: readonly Tab[] = ['Check', 'My Lens', 'Footprint'];

function previewCheck(_request: CheckPostRequest) {
  // Replace this callback with the teammate-owned check/results flow.
  Alert.alert(
    'Post checking preview',
    'Your draft is ready. Post analysis is not available in this preview yet.',
    [{ text: 'Keep editing' }],
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Check');
  const [lensPage, setLensPage] = useState<'intro' | 'goals'>('intro');
  const [footprintPage, setFootprintPage] = useState<'intro' | 'accounts' | 'scan' | 'results'>('intro');
  const [scanAccountIds, setScanAccountIds] = useState<readonly DemoAccountId[]>([]);
  const [showScanConfirmation, setShowScanConfirmation] = useState(false);
  const showingFootprint = activeTab === 'Footprint' && footprintPage === 'intro';
  const showingAccounts = activeTab === 'Footprint' && footprintPage === 'accounts';
  const showingScan = activeTab === 'Footprint' && footprintPage === 'scan';
  const showingResults = activeTab === 'Footprint' && footprintPage === 'results';
  const showingMyLens = activeTab === 'My Lens' && lensPage === 'intro';
  const showingGoals = activeTab === 'My Lens' && lensPage === 'goals';

  function changeTab(tab: Tab) {
    if (!availableTabs.includes(tab)) return;
    Keyboard.dismiss();
    setShowScanConfirmation(false);
    if (tab === 'Footprint' && footprintPage !== 'results') setFootprintPage('intro');
    setActiveTab(tab);
  }

  function confirmSelectedAccounts(accountIds: readonly DemoAccountId[]) {
    if (accountIds.length === 0) return;
    setScanAccountIds([...accountIds]);
    setShowScanConfirmation(true);
  }

  function startDemoScan(request: DemoScanRequest) {
    if (request.accountIds.length === 0) return;
    setShowScanConfirmation(false);
    setScanAccountIds([...request.accountIds]);
    setFootprintPage('scan');
  }

  function previewGoalSelection(goalIds: readonly GoalId[]) {
    const labels = goalOptions.filter(goal => goalIds.includes(goal.id)).map(goal => goal.label);
    Alert.alert(
      'Goal selection preview',
      `${labels.join('\n')}\n\nFurther setup and personalized checks are outside this demo.`,
      [
        { text: 'Keep editing', style: 'cancel' },
        { text: 'Back to My Lens', onPress: () => setLensPage('intro') },
      ],
    );
  }

  useEffect(() => {
    if (activeTab === 'Check') return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showScanConfirmation) {
        setShowScanConfirmation(false);
      } else if (activeTab === 'My Lens' && lensPage === 'goals') {
        setLensPage('intro');
      } else if (activeTab === 'Footprint' && (footprintPage === 'scan' || footprintPage === 'results')) {
        setFootprintPage('accounts');
      } else if (activeTab === 'Footprint' && footprintPage === 'accounts') {
        setFootprintPage('intro');
      } else {
        setActiveTab('Check');
      }
      return true;
    });
    return () => subscription.remove();
  }, [activeTab, lensPage, footprintPage, showScanConfirmation]);

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
          style={[styles.page, !showingScan && styles.hidden]}
          accessibilityElementsHidden={!showingScan}
          importantForAccessibility={showingScan ? 'auto' : 'no-hide-descendants'}
        >
          <ScanProgressScreen
            active={showingScan}
            accountCount={scanAccountIds.length}
            onCancel={() => setFootprintPage('accounts')}
            onViewResults={() => setFootprintPage('results')}
          />
        </View>
        <View
          style={[styles.page, !showingResults && styles.hidden]}
          accessibilityElementsHidden={!showingResults}
          importantForAccessibility={showingResults ? 'auto' : 'no-hide-descendants'}
        >
          <FootprintResultsScreen
            findings={demoFootprintFindings}
            availableTabs={availableTabs}
            onTabPress={changeTab}
            onChooseAccounts={() => setFootprintPage('accounts')}
          />
        </View>
        <View
          style={[styles.page, !showingMyLens && styles.hidden]}
          accessibilityElementsHidden={!showingMyLens}
          importantForAccessibility={showingMyLens ? 'auto' : 'no-hide-descendants'}
        >
          <MyLensScreen
            onStartSetup={() => setLensPage('goals')}
            onTabPress={changeTab}
            availableTabs={availableTabs}
          />
        </View>
        <View
          style={[styles.page, !showingGoals && styles.hidden]}
          accessibilityElementsHidden={!showingGoals}
          importantForAccessibility={showingGoals ? 'auto' : 'no-hide-descendants'}
        >
          <GoalSelectionScreen
            onBack={() => setLensPage('intro')}
            onSkip={() => setLensPage('intro')}
            onContinue={previewGoalSelection}
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
        onAllow={startDemoScan}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: theme.colors.background },
  page: { flex: 1 },
  hidden: { display: 'none' },
});
