export type GoalId = 'public-office' | 'career' | 'education' | 'creator' | 'other';

export type PerspectiveId = 'employers' | 'voters-press' | 'admissions' | 'strangers' | 'family' | 'rivals';

export type TopicId = 'politics' | 'jokes' | 'partying' | 'rants' | 'location' | 'opinions';

export type LensOption<T extends string> = {
  id: T;
  label: string;
};

export type GoalOption = LensOption<GoalId>;
