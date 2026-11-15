import type { LensAccount, LensOption, PerspectiveId, SharingAudience, SharingRules, TopicId } from '../types/lens';

// Fixed choices from the Lens setup Step 2 and Step 3 frames on the Figma board.
export const perspectiveOptions: readonly LensOption<PerspectiveId>[] = [
  { id: 'employers', label: 'Future employers', description: 'Recruiters and managers screening applicants' },
  { id: 'voters-press', label: 'Voters & press', description: 'Voters and reporters looking into your past' },
  { id: 'admissions', label: 'Admissions officers', description: 'Schools and programs reviewing applications' },
  { id: 'strangers', label: 'Strangers with no context', description: 'People who see one post without knowing you' },
  { id: 'family', label: 'Family', description: 'Parents, relatives and others close to home' },
  { id: 'rivals', label: 'Old rivals', description: 'People who might use old posts against you' },
];

export const topicOptions: readonly LensOption<TopicId>[] = [
  { id: 'politics', label: 'Politics', description: 'Elections, candidates, policies and protests' },
  { id: 'jokes', label: 'Jokes & sarcasm', description: 'Humor that could read as serious out of context' },
  { id: 'partying', label: 'Partying', description: 'Drinking, nightlife and party photos' },
  { id: 'rants', label: 'Rants about people', description: 'Complaints that name or point at someone' },
  { id: 'location', label: 'Location', description: 'Places you live, work or visit often' },
  { id: 'opinions', label: 'Opinions I may change', description: 'Strong takes you might not hold in a few years' },
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
