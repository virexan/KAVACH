import React from 'react';
import Card from '../ui/Card';

export const ConsentSection: React.FC = () => {
  return (
    <Card className="bg-surface p-5 space-y-6 select-none leading-relaxed">
      <div>
        <h3 className="font-bold text-textPrimary text-base border-b border-border pb-2.5">
          Data Usage Policy & Privacy Rules
        </h3>
        <p className="text-xs text-textMuted mt-1.5">
          KAVACH operates under strict data minimization guidelines. Read our commitment to your privacy below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5 border-l-2 border-primary/20 pl-3">
          <h4 className="text-xs font-bold text-textSecondary uppercase tracking-wide">
            What is collected?
          </h4>
          <p className="text-xs text-textSecondary">
            We collect voluntary daily self-report checks (mood, fatigue, sleep quality, stress levels, energy) and optional anonymous wearable biometric logs (sleep hours, activity index).
          </p>
        </div>

        <div className="space-y-1.5 border-l-2 border-primary/20 pl-3">
          <h4 className="text-xs font-bold text-textSecondary uppercase tracking-wide">
            Why is it collected?
          </h4>
          <p className="text-xs text-textSecondary">
            To build anonymous workload stress aggregates, help identify early operational fatigue signals, and prompt you with recovery suggestions.
          </p>
        </div>

        <div className="space-y-1.5 border-l-2 border-primary/20 pl-3">
          <h4 className="text-xs font-bold text-textSecondary uppercase tracking-wide">
            Who can access it?
          </h4>
          <p className="text-xs text-textSecondary">
            Your detailed check-in answers and comments are completely private and visible **only to you**. Welfare Officers see only simplified aggregate indicators to schedule voluntary calls. Command sections see only unit-wide anonymized percentages.
          </p>
        </div>

        <div className="space-y-1.5 border-l-2 border-primary/20 pl-3">
          <h4 className="text-xs font-bold text-textSecondary uppercase tracking-wide">
            How long is it retained?
          </h4>
          <p className="text-xs text-textSecondary">
            All wellness history records are retained for a rolling window of 90 days, after which they are permanently deleted from database logs automatically.
          </p>
        </div>
      </div>
    </Card>
  );
};
export default ConsentSection;
