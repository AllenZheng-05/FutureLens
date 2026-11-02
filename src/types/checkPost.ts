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
