import { useEffect, useState } from 'react';
import { Alert, BackHandler, Keyboard, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import type { Tab } from './src/components/BottomTabs';
import { CheckPostScreen } from './src/screens/CheckPostScreen';
import { MyLensScreen } from './src/screens/MyLensScreen';
import { theme } from './src/theme';
import type { CheckPostRequest } from './src/types/checkPost';

const availableTabs: readonly Tab[] = ['Check', 'My Lens'];

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

  function changeTab(tab: Tab) {
    if (!availableTabs.includes(tab)) return;
    Keyboard.dismiss();
    setActiveTab(tab);
  }

  useEffect(() => {
    if (activeTab === 'Check') return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setActiveTab('Check');
      return true;
    });
    return () => subscription.remove();
  }, [activeTab]);

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
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: theme.colors.background },
  page: { flex: 1 },
  hidden: { display: 'none' },
});
