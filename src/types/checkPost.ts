import type { PerspectiveId, TopicId } from './lens';

export const platforms = ['LinkedIn', 'Instagram', 'Other'] as const;
export const audiences = ['Public', 'Friends', 'Work'] as const;

export type Platform = (typeof platforms)[number];
export type Audience = (typeof audiences)[number];

// UI-to-feature boundary. The UI does not generate interpretations or store posts.
export type CheckPostRequest = {
  draft: string;
  platform: Platform;
  audience: Audience;
};

export type CheckRisk = 'high' | 'medium' | 'low';

// One reader card on the "How this could be read" page. Cards that map to a
// perspective chosen in My Lens are tagged inLens and sorted to the front.
export type PostReader = {
  id: string;
  label: string;
  reading: string;
  risk: CheckRisk;
  perspectiveId?: PerspectiveId;
  inLens?: boolean;
};

// A preset fix: a rewrite, or the draft with context added. Options carry the
// risk the post is left at, and why explains the problem the option solves.
export type FixOption = {
  id: string;
  text: string;
  risk?: CheckRisk;
  why?: string;
};

// Which fix the user picked from the sheet.
export type FixKind = 'rewrite' | 'context' | 'private';

// Severity ordering, for comparing the original draft against a fix option.
export const checkRiskRank: Record<CheckRisk, number> = { high: 2, medium: 1, low: 0 };

// Preset demo analysis. Real analysis is owned by the check/results flow, not the UI.
export type PostCheckResult = {
  readers: readonly PostReader[];
  rewrites: readonly FixOption[];
  contexts: readonly FixOption[];
  // The sharing-rules topic this draft falls under, if any.
  topicId?: TopicId;
};

// Result after the saved Lens has been applied to it.
export type LensAwarePostCheckResult = PostCheckResult & {
  // Shown on the reading page when the draft's audience is wider than the
  // Lens's sharing rule for its topic.
  lensNote?: string;
  // Explains the "Share somewhere more private" fix in terms of the Lens rule.
  privateHint?: string;
};
