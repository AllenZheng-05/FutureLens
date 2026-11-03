import { StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';

import { theme } from '../theme';
import { TextButton } from './TextButton';

type Props = {
  title: string;
  onEdit: () => void;
  children: ReactNode;
};

// A section of the "Your Lens" review with an Edit link.
export function SummaryCard({ title, onEdit, children }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>{title}</Text>
        <TextButton label="Edit" accessibilityLabel={`Edit ${title}`} compact onPress={onEdit} />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: theme.space.md, padding: theme.space.lg, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.card, backgroundColor: theme.colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: theme.colors.ink, fontSize: 16, fontWeight: '600', lineHeight: 22 },
});
