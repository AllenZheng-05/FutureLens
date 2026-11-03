import { goalOptions } from '../data/goalOptions';
import type { GoalId } from '../types/lens';
import { MultiSelectStepScreen } from './MultiSelectStepScreen';

type Props = {
  initialIds?: readonly GoalId[];
  backLabel?: string;
  onBack: () => void;
  onSkip: () => void;
  onContinue: (goalIds: readonly GoalId[]) => void;
};

// Lens - 2 (32:498): supplied screenshot and previously retrieved Figma geometry.
// Draft selections only. No preferences are stored or applied to post analysis.
export function GoalSelectionScreen({ initialIds, backLabel = 'Back to My Lens', onBack, onSkip, onContinue }: Props) {
  return (
    <MultiSelectStepScreen
      step={1}
      totalSteps={4}
      title={'What are you working\ntoward?'}
      options={goalOptions}
      initialIds={initialIds}
      backLabel={backLabel}
      skipLabel="Skip goal selection for now"
      onBack={onBack}
      onSkip={onSkip}
      onContinue={onContinue}
    />
  );
}
