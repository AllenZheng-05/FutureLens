import type { LensOption, PerspectiveId, TopicId } from '../types/lens';

// Fixed choices from the Lens setup Step 2 and Step 3 frames on the Figma board.
export const perspectiveOptions: readonly LensOption<PerspectiveId>[] = [
  { id: 'employers', label: 'Future employers' },
  { id: 'voters-press', label: 'Voters & press' },
  { id: 'admissions', label: 'Admissions officers' },
  { id: 'strangers', label: 'Strangers with no context' },
  { id: 'family', label: 'Family' },
  { id: 'rivals', label: 'Old rivals' },
];

export const topicOptions: readonly LensOption<TopicId>[] = [
  { id: 'politics', label: 'Politics' },
  { id: 'jokes', label: 'Jokes & sarcasm' },
  { id: 'partying', label: 'Partying' },
  { id: 'rants', label: 'Rants about people' },
  { id: 'location', label: 'Location' },
  { id: 'opinions', label: 'Opinions I may change' },
];
