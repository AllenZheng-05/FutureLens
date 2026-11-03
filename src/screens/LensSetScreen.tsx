import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/PrimaryButton';
import { SuccessBadge } from '../components/SuccessBadge';
import { TextButton } from '../components/TextButton';
import { theme } from '../theme';

type Props = {
  focus: string;
  onDone: () => void;
  onTryDraft: () => void;
};

// "Your Lens is set": confirmation after Save my Lens.
export function LensSetScreen({ focus, onDone, onTryDraft }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <SuccessBadge size={80} />
        <Text accessibilityRole="header" style={styles.title}>Your Lens is set</Text>
        <Text style={styles.subtitle}>{`Checks now focus on ${focus}.`}</Text>
      </View>

      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 16) + 48 }]}>
        <TextButton label="Done" accessibilityLabel="Done, go to My Lens" onPress={onDone} />
        <PrimaryButton label="Try it on a draft" onPress={onTryDraft} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  title: { marginTop: theme.space.xl, color: theme.colors.ink, fontSize: 24, fontWeight: '700', lineHeight: 32, textAlign: 'center' },
  subtitle: { maxWidth: 300, marginTop: theme.space.sm, color: theme.colors.secondaryText, fontSize: 16, lineHeight: 22, textAlign: 'center' },
  actions: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.sm, gap: theme.space.sm },
});
