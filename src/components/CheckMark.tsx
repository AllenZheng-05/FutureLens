import { StyleSheet, View } from 'react-native';

import { theme } from '../theme';

type Props = { size?: number; color?: string };

// Drawn with a rotated bordered View so no SVG dependency is needed.
export function CheckMark({ size = 12, color = theme.colors.surface }: Props) {
  const stroke = Math.max(2, Math.round(size / 6));
  return (
    <View accessible={false} style={[styles.box, { width: size, height: size }]}>
      <View
        style={{
          width: size * 0.35,
          height: size * 0.7,
          marginTop: -size * 0.15,
          borderRightWidth: stroke,
          borderBottomWidth: stroke,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
});
