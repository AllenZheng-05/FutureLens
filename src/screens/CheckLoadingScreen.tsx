import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, Text, View } from 'react-native';

import { BackHeader } from '../components/BackHeader';
import { theme } from '../theme';

// Long enough to read the status line, short enough not to stall the demo.
const checkDurationMs = 1200;

type Props = {
  active: boolean;
  // Reader cards the result will show, including Lens perspective cards.
  readerCount: number;
  onCancel: () => void;
  onDone: () => void;
};

// Figma: Check - 4. A brief, local pause before the preset readings; nothing is analyzed.
export function CheckLoadingScreen({ active, readerCount, onCancel, onDone }: Props) {
  const [reduceMotion, setReduceMotion] = useState(true);
  const pulse = useRef(new Animated.Value(1)).current;
  // Kept in a ref so a parent re-render does not restart the timer.
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(enabled => { if (mounted) setReduceMotion(enabled); })
      .catch(() => { /* Keep the static indicator if the preference is unavailable. */ });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => { mounted = false; subscription.remove(); };
  }, []);

  // Each time the page becomes active the wait starts over; leaving clears it.
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => onDoneRef.current(), checkDurationMs);
    return () => clearTimeout(timer);
  }, [active]);

  useEffect(() => {
    if (!active || reduceMotion) {
      pulse.setValue(1);
      return;
    }
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 0.45, duration: 600, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [active, reduceMotion, pulse]);

  return (
    <View style={styles.screen}>
      <BackHeader title="Checking" onBack={onCancel} backLabel="Cancel and return to draft" />

      <View style={styles.content}>
        <Animated.View
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel="Checking your post"
          style={[styles.indicator, { opacity: pulse }]}
        >
          <View accessible={false} style={styles.indicatorCore} />
        </Animated.View>
        <Text accessibilityLiveRegion="polite" style={styles.status}>
          Reading your post from {readerCount} {readerCount === 1 ? 'point' : 'points'} of view…
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.space.lg },
  indicator: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    backgroundColor: theme.colors.chipFill,
  },
  indicatorCore: { width: 32, height: 32, borderRadius: 16, backgroundColor: theme.colors.primary },
  status: { marginTop: theme.space.xl, color: theme.colors.ink600, fontSize: 17, fontWeight: '500', lineHeight: 24, textAlign: 'center' },
});
