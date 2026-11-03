import { goalOptions } from '../data/goalOptions';
import type { GoalId } from '../types/lens';
import { MultiSelectStepScreen } from './MultiSelectStepScreen';

type Props = {
  onBack: () => void;
  onSkip: () => void;
  onContinue: (goalIds: readonly GoalId[]) => void;
};

// Lens - 2 (32:498): supplied screenshot and previously retrieved Figma geometry.
// Draft selections only. No preferences are stored or applied to post analysis.
export function GoalSelectionScreen({ onBack, onSkip, onContinue }: Props) {
  return (
    <MultiSelectStepScreen
      step={1}
      totalSteps={4}
      title={'What are you working\ntoward?'}
      options={goalOptions}
      backLabel="Back to My Lens"
      skipLabel="Skip goal selection for now"
      onBack={onBack}
      onSkip={onSkip}
      onContinue={onContinue}
    />
  );
}
