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
import { LensSummaryScreen } from './src/screens/LensSummaryScreen';
import type { LensSection } from './src/screens/LensSummaryScreen';
import { MultiSelectStepScreen } from './src/screens/MultiSelectStepScreen';
import { ScanProgressScreen } from './src/screens/ScanProgressScreen';
import { SharingRulesScreen } from './src/screens/SharingRulesScreen';
import { theme } from './src/theme';
import { demoFootprintFindings } from './src/data/demoFootprintFindings';
import { defaultSharingRules, perspectiveOptions, topicOptions } from './src/data/lensOptions';
import type { CheckPostRequest } from './src/types/checkPost';
import type { DemoAccountId, DemoScanRequest } from './src/types/footprint';
import type { GoalId, PerspectiveId, SharingRules, TopicId } from './src/types/lens';

type LensPage = 'intro' | 'goals' | 'perspectives' | 'topics' | 'sharing' | 'summary';

const previousLensPage: Record<Exclude<LensPage, 'intro'>, LensPage> = {
  goals: 'intro',
  perspectives: 'goals',
  topics: 'perspectives',
  sharing: 'topics',
  summary: 'sharing',
};

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
  const [lensPage, setLensPage] = useState<LensPage>('intro');
  const [lensGoalIds, setLensGoalIds] = useState<readonly GoalId[]>([]);
  const [lensPerspectiveIds, setLensPerspectiveIds] = useState<readonly PerspectiveId[]>([]);
  const [lensTopicIds, setLensTopicIds] = useState<readonly TopicId[]>([]);
  const [lensRules, setLensRules] = useState<SharingRules>(defaultSharingRules);
  // Set while a step is opened from a summary card's Edit: Next saves and returns, Back cancels.
  const [editingLens, setEditingLens] = useState(false);
  // Bumped on Edit so the step pages remount from the saved choices, dropping unsaved changes.
  const [lensEditCount, setLensEditCount] = useState(0);
  const [footprintPage, setFootprintPage] = useState<'intro' | 'accounts' | 'scan' | 'results'>('intro');
  const [scanAccountIds, setScanAccountIds] = useState<readonly DemoAccountId[]>([]);
  const [showScanConfirmation, setShowScanConfirmation] = useState(false);
  const showingFootprint = activeTab === 'Footprint' && footprintPage === 'intro';
  const showingAccounts = activeTab === 'Footprint' && footprintPage === 'accounts';
  const showingScan = activeTab === 'Footprint' && footprintPage === 'scan';
  const showingResults = activeTab === 'Footprint' && footprintPage === 'results';
  const showingMyLens = activeTab === 'My Lens' && lensPage === 'intro';
  const showingGoals = activeTab === 'My Lens' && lensPage === 'goals';
  const showingPerspectives = activeTab === 'My Lens' && lensPage === 'perspectives';
  const showingTopics = activeTab === 'My Lens' && lensPage === 'topics';
  const showingSharing = activeTab === 'My Lens' && lensPage === 'sharing';
  const showingSummary = activeTab === 'My Lens' && lensPage === 'summary';

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

  // After a step: go on to the next one, or back to the summary when editing.
  function advanceLens(next: LensPage) {
    if (editingLens) {
      setEditingLens(false);
      setLensPage('summary');
    } else {
      setLensPage(next);
    }
  }

  function lensBack() {
    if (lensPage === 'intro') return;
    if (editingLens && lensPage !== 'summary') {
      setEditingLens(false);
      setLensPage('summary');
    } else {
      setLensPage(previousLensPage[lensPage]);
    }
  }

  function continueFromGoals(goalIds: readonly GoalId[]) {
    setLensGoalIds([...goalIds]);
    advanceLens('perspectives');
  }

  function skipGoals() {
    if (editingLens) {
      continueFromGoals([]);
    } else {
      setLensPage('intro');
    }
  }

  function continueFromPerspectives(perspectiveIds: readonly PerspectiveId[]) {
    setLensPerspectiveIds([...perspectiveIds]);
    advanceLens('topics');
  }

  function continueFromTopics(topicIds: readonly TopicId[]) {
    setLensTopicIds([...topicIds]);
    advanceLens('sharing');
  }

  function reviewLens(rules: SharingRules) {
    setLensRules(rules);
    setEditingLens(false);
    setLensPage('summary');
  }

  function editLensSection(section: LensSection) {
    setLensEditCount(count => count + 1);
    setEditingLens(true);
    setLensPage(section);
  }

  // Placeholder until the "Your Lens is set" confirmation is built.
  function saveLens() {
    Alert.alert(
      'Save preview',
      'Your Lens choices are ready. The "Your Lens is set" confirmation is not available in this preview yet.',
      [
        { text: 'Keep reviewing', style: 'cancel' },
        { text: 'Back to My Lens', onPress: () => setLensPage('intro') },
      ],
    );
  }

  useEffect(() => {
    if (activeTab === 'Check') return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showScanConfirmation) {
        setShowScanConfirmation(false);
      } else if (activeTab === 'My Lens' && lensPage !== 'intro') {
        lensBack();
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
  }, [activeTab, lensPage, editingLens, footprintPage, showScanConfirmation]);

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
            key={`goals-${lensEditCount}`}
            initialIds={lensGoalIds}
            backLabel={editingLens ? 'Cancel and return to Your Lens' : undefined}
            onBack={lensBack}
            onSkip={skipGoals}
            onContinue={continueFromGoals}
          />
        </View>
        <View
          style={[styles.page, !showingPerspectives && styles.hidden]}
          accessibilityElementsHidden={!showingPerspectives}
          importantForAccessibility={showingPerspectives ? 'auto' : 'no-hide-descendants'}
        >
          <MultiSelectStepScreen
            key={`perspectives-${lensEditCount}`}
            step={2}
            totalSteps={4}
            title="Whose eyes worry you most?"
            options={perspectiveOptions}
            initialIds={lensPerspectiveIds}
            backLabel={editingLens ? 'Cancel and return to Your Lens' : 'Back to goals'}
            skipLabel="Skip perspective selection for now"
            onBack={lensBack}
            onSkip={() => continueFromPerspectives([])}
            onContinue={continueFromPerspectives}
          />
        </View>
        <View
          style={[styles.page, !showingTopics && styles.hidden]}
          accessibilityElementsHidden={!showingTopics}
          importantForAccessibility={showingTopics ? 'auto' : 'no-hide-descendants'}
        >
          <MultiSelectStepScreen
            key={`topics-${lensEditCount}`}
            step={3}
            totalSteps={4}
            title="What should Lens watch for?"
            options={topicOptions}
            initialIds={lensTopicIds}
            backLabel={editingLens ? 'Cancel and return to Your Lens' : 'Back to perspectives'}
            skipLabel="Skip topic selection for now"
            onBack={lensBack}
            onSkip={() => continueFromTopics([])}
            onContinue={continueFromTopics}
          />
        </View>
        <View
          style={[styles.page, !showingSharing && styles.hidden]}
          accessibilityElementsHidden={!showingSharing}
          importantForAccessibility={showingSharing ? 'auto' : 'no-hide-descendants'}
        >
          <SharingRulesScreen
            key={`sharing-${lensEditCount}`}
            topicIds={lensTopicIds}
            initialRules={lensRules}
            backLabel={editingLens ? 'Cancel and return to Your Lens' : undefined}
            onBack={lensBack}
            onReview={reviewLens}
          />
        </View>
        <View
          style={[styles.page, !showingSummary && styles.hidden]}
          accessibilityElementsHidden={!showingSummary}
          importantForAccessibility={showingSummary ? 'auto' : 'no-hide-descendants'}
        >
          <LensSummaryScreen
            goalIds={lensGoalIds}
            perspectiveIds={lensPerspectiveIds}
            topicIds={lensTopicIds}
            rules={lensRules}
            onBack={lensBack}
            onEdit={editLensSection}
            onSave={saveLens}
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
