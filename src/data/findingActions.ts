import type { FindingAction, FindingActionOption, FindingCategory, Resolution } from '../types/footprint';

const keep: FindingActionOption = { id: 'keep', label: 'Keep it', description: 'Leave it as it is' };

// Post choices and their order follow Figma's Footprint - 7; listings follow Footprint - 11.
// Tags and mentions have no Figma frame and reuse the same sheet.
export const findingActions: Record<FindingCategory, readonly FindingActionOption[]> = {
  posts: [
    { id: 'edit', label: 'Edit caption', description: 'Reword it' },
    { id: 'private', label: 'Make private', description: 'Only you can see it' },
    { id: 'delete', label: 'Delete post', description: 'Remove it from your account', destructive: true },
    keep,
  ],
  tagged: [
    { id: 'untag', label: 'Remove tag', description: 'Take your name off it. The photo stays on their profile' },
    keep,
  ],
  mentions: [
    { id: 'ask-removal', label: 'Ask for removal', description: 'Ask the site to take down the mention' },
    keep,
  ],
  directories: [
    { id: 'ignore', label: 'Ignore', description: 'Leave it for now' },
    { id: 'request-removal', label: 'Request removal', description: 'Ask the site to delete your listing' },
  ],
};

// Actions that resolve a finding straight from the sheet. Delete asks for confirmation
// first; Edit caption and Request removal open their own screens.
export const immediateResolutions: Partial<Record<FindingAction, Resolution>> = {
  private: 'private',
  keep: 'kept',
  ignore: 'ignored',
  untag: 'untagged',
  'ask-removal': 'removal-requested',
};

// Used for the Undo notice and the Resolved list (Figma: Footprint - 9 and 13).
export const resolutionLabels: Record<Resolution, string> = {
  deleted: 'Post deleted',
  private: 'Made private',
  kept: 'Kept as is',
  ignored: 'Ignored for now',
  edited: 'Caption updated',
  untagged: 'Tag removed',
  'removal-requested': 'Removal requested',
};

// Request removal (Figma: Footprint - 12). The first reason and message follow Figma.
// Choosing a reason fills in its message unless the user has already edited it.
export const removalReasons: readonly { id: string; label: string; message: string }[] = [
  {
    id: 'personal-info',
    label: 'Remove my personal info',
    message: 'Hello, I’m requesting removal of my personal information from your listing. Please confirm once it’s deleted. Thank you.',
  },
  {
    id: 'inaccurate',
    label: 'The information is wrong',
    message: 'Hello, the information in your listing about me is out of date or wrong. Please remove the listing and confirm once it’s deleted. Thank you.',
  },
  {
    id: 'safety',
    label: 'Safety concern',
    message: 'Hello, your listing shows where I live, which is a safety concern for me. Please remove it as soon as possible and confirm once it’s deleted. Thank you.',
  },
];

// Short guidance above the choices: when to pick which (DP3 usability fix).
export const findingActionGuidance: Record<FindingCategory, string> = {
  posts: 'Edit if the point is fine but the wording isn’t. Make private if friends can see it. Delete if it shouldn’t exist.',
  tagged: 'You can’t delete someone else’s photo, but you can take your name off it.',
  mentions: 'Someone else posted this, so you can only ask for it to be taken down.',
  directories: 'Most people-search sites remove listings when asked.',
};
