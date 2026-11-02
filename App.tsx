import { StyleSheet, Text, View } from 'react-native';

// Bootstrap only. Replace this entry screen with the first approved Figma page.
export default function App() {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header">Future Lens</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
