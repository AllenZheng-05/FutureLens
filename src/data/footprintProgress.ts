import { findingMatchesGoals } from './footprintGoals';
import type { DemoFootprintFinding, FindingCategory, Resolution } from '../types/footprint';
import type { GoalId } from '../types/lens';

export type FootprintProgress = {
  before: number;
  now: number;
  lines: readonly string[];
};

const categoryLabels: Record<FindingCategory, string> = {
  directories: 'Directory listings',
  posts: 'Public posts',
  tagged: 'Tagged photos',
  mentions: 'Mentions',
};

// What is still out there once a finding is left alone (kept, ignored or unresolved).
const remainingLabels: Record<FindingCategory, string> = {
  directories: 'still listed',
  posts: 'still public',
  tagged: 'still visible',
  mentions: 'still visible',
};

const resolvedLabels: Partial<Record<Resolution, string>> = {
  deleted: 'deleted',
  private: 'made private',
  edited: 'reworded',
  untagged: 'tag removed',
  'removal-requested': 'removal requested',
};

const categoryOrder: readonly FindingCategory[] = ['directories', 'posts', 'tagged', 'mentions'];

// Figma: Footprint - 14 (93:1439). Counts the findings that match the active goals, the
// same set as the default results view, so "Now" always equals "things worth a look".
export function summarizeFootprintProgress(
  findings: readonly DemoFootprintFinding[],
  resolutions: Readonly<Record<string, Resolution>>,
  goalIds: readonly GoalId[],
): FootprintProgress {
  const scope = findings.filter(finding => findingMatchesGoals(finding, goalIds));
  const lines = categoryOrder.flatMap(category => {
    const inCategory = scope.filter(finding => finding.category === category);
    if (inCategory.length === 0) return [];
    const counts = new Map<string, number>();
    for (const finding of inCategory) {
      const resolution = resolutions[finding.id];
      const label = (resolution && resolvedLabels[resolution]) ?? remainingLabels[category];
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
    const parts = [...counts].map(([label, count]) => `${count} ${label}`);
    return [`${categoryLabels[category]}: ${parts.join(', ')}`];
  });

  return {
    before: scope.length,
    now: scope.filter(finding => !resolutions[finding.id]).length,
    lines,
  };
}
