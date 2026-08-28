import React from 'react';
import Card from '../../ui/Card';
import Tooltip from '../../ui/Tooltip';

interface Props {
  summaryText: string;
}

export const RiskExplanation: React.FC<Props> = ({ summaryText }) => {
  return (
    <Card className="p-5 select-none text-left bg-surface border border-border font-sans">
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-border pb-2">
          <h3 className="font-bold text-textPrimary text-base">Why is this case highlighted?</h3>
          
          <Tooltip content="Welfare Assessment Engine Model v0.1. Generates evaluations by tracking workload circadian rhythms and voluntary check-in averages.">
            <span className="text-[10px] text-textMuted cursor-help font-bold underline select-none">
              Model v0.1 (FR-47)
            </span>
          </Tooltip>
        </div>

        <p className="text-xs text-textSecondary leading-relaxed font-medium">
          {summaryText}
        </p>

        {/* AI Disclaimer Warning (FR-29) */}
        <div className="bg-primary/5 border border-primary/10 rounded-md p-3.5 text-[11px] text-textSecondary leading-relaxed space-y-1 select-none">
          <h5 className="font-bold text-primary uppercase tracking-wide text-[9px]">
            AI-Assisted Assessment
          </h5>
          <p>
            This assessment combines available duty allocation figures and voluntary wellbeing check-ins to assist review.
          </p>
          <p className="font-bold text-textPrimary">
            It is not a medical or psychological diagnosis and does not automate decisions.
          </p>
        </div>
      </div>
    </Card>
  );
};
export default RiskExplanation;
