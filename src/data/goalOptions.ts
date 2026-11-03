import type { GoalId, GoalOption } from '../types/lens';

// Fixed choices from the supplied Lens - 2 screenshot, not inferred user goals.
export const goalOptions: readonly GoalOption[] = [
  { id: 'public-office', label: 'Run for office someday' },
  { id: 'career', label: 'Land an internship or job' },
  { id: 'education', label: 'Get into a program or school' },
  { id: 'creator', label: 'Build a creator brand' },
  { id: 'other', label: 'Something else' },
];

// How each goal reads in "Checks now focus on ...".
const goalFocus: Record<GoalId, string> = {
  'public-office': 'running for office',
  career: 'landing an internship or job',
  education: 'getting into a program or school',
  creator: 'building a creator brand',
  other: 'what matters to you',
};

export function describeLensFocus(goalIds: readonly GoalId[]) {
  const phrases = goalOptions.filter(goal => goalIds.includes(goal.id)).map(goal => goalFocus[goal.id]);
  if (phrases.length === 0) return 'what matters to you';
  if (phrases.length === 1) return phrases[0];
  return `${phrases.slice(0, -1).join(', ')} and ${phrases[phrases.length - 1]}`;
}
