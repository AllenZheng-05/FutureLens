import { goalOptions } from './goalOptions';
import type { DemoFootprintFinding, FindingCategory, FindingRisk } from '../types/footprint';
import type { GoalId } from '../types/lens';

// Used until a Lens with at least one goal is saved, so the demo still shows nine matches.
export const presetDemoGoalIds: readonly GoalId[] = ['public-office', 'career'];

// The saved Lens goals, or the preset when no Lens (or no goal) has been saved.
export function activeFootprintGoalIds(lensGoalIds: readonly GoalId[] | null) {
  return lensGoalIds && lensGoalIds.length > 0 ? lensGoalIds : presetDemoGoalIds;
}

export function findingMatchesGoals(finding: DemoFootprintFinding, goalIds: readonly GoalId[]) {
  return finding.goalIds.some(goalId => goalIds.includes(goalId));
}

// Label for the Review item chip: the finding's first goal that is currently active.
export function matchedGoalLabel(finding: DemoFootprintFinding, goalIds: readonly GoalId[]) {
  const goalId = finding.goalIds.find(id => goalIds.includes(id));
  return goalOptions.find(goal => goal.id === goalId)?.label;
}

export type FindingGroup = {
  risk: FindingRisk;
  title: string;
  findings: readonly DemoFootprintFinding[];
};

const groupTitles: Record<FindingRisk, string> = {
  high: 'Fix first',
  medium: 'Worth a look',
  low: 'Low priority',
};

const riskOrder: readonly FindingRisk[] = ['high', 'medium', 'low'];

// Your own posts come first, then listings, then what others tagged or wrote.
const categoryPriority: readonly FindingCategory[] = ['posts', 'directories', 'tagged', 'mentions'];

// Results list sections by risk, each sorted by category (Array.sort is stable). Empty groups are dropped.
export function groupFindingsByPriority(findings: readonly DemoFootprintFinding[]): FindingGroup[] {
  return riskOrder
    .map(risk => ({
      risk,
      title: groupTitles[risk],
      findings: findings
        .filter(finding => finding.risk === risk)
        .sort((a, b) => categoryPriority.indexOf(a.category) - categoryPriority.indexOf(b.category)),
    }))
    .filter(group => group.findings.length > 0);
}
