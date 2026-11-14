import type { PostCheckResult } from '../types/checkPost';

type DraftResult = { draft: string; result: PostCheckResult };

// Preset demo results, matched by draft text. One entry per sample draft;
// every other draft falls back to a generic result with no preset fixes.
const resultsByDraft: readonly DraftResult[] = [
  {
    draft: 'Can’t wait to take down the board at Thursday’s meeting 💣',
    result: {
      readers: [
        {
          id: 'employers',
          label: 'Employers',
          reading:
            'A future employer or editor could read “take down” and 💣 as a threat of violence against a board, since nothing shows that you mean winning a debate at a student government meeting.',
          risk: 'high',
        },
        {
          id: 'classmates',
          label: 'Classmates',
          reading:
            'They know Thursday’s meeting is the student government debate. They’ll expect the trash talk and a win.',
          risk: 'low',
        },
        {
          id: 'no-context',
          label: 'No Context',
          reading:
            'With none of the background, “take down the board” plus a bomb emoji reads as a threat, not a joke.',
          risk: 'high',
        },
        {
          id: 'close-friends',
          label: 'Close Friends',
          reading:
            'Inside joke — they get it instantly and might reply with trash talk of their own.',
          risk: 'low',
        },
      ],
      rewrites: [
        { id: 'rw-1', text: 'Can’t wait to win the debate at Thursday’s student government meeting 🖊️' },
        { id: 'rw-2', text: 'Ready to challenge the board’s budget at Thursday’s meeting.' },
        { id: 'rw-3', text: 'Thursday’s meeting is going to be intense, and I’m ready to make my case!' },
      ],
      contexts: [
        {
          id: 'cx-1',
          text: 'Can’t wait to take down the board at Thursday’s meeting 💣 (debating the budget at student gov, to be clear!)',
          risk: 'low',
        },
        {
          id: 'cx-2',
          text: 'Can’t wait to take down the board at Thursday’s meeting 💣 #studentgov #debate',
          risk: 'low',
        },
        {
          id: 'cx-3',
          text: 'Can’t wait to take down the board at Thursday’s meeting 💣 (all in good fun!)',
          risk: 'medium',
        },
      ],
    },
  },
  {
    draft: 'Starting a new chapter this summer. Looking forward to learning from the team!',
    result: {
      readers: [
        {
          id: 'employers',
          label: 'Employers',
          reading:
            'Positive and professional. A future employer reads it as someone excited to keep growing.',
          risk: 'low',
        },
        {
          id: 'classmates',
          label: 'Classmates',
          reading:
            'They’ll congratulate you and ask for the story behind the move.',
          risk: 'low',
        },
        {
          id: 'no-context',
          label: 'No Context',
          reading:
            '“New chapter” sounds like a goodbye with no announcement to match, so people may ask what’s going on.',
          risk: 'medium',
        },
        {
          id: 'close-friends',
          label: 'Close Friends',
          reading: 'They likely already know. They’ll read it as good news.',
          risk: 'low',
        },
      ],
      rewrites: [
        { id: 'rw-1', text: 'Excited to share I’m joining a new team this summer — can’t wait to learn from everyone there!' },
        { id: 'rw-2', text: 'Big news: I’ve accepted a new role starting this summer. Grateful for what’s next!' },
        { id: 'rw-3', text: 'New role, new team, starting this summer. If you’ve worked with me, I’d love to hear your tips!' },
      ],
      contexts: [
        {
          id: 'cx-1',
          text: 'Starting a new chapter this summer. Looking forward to learning from the team! (new role, same me — details soon!)',
          risk: 'low',
        },
        {
          id: 'cx-2',
          text: 'Starting a new chapter this summer. Looking forward to learning from the team! I’ve accepted a new role and start this summer.',
          risk: 'low',
        },
        {
          id: 'cx-3',
          text: 'Starting a new chapter this summer. Looking forward to learning from the team! (What I can say: it’s a step I’ve wanted for a while.)',
          risk: 'medium',
        },
      ],
    },
  },
];

// Used for any draft the user wrote themselves: the four readers still give a
// read, but there are no preset rewrites or contexts to offer.
const genericResult: PostCheckResult = {
  readers: [
    {
      id: 'employers',
      label: 'Employers',
      reading:
        'They’ll take the words at face value. Without your tone of voice, a line could read differently than you mean it.',
      risk: 'medium',
    },
    {
      id: 'classmates',
      label: 'Classmates',
      reading: 'They know you and the context, so they’ll likely read it as intended.',
      risk: 'low',
    },
    {
      id: 'no-context',
      label: 'No Context',
      reading:
        'A stranger sees the post alone. Nuance is easy to miss in a quick scroll — the plainest reading wins.',
      risk: 'medium',
    },
    {
      id: 'close-friends',
      label: 'Close Friends',
      reading: 'They’ll fill in the background and probably reply with support.',
      risk: 'low',
    },
  ],
  rewrites: [],
  contexts: [],
};

export function findPostCheckResult(draft: string): PostCheckResult {
  const match = resultsByDraft.find(entry => entry.draft === draft);
  return match?.result ?? genericResult;
}
