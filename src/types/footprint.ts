export type DemoAccountId = 'public' | 'friends' | 'video' | 'photos' | 'career';

export type DemoAccount = {
  id: DemoAccountId;
  label: string;
  subtitle: string;
  available: boolean;
  initiallySelected: boolean;
};

// UI preview settings only; this does not grant access to any external service.
export type DemoScanRequest = {
  accountIds: readonly DemoAccountId[];
  access: 'read-only';
};

export type FindingRisk = 'high' | 'medium' | 'low';
export type FindingCategory = 'posts' | 'tagged' | 'mentions' | 'directories';
export type FindingFilter = 'all' | FindingCategory;

// Review item content (Figma: Footprint - 6 for posts, tags and mentions; Footprint - 10 for listings).
export type PostFindingDetail = {
  kind: 'post';
  text: string;
  date: string;
  visibility: string;
  whyFlagged: string;
  quote?: string;
  whereFound: string;
  goal?: string;
};

export type ListingFindingDetail = {
  kind: 'listing';
  site: string;
  page: string;
  fields: readonly { label: string; value: string }[];
  whyFlagged: string;
  whereFound: string;
  goal?: string;
};

export type FindingDetail = PostFindingDetail | ListingFindingDetail;

// Choices on the action sheet (Figma: Footprint - 7 and 11).
export type FindingAction = 'edit' | 'private' | 'delete' | 'keep' | 'untag' | 'ask-removal' | 'ignore' | 'request-removal';

export type FindingActionOption = {
  id: FindingAction;
  label: string;
  description: string;
  destructive?: boolean;
};

// What happened to a finding once the user acted on it. Kept in app state only.
export type Resolution = 'private' | 'deleted' | 'kept' | 'ignored' | 'edited' | 'untagged' | 'removal-requested';

export type ResolutionNotice = { findingId: string; resolution: Resolution };

export type DemoFootprintFinding = {
  id: string;
  title: string;
  source: string;
  // One line shown on the results card, so the reason is visible before opening it.
  reason: string;
  category: FindingCategory;
  risk: FindingRisk;
  matchesDemoGoals: boolean;
  detail: FindingDetail;
};
