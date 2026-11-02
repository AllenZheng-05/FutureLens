import type { DemoAccount } from '../types/footprint';

// Fictional accounts from Figma. Selecting one never connects to a real service.
export const demoAccounts: readonly DemoAccount[] = [
  {
    id: 'public',
    label: 'Public account',
    subtitle: '@jordan.advocates',
    available: true,
    initiallySelected: true,
  },
  {
    id: 'friends',
    label: 'Friends account',
    subtitle: '@jordan.j',
    available: true,
    initiallySelected: true,
  },
  {
    id: 'video',
    label: 'Video channel',
    subtitle: '@jordan.clips',
    available: true,
    initiallySelected: false,
  },
  {
    id: 'photos',
    label: 'Photo sharing',
    subtitle: '@jordan.pics',
    available: true,
    initiallySelected: false,
  },
  {
    id: 'career',
    label: 'Career profile',
    subtitle: 'Coming soon',
    available: false,
    initiallySelected: false,
  },
];
