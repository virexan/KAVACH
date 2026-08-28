import React from 'react';
import type { FollowUp } from '@/services/interventionService';
import InterventionStatusBadge from './InterventionStatusBadge';

interface Props {
  interventions: FollowUp[];
  onStart: (id: string) => void;
  onComplete: (followUp: FollowUp) => void;
  onReschedule: (followUp: FollowUp) => void;
  onCancel: (followUp: FollowUp) => void;
  onViewOutcome: (followUp: FollowUp) => void;
}

export const InterventionTable: React.FC<Props> = ({
  interventions,
  onStart,
  onComplete,
  onReschedule,
  onCancel,
  onViewOutcome,
}) => {
  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto border border-border rounded-md bg-surface select-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surfaceAlt/60 text-xs font-bold text-textSecondary border-b border-border">
              <th className="p-3">Personnel Case</th>
              <th className="p-3">Follow-Up Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Scheduled Date</th>
              <th className="p-3">Created Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm font-sans">
            {interventions.map((int) => (
              <tr key={int.id} className="hover:bg-surfaceAlt/10">
                <td className="p-3 font-semibold text-textPrimary">{int.personnelDisplayId}</td>
                <td className="p-3 text-textSecondary">{int.type.replace(/_/g, ' ')}</td>
                <td className="p-3">
                  <InterventionStatusBadge status={int.status} />
                </td>
                <td className="p-3 text-textSecondary font-medium">{formatDate(int.scheduledFor)}</td>
                <td className="p-3 text-xs text-textMuted">{formatDate(int.createdAt)}</td>
                <td className="p-3 text-right space-x-2">
                  {int.status === 'SCHEDULED' && (
                    <>
                      <button onClick={() => onStart(int.id)} className="text-xs font-bold text-primary hover:underline focus:outline-none">
                        Start
                      </button>
                      <button onClick={() => onReschedule(int)} className="text-xs font-bold text-textSecondary hover:underline focus:outline-none">
                        Reschedule
                      </button>
                      <button onClick={() => onCancel(int)} className="text-xs font-bold text-danger hover:underline focus:outline-none">
                        Cancel
                      </button>
                    </>
                  )}
                  {int.status === 'DUE' && (
                    <>
                      <button onClick={() => onStart(int.id)} className="text-xs font-bold text-primary hover:underline focus:outline-none">
                        Start
                      </button>
                      <button onClick={() => onReschedule(int)} className="text-xs font-bold text-textSecondary hover:underline focus:outline-none">
                        Reschedule
                      </button>
                    </>
                  )}
                  {int.status === 'IN_PROGRESS' && (
                    <button onClick={() => onComplete(int)} className="text-xs font-bold text-success hover:underline focus:outline-none">
                      Complete
                    </button>
                  )}
                  {int.status === 'COMPLETED' && int.outcome && (
                    <button onClick={() => onViewOutcome(int)} className="text-xs font-bold text-primary hover:underline focus:outline-none">
                      View Outcome
                    </button>
                  )}
                  {int.status === 'CANCELLED' && (
                    <span className="text-xs text-textMuted font-bold select-none">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked cards list (FR-55) */}
      <div className="md:hidden space-y-3 font-sans">
        {interventions.map((int) => (
          <div
            key={int.id}
            className="p-4 border border-border rounded-lg bg-surface space-y-3 select-none animate-fadeIn"
          >
            <div className="flex justify-between items-center border-b border-border/40 pb-2">
              <span className="font-bold text-textPrimary text-sm">{int.personnelDisplayId}</span>
              <InterventionStatusBadge status={int.status} />
            </div>

            <div className="space-y-1 text-xs text-textSecondary">
              <p>Type: <strong className="text-textPrimary">{int.type.replace(/_/g, ' ')}</strong></p>
              <p>Scheduled: <strong className="text-textPrimary">{formatDate(int.scheduledFor)}</strong></p>
              <p className="text-[10px] text-textMuted">Created: {formatDate(int.createdAt)}</p>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-border/40">
              {int.status === 'SCHEDULED' && (
                <>
                  <button onClick={() => onStart(int.id)} className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold rounded">
                    Start
                  </button>
                  <button onClick={() => onReschedule(int)} className="px-2 py-1 border border-border text-textSecondary text-[10px] font-bold rounded">
                    Reschedule
                  </button>
                </>
              )}
              {int.status === 'IN_PROGRESS' && (
                <button onClick={() => onComplete(int)} className="px-2.5 py-1 bg-success/10 text-success border border-success/20 text-[10px] font-bold rounded">
                  Complete
                </button>
              )}
              {int.status === 'COMPLETED' && int.outcome && (
                <button onClick={() => onViewOutcome(int)} className="px-2 py-1 border border-border text-primary text-[10px] font-bold rounded">
                  Outcome
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default InterventionTable;
