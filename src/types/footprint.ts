export type DemoAccountId = 'public' | 'friends' | 'video' | 'photos' | 'career';

export type DemoAccount = {
  id: DemoAccountId;
  label: string;
  subtitle: string;
  available: boolean;
  initiallySelected: boolean;
};
