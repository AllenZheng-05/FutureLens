import { perspectiveOptions, topicOptions } from './lensOptions';
import type { LensAccount, PerspectiveId, SavedLens, SharingAudience } from '../types/lens';
import type {
  Audience,
  CheckRisk,
  CheckPostRequest,
  LensAwarePostCheckResult,
  PostCheckResult,
  PostReader,
} from '../types/checkPost';

type DraftResult = PostCheckResult & {
  // Readings for perspectives that have no base card: Voters & press,
  // Admissions officers, Old rivals. Keyed by perspective id.
  lensReadings?: Partial<Record<PerspectiveId, { reading: string; risk: CheckRisk }>>;
  // Alternate reading wording for a base card, used when the draft's topic is
  // one the Lens watches. Keyed by base reader id.
  lensTopicReadings?: Partial<Record<string, string>>;
};

// Preset demo results, matched by draft text. One entry per sample draft;
// every other draft falls back to a generic result with no preset fixes.
const resultsByDraft: readonly { draft: string; result: DraftResult }[] = [
  {
    draft: 'Can’t wait to take down the board at Thursday’s meeting 💣',
    result: {
      topicId: 'jokes',
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
        {
          id: 'rw-1',
          text: 'Can’t wait to win the debate at Thursday’s student government meeting 🖊️',
          risk: 'low',
          why: 'Swaps “take down” and the 💣 for “win the debate” — the two things strangers read as a threat. Every reader now sees the meeting is a debate.',
        },
        {
          id: 'rw-2',
          text: 'Ready to challenge the board’s budget at Thursday’s meeting.',
          risk: 'low',
          why: 'Says exactly what you’ll do at the meeting — challenge the budget — so nobody has to guess what “take down the board” meant.',
        },
        {
          id: 'rw-3',
          text: 'Thursday’s meeting is going to be intense, and I’m ready to make my case!',
          risk: 'medium',
          why: 'More energetic, but “intense” is still vague — a stranger could still wonder what’s happening. Pairs well with a smaller audience.',
        },
      ],
      contexts: [
        {
          id: 'cx-1',
          text: 'Can’t wait to take down the board at Thursday’s meeting 💣 (debating the budget at student gov, to be clear!)',
          risk: 'low',
          why: 'Keeps your joke and adds the one missing fact — what “the board” is — so out-of-context readers get it too.',
        },
        {
          id: 'cx-2',
          text: 'Can’t wait to take down the board at Thursday’s meeting 💣 #studentgov #debate',
          risk: 'low',
          why: 'Two tags do the same work as a sentence: they mark the post as student government, not a threat.',
        },
        {
          id: 'cx-3',
          text: 'Can’t wait to take down the board at Thursday’s meeting 💣 (all in good fun!)',
          risk: 'medium',
          why: 'Labels the tone, but “all in good fun” can read as a non-apology if the post already alarmed someone.',
        },
      ],
      lensReadings: {
        'voters-press': {
          reading:
            'A screenshot travels fast. “Take down” and 💣 out of context is a headline waiting to happen.',
          risk: 'high',
        },
        admissions: {
          reading:
            'An admissions officer could read this as threatening behavior and think twice about the application.',
          risk: 'high',
        },
        rivals: {
          reading:
            'They’ll get the joke — but a rival is the last person to give you the benefit of the doubt if it spreads.',
          risk: 'medium',
        },
      },
      lensTopicReadings: {
        employers:
          'You told Lens to watch jokes and sarcasm — but this post never says it’s a joke, so an employer still reads “take down” and 💣 straight.',
        'no-context':
          'You told Lens to watch jokes and sarcasm, and this is exactly why: with no “it’s a joke” marker, a stranger reads the words as written.',
      },
    },
  },
  {
    draft: 'Starting a new chapter this summer. Looking forward to learning from the team!',
    result: {
      topicId: 'opinions',
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
        {
          id: 'rw-1',
          text: 'Excited to share I’m joining a new team this summer — can’t wait to learn from everyone there!',
          risk: 'low',
          why: 'Names the change — a new team — so coworkers hear news, not a goodbye.',
        },
        {
          id: 'rw-2',
          text: 'Big news: I’ve accepted a new role starting this summer. Grateful for what’s next!',
          risk: 'low',
          why: 'Says a role was accepted, closing the “what’s happening?” gap a vague post leaves open.',
        },
        {
          id: 'rw-3',
          text: 'New role, new team, starting this summer. If you’ve worked with me, I’d love to hear your tips!',
          risk: 'medium',
          why: 'Clear about the change, but asking for tips invites a busy thread your future colleagues could read first.',
        },
      ],
      contexts: [
        {
          id: 'cx-1',
          text: 'Starting a new chapter this summer. Looking forward to learning from the team! (new role, same me — details soon!)',
          risk: 'low',
          why: 'Keeps your words and answers the first question readers ask — what actually changed.',
        },
        {
          id: 'cx-2',
          text: 'Starting a new chapter this summer. Looking forward to learning from the team! I’ve accepted a new role and start this summer.',
          risk: 'low',
          why: 'States the fact plainly, so the post stands on its own when it’s shared out of context.',
        },
        {
          id: 'cx-3',
          text: 'Starting a new chapter this summer. Looking forward to learning from the team! (What I can say: it’s a step I’ve wanted for a while.)',
          risk: 'medium',
          why: 'Explains the feeling, not the fact — readers still don’t know what changed.',
        },
      ],
      lensReadings: {
        'voters-press': {
          reading:
            'Not political. At most, a local paper might pick it up as a community success story.',
          risk: 'low',
        },
        admissions: {
          reading: 'Reads as a positive next step. Nothing here to worry an admissions file.',
          risk: 'low',
        },
        rivals: {
          reading:
            'A rival might claim you’re jumping ship to copy them. Harmless, but expect a comment.',
          risk: 'medium',
        },
      },
      lensTopicReadings: {
        'no-context':
          'You told Lens to watch opinions you may change. This one is fine today — but a thread under it could turn it into a stated position.',
      },
    },
  },
];

// Used for any draft the user wrote themselves: the four readers still give a
// read and the Lens still adds its perspectives, but there are no preset
// rewrites, contexts, or topic-specific wording.
const genericResult: DraftResult = {
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
  lensReadings: {
    'voters-press': {
      reading: 'If this ever reached a wider audience, how would it look quoted back to you?',
      risk: 'medium',
    },
    admissions: {
      reading: 'Admissions officers do check public posts. Anything ambiguous raises a question.',
      risk: 'medium',
    },
    rivals: {
      reading: 'A rival won’t assume good intent — the plainest reading is the one they’ll use.',
      risk: 'medium',
    },
  },
};

// Base reader cards that double as Lens perspectives.
const readerPerspective: Partial<Record<string, PerspectiveId>> = {
  employers: 'employers',
  'no-context': 'strangers',
  'close-friends': 'family',
};

// How wide each post audience and each sharing rule is, for the rule check.
// Work counts as public-level: colleagues aren't necessarily friends.
const audienceLevels: Record<Audience, number> = { Public: 2, Work: 2, Friends: 1 };
const ruleLevels: Record<SharingAudience, number> = { public: 2, friends: 1, private: 0 };
const ruleLabels: Record<SharingAudience, string> = { public: 'Public', friends: 'Friends', private: 'Private' };

// Applies the saved Lens to the preset result: tags and reorders readers that
// match chosen perspectives, adds cards for the extra perspectives, swaps in
// topic-aware wording, and checks the draft against the Lens's sharing rules.
// Without a Lens the result is exactly the preset.
export function buildPostCheckResult(
  request: CheckPostRequest,
  lens: SavedLens | null,
): LensAwarePostCheckResult {
  const base = resultsByDraft.find(entry => entry.draft === request.draft)?.result ?? genericResult;
  if (!lens) return base;

  const topicInLens = !!base.topicId && lens.topicIds.includes(base.topicId);

  const mapped = base.readers.map(reader => {
    const perspectiveId = readerPerspective[reader.id];
    const inLens = !!perspectiveId && lens.perspectiveIds.includes(perspectiveId);
    return {
      ...reader,
      perspectiveId,
      inLens,
      reading: (topicInLens && base.lensTopicReadings?.[reader.id]) || reader.reading,
    };
  });

  // Perspectives chosen in the Lens that have no base card get their own card.
  const extras: readonly PostReader[] = lens.perspectiveIds
    .filter(perspectiveId => !mapped.some(reader => reader.perspectiveId === perspectiveId))
    .map(perspectiveId => {
      const lensReading = base.lensReadings?.[perspectiveId];
      if (!lensReading) return null;
      return {
        id: perspectiveId,
        label: perspectiveOptions.find(option => option.id === perspectiveId)?.label ?? perspectiveId,
        reading: lensReading.reading,
        risk: lensReading.risk,
        perspectiveId,
        inLens: true,
      };
    })
    .filter(Boolean) as readonly PostReader[];

  const readers = [
    ...mapped.filter(reader => reader.inLens),
    ...mapped.filter(reader => !reader.inLens),
    ...extras,
  ];

  // Rule check: is this draft's audience wider than the Lens allows for its topic?
  // Only topics the Lens actually watches can trigger the note; anything else
  // gets no note, and the private fix just says "Same post, smaller audience."
  let lensNote: string | undefined;
  let privateHint: string | undefined;
  if (base.topicId && topicInLens) {
    // Public and Work posts are governed by the public account's rules; Friends posts by the friends account.
    const account: LensAccount = request.audience === 'Friends' ? 'friends' : 'public';
    const rule = lens.rules[account][base.topicId];
    if (ruleLevels[rule] < audienceLevels[request.audience]) {
      const topicLabel = topicOptions.find(option => option.id === base.topicId)?.label ?? 'this topic';
      lensNote = `Your Lens says keep ${topicLabel} to ${ruleLabels[rule]} on your ${account} account.`;
      privateHint = rule === 'friends'
        ? `Move to Friends — your Lens says keep ${topicLabel} there.`
        : `Move to Friends — closest option to your Lens's Private rule for ${topicLabel}.`;
    }
  }

  return { ...base, readers, lensNote, privateHint };
}
