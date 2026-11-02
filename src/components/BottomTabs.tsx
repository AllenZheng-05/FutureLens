import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '../theme';

export type Tab = 'Check' | 'My Lens' | 'Footprint';

type Props = {
  activeTab: Tab;
  onTabPress?: (tab: Tab) => void;
  availableTabs?: readonly Tab[];
};

const tabs: readonly Tab[] = ['Check', 'My Lens', 'Footprint'];

export function BottomTabs({ activeTab, onTabPress, availableTabs = ['Check'] }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      accessibilityRole="tablist"
      style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 16) }]}
    >
      {tabs.map((tab) => {
        const selected = tab === activeTab;
        const disabled = !availableTabs.includes(tab);

        return (
          <Pressable
            key={tab}
            accessibilityRole="tab"
            accessibilityLabel={tab}
            accessibilityHint={disabled ? 'Not available in this preview' : undefined}
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            onPress={() => onTabPress?.(tab)}
            style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
          >
            {tab === 'My Lens' ? (
              <View style={[styles.lensIcon, selected && styles.selectedLensIcon]} />
            ) : (
              <Image
                accessible={false}
                source={tab === 'Check'
                  ? selected
                    ? require('../../assets/icons/check.png')
                    : require('../../assets/icons/check-inactive.png')
                  : require('../../assets/icons/footprint.png')}
                style={styles.icon}
                resizeMode="contain"
              />
            )}
            <Text style={[styles.label, selected && styles.selectedLabel]}>{tab}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    minHeight: 84,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  tab: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.space.xs,
  },
  icon: { width: 24, height: 24 },
  lensIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: theme.colors.inactive,
  },
  selectedLensIcon: { backgroundColor: theme.colors.primary },
  label: {
    color: theme.colors.inactive,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  },
  selectedLabel: { color: theme.colors.primary },
  pressed: { opacity: 0.7 },
});
