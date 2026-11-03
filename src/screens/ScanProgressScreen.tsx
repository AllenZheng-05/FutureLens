import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  AppState,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/PrimaryButton';
import { demoScan } from '../data/demoScan';
import { theme } from '../theme';

type Props = {
  active: boolean;
  accountCount: number;
  onCancel: () => void;
  onViewResults: () => void;
};

// Figma: Footprint - 4 (76:879). Only a local, deterministic demo animation.
export function ScanProgressScreen({ active, accountCount, onCancel, onViewResults }: Props) {
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState(0);
  const [foreground, setForeground] = useState(
    AppState.currentState !== 'background' && AppState.currentState !== 'inactive',
  );
  const [reduceMotion, setReduceMotion] = useState(true);
  const pulse = useRef(new Animated.Value(1)).current;
  const complete = phase >= demoScan.phases.length;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      setForeground(state === 'active');
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(enabled => { if (mounted) setReduceMotion(enabled); })
      .catch(() => { /* Keep the static graphic if the preference is unavailable. */ });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => { mounted = false; subscription.remove(); };
  }, []);

  useEffect(() => {
    if (!active) setPhase(0);
  }, [active]);

  useEffect(() => {
    if (!active || !foreground || complete) return;
    const timer = setTimeout(() => setPhase(previous => previous + 1), demoScan.phaseDurationMs);
    return () => clearTimeout(timer);
  }, [active, foreground, complete, phase]);

  useEffect(() => {
    if (!active || !foreground || complete || reduceMotion) {
      pulse.setValue(1);
      return;
    }
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 0.45, duration: 850, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 850, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [active, foreground, complete, reduceMotion, pulse]);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <Text style={[styles.demoLabel, { paddingTop: Math.max(insets.top, 16) + 16 }]}>
        Demo scan · {accountCount} account{accountCount === 1 ? '' : 's'}
      </Text>

      <ScrollView style={styles.body} contentContainerStyle={styles.content}>
        <Animated.View
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel="Simulated digital footprint scan"
          accessibilityValue={{ min: 0, max: demoScan.phases.length, now: phase }}
          style={[styles.graphic, { opacity: pulse }]}
        >
          <Image accessible={false} source={require('../../assets/illustrations/scan-ring-outer.png')} style={styles.outerRing} />
          <Image accessible={false} source={require('../../assets/illustrations/scan-ring-inner.png')} style={styles.innerRing} />
        </Animated.View>
        <Text accessibilityLiveRegion="polite" style={styles.status}>
          {complete ? 'Demo scan complete' : `Scanning ${demoScan.postCount.toLocaleString('en-US')} posts...`}
        </Text>
        <Text accessibilityLiveRegion="polite" style={styles.detail}>
          {complete ? 'Your sample findings are ready to view.' : demoScan.phases[phase]}
        </Text>
      </ScrollView>

      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {complete && <PrimaryButton label="View demo results" onPress={onViewResults} />}
        {complete && (
          <Pressable accessibilityRole="button" accessibilityLabel="Replay demo scan" onPress={() => setPhase(0)} style={styles.back}>
            <Text style={styles.backLabel}>Replay demo</Text>
          </Pressable>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={complete ? 'Back to accounts' : 'Cancel demo scan'}
          onPress={onCancel}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <Text style={styles.backLabel}>{complete ? 'Back to accounts' : 'Cancel demo scan'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  demoLabel: { paddingHorizontal: theme.space.lg, color: theme.colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  body: { flex: 1 },
  content: { flexGrow: 1, minHeight: 240, alignItems: 'center', justifyContent: 'center', padding: theme.space.lg },
  graphic: { width: 96, height: 96 },
  outerRing: { width: 96, height: 96 },
  innerRing: { position: 'absolute', left: 20, top: 20, width: 56, height: 56 },
  status: { marginTop: theme.space.xl, color: theme.colors.ink600, fontSize: 17, fontWeight: '500', lineHeight: 18, textAlign: 'center' },
  detail: { marginTop: theme.space.sm, color: theme.colors.ink600, fontSize: 13, fontWeight: '500', lineHeight: 18, textAlign: 'center' },
  actions: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.lg, gap: theme.space.sm },
  back: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  backLabel: { color: theme.colors.primary, fontSize: 13, fontWeight: '500', lineHeight: 18 },
  pressed: { opacity: 0.7 },
});
