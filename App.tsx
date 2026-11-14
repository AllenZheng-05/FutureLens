import { useEffect, useState } from 'react';
import { Alert, BackHandler, Keyboard, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import type { Tab } from './src/components/BottomTabs';
import { DeleteConfirmDialog } from './src/components/DeleteConfirmDialog';
import { FindingActionSheet } from './src/components/FindingActionSheet';
import { ScanConfirmationSheet } from './src/components/ScanConfirmationSheet';
import { AccountSelectionScreen } from './src/screens/AccountSelectionScreen';
import { CheckPostScreen } from './src/screens/CheckPostScreen';
import { EditCaptionScreen } from './src/screens/EditCaptionScreen';
import { FindingDetailScreen } from './src/screens/FindingDetailScreen';
import { FootprintScreen } from './src/screens/FootprintScreen';
import { FootprintResultsScreen } from './src/screens/FootprintResultsScreen';
import { MyLensScreen } from './src/screens/MyLensScreen';
import { RequestRemovalScreen } from './src/screens/RequestRemovalScreen';
import type { SavedLensSummary } from './src/screens/MyLensScreen';
import { GoalSelectionScreen } from './src/screens/GoalSelectionScreen';
import { LensSetScreen } from './src/screens/LensSetScreen';
import { LensSummaryScreen } from './src/screens/LensSummaryScreen';
import type { LensSection } from './src/screens/LensSummaryScreen';
import { MultiSelectStepScreen } from './src/screens/MultiSelectStepScreen';
import { ScanProgressScreen } from './src/screens/ScanProgressScreen';
import { SharingRulesScreen } from './src/screens/SharingRulesScreen';
import { theme } from './src/theme';
import { demoFootprintFindings } from './src/data/demoFootprintFindings';
import { immediateResolutions } from './src/data/findingActions';
import { describeLensFocus, goalOptions } from './src/data/goalOptions';
import { defaultSharingRules, perspectiveOptions, topicOptions } from './src/data/lensOptions';
import type { CheckPostRequest } from './src/types/checkPost';
import type { DemoAccountId, DemoScanRequest, FindingAction, Resolution, ResolutionNotice } from './src/types/footprint';
import type { GoalId, LensOption, PerspectiveId, SavedLens, SharingRules, TopicId } from './src/types/lens';

type LensPage = 'intro' | 'goals' | 'perspectives' | 'topics' | 'sharing' | 'summary' | 'set';

const previousLensPage: Record<Exclude<LensPage, 'intro'>, LensPage> = {
  goals: 'intro',
  perspectives: 'goals',
  topics: 'perspectives',
  sharing: 'topics',
  summary: 'sharing',
  set: 'intro',
};

function labelsOf<T extends string>(options: readonly LensOption<T>[], ids: readonly T[]) {
  return options.filter(option => ids.includes(option.id)).map(option => option.label);
}

function summarizeLens(lens: SavedLens): SavedLensSummary {
  return {
    focus: describeLensFocus(lens.goalIds),
    goals: labelsOf(goalOptions, lens.goalIds),
    perspectives: labelsOf(perspectiveOptions, lens.perspectiveIds),
    topics: labelsOf(topicOptions, lens.topicIds),
  };
}

const availableTabs: readonly Tab[] = ['Check', 'My Lens', 'Footprint'];

type FootprintPage = 'intro' | 'accounts' | 'scan' | 'results' | 'detail' | 'edit' | 'removal';

// Pages reached after a scan. Returning to the Footprint tab keeps the user on these.
const footprintReviewPages: readonly FootprintPage[] = ['results', 'detail', 'edit', 'removal'];

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
  // The last Lens saved from the summary; drafts above can differ until saved again.
  const [savedLens, setSavedLens] = useState<SavedLens | null>(null);
  const [footprintPage, setFootprintPage] = useState<FootprintPage>('intro');
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // How each reviewed finding was handled, for this session only. Nothing is posted or deleted.
  const [resolutions, setResolutions] = useState<Readonly<Record<string, Resolution>>>({});
  // The latest resolution, shown on the results list with Undo.
  const [resolutionNotice, setResolutionNotice] = useState<ResolutionNotice | null>(null);
  const [scanAccountIds, setScanAccountIds] = useState<readonly DemoAccountId[]>([]);
  const [showScanConfirmation, setShowScanConfirmation] = useState(false);
  const showingFootprint = activeTab === 'Footprint' && footprintPage === 'intro';
  const showingAccounts = activeTab === 'Footprint' && footprintPage === 'accounts';
  const showingScan = activeTab === 'Footprint' && footprintPage === 'scan';
  const showingResults = activeTab === 'Footprint' && footprintPage === 'results';
  const showingFindingDetail = activeTab === 'Footprint' && footprintPage === 'detail';
  const showingEditCaption = activeTab === 'Footprint' && footprintPage === 'edit';
  const showingRequestRemoval = activeTab === 'Footprint' && footprintPage === 'removal';
  const selectedFinding = demoFootprintFindings.find(finding => finding.id === selectedFindingId);
  const showingMyLens = activeTab === 'My Lens' && lensPage === 'intro';
  const showingGoals = activeTab === 'My Lens' && lensPage === 'goals';
  const showingPerspectives = activeTab === 'My Lens' && lensPage === 'perspectives';
  const showingTopics = activeTab === 'My Lens' && lensPage === 'topics';
  const showingSharing = activeTab === 'My Lens' && lensPage === 'sharing';
  const showingSummary = activeTab === 'My Lens' && lensPage === 'summary';
  const showingLensSet = activeTab === 'My Lens' && lensPage === 'set';

  function changeTab(tab: Tab) {
    if (!availableTabs.includes(tab)) return;
    Keyboard.dismiss();
    setShowScanConfirmation(false);
    setShowActionSheet(false);
    setShowDeleteConfirm(false);
    if (tab === 'Footprint' && !footprintReviewPages.includes(footprintPage)) setFootprintPage('intro');
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

  function openFinding(findingId: string) {
    setSelectedFindingId(findingId);
    setResolutionNotice(null);
    setFootprintPage('detail');
  }

  // Marks the open finding as handled and returns to the results list with Undo.
  function resolveSelectedFinding(resolution: Resolution) {
    if (!selectedFindingId) return;
    const findingId = selectedFindingId;
    setResolutions(current => ({ ...current, [findingId]: resolution }));
    setResolutionNotice({ findingId, resolution });
    setShowActionSheet(false);
    setShowDeleteConfirm(false);
    setFootprintPage('results');
  }

  function undoResolution() {
    if (!resolutionNotice) return;
    const { findingId } = resolutionNotice;
    setResolutions(current => {
      const { [findingId]: _undone, ...rest } = current;
      return rest;
    });
    setResolutionNotice(null);
  }

  function chooseFindingAction(action: FindingAction) {
    setShowActionSheet(false);
    if (action === 'delete') {
      setShowDeleteConfirm(true);
      return;
    }
    if (action === 'edit') {
      setFootprintPage('edit');
      return;
    }
    if (action === 'request-removal') {
      setFootprintPage('removal');
      return;
    }
    const resolution = immediateResolutions[action];
    if (resolution) resolveSelectedFinding(resolution);
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
    } else if (lensPage === 'summary' && savedLens) {
      // Once saved, the summary is opened from the My Lens tab, so back returns there.
      setLensPage('intro');
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

  function saveLens() {
    setSavedLens({
      goalIds: [...lensGoalIds],
      perspectiveIds: [...lensPerspectiveIds],
      topicIds: [...lensTopicIds],
      rules: lensRules,
    });
    setEditingLens(false);
    setLensPage('set');
  }

  function openSavedLens() {
    setEditingLens(false);
    setLensPage('summary');
  }

  function tryLensOnDraft() {
    setLensPage('intro');
    changeTab('Check');
  }

  useEffect(() => {
    if (activeTab === 'Check') return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showScanConfirmation) {
        setShowScanConfirmation(false);
      } else if (showActionSheet) {
        setShowActionSheet(false);
      } else if (showDeleteConfirm) {
        setShowDeleteConfirm(false);
      } else if (activeTab === 'My Lens' && lensPage !== 'intro') {
        lensBack();
      } else if (activeTab === 'Footprint' && (footprintPage === 'edit' || footprintPage === 'removal')) {
        setFootprintPage('detail');
      } else if (activeTab === 'Footprint' && footprintPage === 'detail') {
        setFootprintPage('results');
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
  }, [activeTab, lensPage, editingLens, savedLens, footprintPage, showScanConfirmation, showActionSheet, showDeleteConfirm]);

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
            resolutions={resolutions}
            notice={resolutionNotice}
            availableTabs={availableTabs}
            onTabPress={changeTab}
            onChooseAccounts={() => setFootprintPage('accounts')}
            onOpenFinding={openFinding}
            onUndo={undoResolution}
          />
        </View>
        <View
          style={[styles.page, !showingFindingDetail && styles.hidden]}
          accessibilityElementsHidden={!showingFindingDetail}
          importantForAccessibility={showingFindingDetail ? 'auto' : 'no-hide-descendants'}
        >
          <FindingDetailScreen
            finding={selectedFinding}
            onBack={() => setFootprintPage('results')}
            onChooseAction={() => setShowActionSheet(true)}
            onKeep={() => resolveSelectedFinding('kept')}
          />
        </View>
        <View
          style={[styles.page, !showingEditCaption && styles.hidden]}
          accessibilityElementsHidden={!showingEditCaption}
          importantForAccessibility={showingEditCaption ? 'auto' : 'no-hide-descendants'}
        >
          <EditCaptionScreen
            // Remount per finding so the field starts from that post's text.
            key={`edit-${selectedFindingId}`}
            finding={selectedFinding}
            onBack={() => setFootprintPage('detail')}
            onSave={() => resolveSelectedFinding('edited')}
          />
        </View>
        <View
          style={[styles.page, !showingRequestRemoval && styles.hidden]}
          accessibilityElementsHidden={!showingRequestRemoval}
          importantForAccessibility={showingRequestRemoval ? 'auto' : 'no-hide-descendants'}
        >
          <RequestRemovalScreen
            // Remount per listing so the form starts from the default reason and message.
            key={`removal-${selectedFindingId}`}
            finding={selectedFinding}
            onBack={() => setFootprintPage('detail')}
            onSend={() => resolveSelectedFinding('removal-requested')}
          />
        </View>
        <View
          style={[styles.page, !showingMyLens && styles.hidden]}
          accessibilityElementsHidden={!showingMyLens}
          importantForAccessibility={showingMyLens ? 'auto' : 'no-hide-descendants'}
        >
          <MyLensScreen
            savedLens={savedLens ? summarizeLens(savedLens) : undefined}
            onStartSetup={() => setLensPage('goals')}
            onEditLens={openSavedLens}
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
          style={[styles.page, !showingLensSet && styles.hidden]}
          accessibilityElementsHidden={!showingLensSet}
          importantForAccessibility={showingLensSet ? 'auto' : 'no-hide-descendants'}
        >
          <LensSetScreen
            focus={describeLensFocus(savedLens?.goalIds ?? [])}
            onDone={() => setLensPage('intro')}
            onTryDraft={tryLensOnDraft}
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
      <FindingActionSheet
        visible={showActionSheet && showingFindingDetail}
        finding={selectedFinding}
        onSelect={chooseFindingAction}
        onCancel={() => setShowActionSheet(false)}
      />
      <DeleteConfirmDialog
        visible={showDeleteConfirm && showingFindingDetail}
        onCancel={() => setShowDeleteConfirm(false)}
        onDelete={() => resolveSelectedFinding('deleted')}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: theme.colors.background },
  page: { flex: 1 },
  hidden: { display: 'none' },
});
