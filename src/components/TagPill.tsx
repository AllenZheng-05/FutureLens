import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

type Props = { label: string };

export function TagPill({ label }: Props) {
  return (
    <View style={styles.pill}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { alignSelf: 'flex-start', borderRadius: theme.radius.chip, backgroundColor: theme.colors.chipFill, paddingHorizontal: theme.space.md, paddingVertical: 6 },
  label: { color: theme.colors.primary, fontSize: 13, fontWeight: '500', lineHeight: 16 },
});
