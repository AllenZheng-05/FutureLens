// Figma's 2,140-post count is fictional. These are timed UI phases, not scan work.
export const demoScan = {
  postCount: 2140,
  phaseDurationMs: 1000,
  phases: [
    'Checking tags, mentions and public listings',
    'Reviewing public posts and profile details',
    'Preparing your demo summary',
  ],
} as const;
