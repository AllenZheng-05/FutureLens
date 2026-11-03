import { StyleSheet, View } from 'react-native';

import { theme } from '../theme';
import { CheckMark } from './CheckMark';

type Props = { size?: number };

export function SuccessBadge({ size = 72 }: Props) {
  return (
    <View accessible={false} style={[styles.badge, { width: size, height: size, borderRadius: size / 2 }]}>
      <CheckMark size={size * 0.42} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primary },
});
