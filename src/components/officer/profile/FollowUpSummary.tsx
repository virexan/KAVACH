import React from 'react';
import Card from '../../ui/Card';
import type { FollowUpSummary as SummaryType } from '@/services/caseService';

interface Props {
  followUp?: SummaryType;
  onCreate: () => void;
}

export const FollowUpSummary: React.FC<Props> = ({ followUp, onCreate }) => {
  const getStatusClass = (st: string) => {
    if (st === 'SCHEDULED') return 'bg-primary/15 text-primary border-primary/20';
    if (st === 'COMPLETED') return 'bg-success/15 text-success border-success/20';
    return 'bg-warning/15 text-warning border-warning/20';
  };

  return (
    <Card className="p-5 select-none text-left bg-surface border border-border font-sans animate-fadeIn">
      <h3 className="font-bold text-textPrimary text-sm border-b border-border pb-2 mb-4 uppercase tracking-wide">
        Active Follow-Up Summary
      </h3>

      {!followUp || followUp.status === 'NOT_REQUIRED' ? (
        <div className="space-y-3 font-sans">
          <p className="text-xs text-textMuted">No active follow-up actions recorded for this member.</p>
          <button
            onClick={onCreate}
            className="text-xs font-bold text-primary hover:underline focus:outline-none"
          >
            + Create Follow-Up Review
          </button>
        </div>
      ) : (
        <div className="space-y-3 font-sans">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-textSecondary">Action Status</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusClass(followUp.status)}`}>
              {followUp.status}
            </span>
          </div>
          {followUp.date && (
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-textSecondary">Scheduled Date</span>
              <span className="font-bold text-textPrimary">
                {new Date(followUp.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          )}
          {followUp.type && (
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-textSecondary">Follow-Up Type</span>
              <span className="font-bold text-textPrimary">{followUp.type.replace(/_/g, ' ')}</span>
            </div>
          )}
          {followUp.notes && (
            <div className="pt-2 border-t border-border/40 space-y-1 text-xs">
              <span className="font-semibold text-textMuted block">Confidential Notes</span>
              <p className="text-textSecondary leading-relaxed bg-surfaceAlt/30 border border-border/40 p-2.5 rounded font-medium italic">
                "{followUp.notes}"
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
export default FollowUpSummary;
