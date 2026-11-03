import type { DemoFootprintFinding, FindingFilter } from '../types/footprint';

export const findingFilters: readonly { id: FindingFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'posts', label: 'Your posts' },
  { id: 'tagged', label: 'Tagged by others' },
  { id: 'mentions', label: 'Mentions' },
  { id: 'directories', label: 'Directories' },
];

// Fictional metadata and findings, independent of account selection or analysis.
export const demoScannedSites = 3;

// The first nine reproduce the screenshot's 3 High / 4 Medium / 2 Low summary.
// Three additional examples make the preset goal-match toggle meaningful.
export const demoFootprintFindings: readonly DemoFootprintFinding[] = [
  { id: 'system-post', title: '2021 post: “someone should burn the whole system down”', source: 'Your post', category: 'posts', risk: 'high', matchesDemoGoals: true },
  { id: 'argument-thread', title: '2020 argument thread with a classmate', source: 'Your post', category: 'posts', risk: 'high', matchesDemoGoals: true },
  { id: 'directory-listing', title: 'Directory listing shows your city and age', source: 'Data directory', category: 'directories', risk: 'high', matchesDemoGoals: true },
  { id: 'party-photo', title: 'Party photo tag by @sam.k', source: 'Tagged by others', category: 'tagged', risk: 'medium', matchesDemoGoals: true },
  { id: 'news-comment', title: '2022 news comment', source: 'Mention', category: 'mentions', risk: 'medium', matchesDemoGoals: true },
  { id: 'public-rant', title: 'Workday rant shared publicly', source: 'Your post', category: 'posts', risk: 'medium', matchesDemoGoals: true },
  { id: 'location-tag', title: 'Old group photo with a location tag', source: 'Tagged by others', category: 'tagged', risk: 'medium', matchesDemoGoals: true },
  { id: 'outdated-opinion', title: '2019 post with an outdated opinion', source: 'Your post', category: 'posts', risk: 'low', matchesDemoGoals: true },
  { id: 'event-recap', title: 'Mention in a community event recap', source: 'Mention', category: 'mentions', risk: 'low', matchesDemoGoals: true },
  { id: 'phone-number', title: 'Old post with a visible phone number', source: 'Your post', category: 'posts', risk: 'high', matchesDemoGoals: false },
  { id: 'hobby-directory', title: 'Public hobby directory profile', source: 'Data directory', category: 'directories', risk: 'medium', matchesDemoGoals: false },
  { id: 'weekend-photo', title: 'Tagged photo from a weekend meetup', source: 'Tagged by others', category: 'tagged', risk: 'low', matchesDemoGoals: false },
];
