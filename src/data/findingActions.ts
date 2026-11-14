import type { FindingActionOption, FindingCategory } from '../types/footprint';

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

// Short guidance above the choices: when to pick which (DP3 usability fix).
export const findingActionGuidance: Record<FindingCategory, string> = {
  posts: 'Edit if the point is fine but the wording isn’t. Make private if friends can see it. Delete if it shouldn’t exist.',
  tagged: 'You can’t delete someone else’s photo, but you can take your name off it.',
  mentions: 'Someone else posted this, so you can only ask for it to be taken down.',
  directories: 'Most people-search sites remove listings when asked.',
};
