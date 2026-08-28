import React from 'react';
import Card from '../../ui/Card';
import type { FollowUpOutcome } from '@/services/interventionService';

interface Props {
  outcome: FollowUpOutcome;
}

export const OutcomeSummary: React.FC<Props> = ({ outcome }) => {
  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <Card className="bg-surface p-4 border border-border text-left select-none space-y-3 font-sans animate-fadeIn">
      <div className="flex justify-between items-center border-b border-border pb-2">
        <h4 className="text-xs font-bold text-textPrimary uppercase tracking-wide">
          Intervention Outcome
        </h4>
        <span className="text-[10px] text-textMuted font-bold">
          Recorded: {formatDate(outcome.recordedAt)}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <span className="text-textMuted font-semibold uppercase text-[9px] block">Outcome Status</span>
          <span className="font-bold text-textSecondary">{outcome.outcome.replace(/_/g, ' ')}</span>
        </div>

        {outcome.nextReviewDate && (
          <div>
            <span className="text-textMuted font-semibold uppercase text-[9px] block">Next Scheduled Review</span>
            <span className="font-bold text-textSecondary">{formatDate(outcome.nextReviewDate)}</span>
          </div>
        )}

        {outcome.notes && (
          <div className="pt-2 border-t border-border/40 space-y-1">
            <span className="text-textMuted font-semibold uppercase text-[9px] block">Confidential Notes</span>
            <p className="text-textSecondary bg-surfaceAlt/30 border border-border/40 p-2.5 rounded italic font-medium">
              "{outcome.notes}"
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
export default OutcomeSummary;
