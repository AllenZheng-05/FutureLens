import type { GoalOption } from '../types/lens';

// Fixed choices from the supplied Lens - 2 screenshot, not inferred user goals.
export const goalOptions: readonly GoalOption[] = [
  { id: 'public-office', label: 'Run for office someday' },
  { id: 'career', label: 'Land an internship or job' },
  { id: 'education', label: 'Get into a program or school' },
  { id: 'creator', label: 'Build a creator brand' },
  { id: 'other', label: 'Something else' },
];
