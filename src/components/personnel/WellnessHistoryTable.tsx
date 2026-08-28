import React, { useState } from 'react';
import type { WellnessCheckIn } from '@/services/wellnessService';
import Modal from '../ui/Modal';

interface HistoryProps {
  logs: WellnessCheckIn[];
}

export const WellnessHistoryTable: React.FC<HistoryProps> = ({ logs }) => {
  const [selectedLog, setSelectedLog] = useState<WellnessCheckIn | null>(null);

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getScoreText = (score: number, dimension: string) => {
    if (dimension === 'mood') {
      return ['Very low', 'Low', 'Okay', 'Good', 'Very good'][score - 1];
    }
    if (dimension === 'sleep') {
      return ['Very poor', 'Poor', 'Okay', 'Good', 'Very good'][score - 1];
    }
    return ['Very low', 'Low', 'Moderate', 'High', 'Very high'][score - 1];
  };

  return (
    <div className="space-y-4">
      {/* Desktop view (FR-21) */}
      <div className="hidden md:block overflow-x-auto border border-border rounded-md select-none bg-surface">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surfaceAlt/60 text-xs font-bold text-textSecondary border-b border-border">
              <th className="p-3">Date</th>
              <th className="p-3">Mood</th>
              <th className="p-3">Energy</th>
              <th className="p-3">Stress</th>
              <th className="p-3">Fatigue</th>
              <th className="p-3">Sleep</th>
              <th className="p-3">Notes</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-surfaceAlt/20">
                <td className="p-3 font-semibold text-textPrimary">{formatDate(log.submittedAt)}</td>
                <td className="p-3">{getScoreText(log.moodScore, 'mood')}</td>
                <td className="p-3">{getScoreText(log.energyScore, 'energy')}</td>
                <td className="p-3">{getScoreText(log.stressScore, 'stress')}</td>
                <td className="p-3">{getScoreText(log.fatigueScore, 'fatigue')}</td>
                <td className="p-3">{getScoreText(log.sleepScore, 'sleep')}</td>
                <td className="p-3">
                  {log.notes ? (
                    <span className="text-primary font-bold text-xs" title={log.notes}>
                      Has Notes
                    </span>
                  ) : (
                    <span className="text-textMuted text-xs">—</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="text-xs font-bold text-primary hover:underline focus:outline-none"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked view (FR-21) */}
      <div className="md:hidden space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            onClick={() => setSelectedLog(log)}
            className="p-4 border border-border rounded-lg bg-surface space-y-3 active:bg-surfaceAlt/30 cursor-pointer select-none"
          >
            <div className="flex justify-between items-center border-b border-border/40 pb-2">
              <span className="font-bold text-textPrimary text-sm">{formatDate(log.submittedAt)}</span>
              <span className="text-[10px] font-bold text-primary uppercase">Tap to view</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-textSecondary">
              <div>Mood: <strong className="text-textPrimary">{getScoreText(log.moodScore, 'mood')}</strong></div>
              <div>Energy: <strong className="text-textPrimary">{getScoreText(log.energyScore, 'energy')}</strong></div>
              <div>Stress: <strong className="text-textPrimary">{getScoreText(log.stressScore, 'stress')}</strong></div>
              <div>Sleep: <strong className="text-textPrimary">{getScoreText(log.sleepScore, 'sleep')}</strong></div>
            </div>
            {log.notes && (
              <div className="text-[10px] text-primary bg-primary/5 p-1 rounded inline-block">
                Includes private notes
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detail Modal (FR-22) */}
      {selectedLog && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedLog(null)}
          title={`Check-in Details — ${formatDate(selectedLog.submittedAt)}`}
          footer={
            <button
              onClick={() => setSelectedLog(null)}
              className="px-4 py-2 bg-surfaceAlt border border-border text-textPrimary rounded-md text-xs font-semibold focus:outline-none"
            >
              Close
            </button>
          }
        >
          <div className="space-y-4 select-none">
            <div className="grid grid-cols-2 gap-3 border border-border rounded p-3 bg-surfaceAlt/20 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-textMuted">Mood</span>
                <span className="font-bold text-textPrimary">{getScoreText(selectedLog.moodScore, 'mood')}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-textMuted">Energy</span>
                <span className="font-bold text-textPrimary">{getScoreText(selectedLog.energyScore, 'energy')}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-textMuted">Stress Level</span>
                <span className="font-bold text-textPrimary">{getScoreText(selectedLog.stressScore, 'stress')}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-textMuted">Fatigue Level</span>
                <span className="font-bold text-textPrimary">{getScoreText(selectedLog.fatigueScore, 'fatigue')}</span>
              </div>
              <div className="flex flex-col gap-0.5 col-span-2">
                <span className="text-textMuted">Sleep Quality</span>
                <span className="font-bold text-textPrimary">{getScoreText(selectedLog.sleepScore, 'sleep')}</span>
              </div>
            </div>

            {selectedLog.notes && (
              <div className="space-y-1 bg-surface border border-border/40 p-3 rounded">
                <h5 className="text-xs font-bold text-textSecondary uppercase tracking-wide text-[10px]">
                  Private Notes
                </h5>
                <p className="text-xs text-textSecondary leading-relaxed whitespace-pre-wrap">
                  {selectedLog.notes}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
export default WellnessHistoryTable;
