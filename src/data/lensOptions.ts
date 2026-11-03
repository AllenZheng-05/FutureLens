import type { LensAccount, LensOption, PerspectiveId, SharingAudience, SharingRules, TopicId } from '../types/lens';

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

// Step 4 ("Who should see what?") choices.
export const accountOptions: readonly LensOption<LensAccount>[] = [
  { id: 'public', label: 'Public account' },
  { id: 'friends', label: 'Friends account' },
];

export const sharingAudienceOptions: readonly LensOption<SharingAudience>[] = [
  { id: 'public', label: 'Public' },
  { id: 'friends', label: 'Friends' },
  { id: 'private', label: 'Private' },
];

// Fixed starting suggestions; the friends account allows a little more by default.
export const defaultSharingRules: SharingRules = {
  public: { politics: 'private', jokes: 'friends', partying: 'private', rants: 'private', location: 'private', opinions: 'friends' },
  friends: { politics: 'friends', jokes: 'friends', partying: 'friends', rants: 'private', location: 'private', opinions: 'friends' },
};
