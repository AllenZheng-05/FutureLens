import type { CheckPostRequest } from '../types/checkPost';

type SampleDraft = CheckPostRequest & { id: string; title: string };

// Fictional examples, not a record of the user's recent activity.
export const sampleDrafts: readonly SampleDraft[] = [
  {
    id: 'student-meeting',
    title: 'Student meeting',
    draft: 'Can’t wait to take down the board at Thursday’s meeting 💣',
    platform: 'Instagram',
    audience: 'Public',
  },
  {
    id: 'career-update',
    title: 'Career update',
    draft: 'Starting a new chapter this summer. Looking forward to learning from the team!',
    platform: 'LinkedIn',
    audience: 'Work',
  },
];
