import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '../theme';

type Props = {
  title: string;
  onBack: () => void;
  backLabel?: string;
  centerContent?: ReactNode;
};

export function BackHeader({ title, onBack, backLabel = 'Go back', centerContent }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={backLabel}
          onPress={onBack}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <Text style={styles.chevron}>{'<'}</Text>
        </Pressable>
        {centerContent ? (
          <View style={styles.centerContent}>{centerContent}</View>
        ) : (
          <Text accessibilityRole="header" style={styles.title}>{title}</Text>
        )}
        {!centerContent && <View style={styles.spacer} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.space.xs,
    paddingVertical: 6,
  },
  back: { width: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  chevron: { color: theme.colors.ink, fontSize: 20, fontWeight: '600' },
  title: { flex: 1, color: theme.colors.ink, fontSize: 17, fontWeight: '600', lineHeight: 24, textAlign: 'center' },
  spacer: { width: 44 },
  centerContent: { flex: 1, minHeight: 44, justifyContent: 'center', paddingLeft: 8, paddingRight: 12 },
  pressed: { opacity: 0.7 },
});
