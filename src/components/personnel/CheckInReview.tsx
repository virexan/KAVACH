import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import TextArea from '../ui/TextArea';
import Checkbox from '../ui/Checkbox';

interface ReviewProps {
  answers: {
    mood: number;
    energy: number;
    stress: number;
    fatigue: number;
    sleep: number;
  };
  notes: string;
  setNotes: (notes: string) => void;
  onEditStep: (stepIdx: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
}

export const CheckInReview: React.FC<ReviewProps> = ({
  answers,
  notes,
  setNotes,
  onEditStep,
  onSubmit,
  onBack,
  isLoading,
  error,
}) => {
  const [consentGiven, setConsentGiven] = useState(true);

  const getScoreLabel = (score: number, dimension: string) => {
    if (dimension === 'mood') {
      const labels = ['Very low', 'Low', 'Okay', 'Good', 'Very good'];
      return labels[score - 1];
    }
    const labels = ['Very low', 'Low', 'Moderate', 'High', 'Very high'];
    if (dimension === 'sleep') {
      const sleepLabels = ['Very poor', 'Poor', 'Okay', 'Good', 'Very good'];
      return sleepLabels[score - 1];
    }
    return labels[score - 1];
  };

  const reviewItems = [
    { label: 'Mood', val: answers.mood, dim: 'mood', stepIdx: 0 },
    { label: 'Energy', val: answers.energy, dim: 'energy', stepIdx: 1 },
    { label: 'Stress', val: answers.stress, dim: 'stress', stepIdx: 2 },
    { label: 'Fatigue', val: answers.fatigue, dim: 'fatigue', stepIdx: 3 },
    { label: 'Sleep Quality', val: answers.sleep, dim: 'sleep', stepIdx: 4 },
  ];

  return (
    <Card className="bg-surface p-6 space-y-6">
      <div className="space-y-1.5 select-none">
        <h3 className="text-lg font-bold text-textPrimary leading-tight">Review Your Answers</h3>
        <p className="text-xs text-textMuted">Ensure these accurately reflect your day before submitting.</p>
      </div>

      {error && (
        <div role="alert" className="bg-danger/10 border border-danger/20 text-danger text-xs font-semibold p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Answer list with edit indicators (FR-18) */}
      <div className="border border-border rounded-md divide-y divide-border select-none bg-surfaceAlt/10">
        {reviewItems.map((item) => (
          <div key={item.label} className="flex justify-between items-center px-4 py-3 text-sm">
            <div className="flex flex-col">
              <span className="font-semibold text-textSecondary">{item.label}</span>
              <span className="text-xs font-black text-textPrimary mt-0.5">
                {getScoreLabel(item.val, item.dim)}
              </span>
            </div>
            <button
              onClick={() => onEditStep(item.stepIdx)}
              className="text-xs font-bold text-primary hover:underline focus:outline-none"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Free text input (FR-16) */}
      <div className="space-y-1">
        <TextArea
          label="Anything else you'd like us to know? (Optional)"
          placeholder="You don't need to share anything you are uncomfortable sharing."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={500}
          disabled={isLoading}
        />
        <p className="text-[10px] text-textMuted leading-normal select-none">
          Notes entered here are private to your welfare log and can only be seen by you.
        </p>
      </div>

      {/* Consent Notice (FR-17) */}
      <div className="bg-primary/5 border border-primary/15 rounded-md p-4 space-y-3">
        <div className="space-y-1 select-none">
          <h4 className="text-xs font-bold text-primary uppercase tracking-wide">Before you continue</h4>
          <p className="text-xs text-textSecondary leading-relaxed">
            Your responses are completely voluntary. Your entries help construct anonymous patterns to flag workload fatigue early and suggest resources. You can opt out or request data purges at any time in settings.
          </p>
        </div>
        <Checkbox
          id="checkin-consent"
          label="I understand my responses are voluntary and consent to their collection."
          checked={consentGiven}
          onChange={(e) => setConsentGiven(e.target.checked)}
          disabled={isLoading}
        />
      </div>

      {/* Action Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-border/60">
        <Button variant="secondary" size="sm" onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onSubmit}
          disabled={!consentGiven}
          isLoading={isLoading}
        >
          Submit Check-In
        </Button>
      </div>
    </Card>
  );
};
export default CheckInReview;
