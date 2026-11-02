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
