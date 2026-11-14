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

// The fixed reader perspectives shown on the "How this could be read" page.
export type ReaderId = 'employers' | 'classmates' | 'no-context' | 'close-friends';

// How one kind of reader would take the draft.
export type PostReader = {
  id: ReaderId;
  label: string;
  reading: string;
  risk: CheckRisk;
};

// A preset fix: a rewrite, or the draft with context added. Context options
// carry the risk they leave the post at; rewrites don't show a badge.
export type FixOption = {
  id: string;
  text: string;
  risk?: CheckRisk;
};

// Which fix the user picked from the sheet.
export type FixKind = 'rewrite' | 'context' | 'private';

// Preset demo analysis. Real analysis is owned by the check/results flow, not the UI.
export type PostCheckResult = {
  readers: readonly PostReader[];
  rewrites: readonly FixOption[];
  contexts: readonly FixOption[];
};
