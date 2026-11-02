import { Alert } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { CheckPostScreen } from './src/screens/CheckPostScreen';
import type { CheckPostRequest } from './src/types/checkPost';

function previewCheck(_request: CheckPostRequest) {
  // Replace this callback with the teammate-owned check/results flow.
  Alert.alert(
    'Post checking preview',
    'Your draft is ready. Post analysis is not available in this preview yet.',
    [{ text: 'Keep editing' }],
  );
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <CheckPostScreen onCheck={previewCheck} />
    </SafeAreaProvider>
  );
}
