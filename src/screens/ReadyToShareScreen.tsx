import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { BackHeader } from '../components/BackHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { theme } from '../theme';
import type { CheckPostRequest } from '../types/checkPost';

type Props = {
  post: CheckPostRequest;
  // True when the private-share fix moved the post to a smaller audience.
  audienceChanged: boolean;
  onBack: () => void;
  onDone: () => void;
};

// Figma: Check - 7 (Option 1). The chosen post, with copy-out as the final action.
export function ReadyToShareScreen({ post, audienceChanged, onBack, onDone }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copyPost() {
    await Clipboard.setStringAsync(post.draft);
    setCopied(true);
  }

  return (
    <View style={styles.screen}>
      <BackHeader title="Ready to share" onBack={onBack} backLabel="Back to the reading" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>Ready to share</Text>

        <View style={styles.postBox}>
          <Text style={styles.postLabel}>Your post</Text>
          <Text style={styles.postText}>{post.draft}</Text>
        </View>

        {audienceChanged && (
          <Text accessibilityLiveRegion="polite" style={styles.audienceNote}>
            Sharing with {post.audience} now, instead of the wider group you started with.
          </Text>
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Done and back to your draft"
          onPress={onDone}
          style={({ pressed }) => [styles.done, pressed && styles.pressed]}
        >
          <Text style={styles.doneLabel}>Done</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.action}>
        <PrimaryButton label={copied ? 'Copied ✓' : 'Copy post'} onPress={copyPost} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.space.lg, paddingTop: theme.space.xl, paddingBottom: theme.space.xl, gap: theme.space.lg },
  title: { color: theme.colors.heading, fontSize: 28, fontWeight: '700', lineHeight: 34, textAlign: 'center' },
  postBox: {
    minHeight: 140,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.colors.accountBorder,
    borderRadius: theme.radius.card,
    padding: theme.space.lg,
  },
  postLabel: { color: theme.colors.primary, fontSize: 13, fontWeight: '600', lineHeight: 18 },
  postText: { color: theme.colors.ink, fontSize: 16, lineHeight: 24, marginTop: theme.space.sm },
  audienceNote: { color: theme.colors.ink600, fontSize: 13, lineHeight: 19, textAlign: 'center' },
  done: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  doneLabel: { color: theme.colors.primary, fontSize: 13, fontWeight: '600', lineHeight: 18 },
  action: { paddingHorizontal: theme.space.lg, paddingVertical: theme.space.sm },
  pressed: { opacity: 0.75 },
});
