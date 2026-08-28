import React from 'react';
import Card from '../../ui/Card';
import type { DataFreshness as FreshnessType } from '@/services/caseService';

interface Props {
  freshness: FreshnessType;
}

export const DataFreshness: React.FC<Props> = ({ freshness }) => {
  const formatTime = (isoString: string) => {
    if (!isoString) return 'No recent data (FR-38)';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="p-5 select-none text-left bg-surface border border-border font-sans">
      <h3 className="font-bold text-textPrimary text-sm border-b border-border pb-2 mb-4 uppercase tracking-wide">
        Information Synchronicity (Freshness)
      </h3>

      <div className="grid grid-cols-2 gap-4 text-xs font-sans">
        <div className="space-y-0.5">
          <span className="text-textMuted font-bold uppercase text-[9px] block">Risk Flag Calculated</span>
          <span className="font-bold text-textSecondary">{formatTime(freshness.riskUpdated)}</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-textMuted font-bold uppercase text-[9px] block">Last Wellness Check-In</span>
          <span className="font-bold text-textSecondary">{formatTime(freshness.lastWellnessCheckIn)}</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-textMuted font-bold uppercase text-[9px] block">Workload Roster Data</span>
          <span className="font-bold text-textSecondary">{formatTime(freshness.workloadData)}</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-textMuted font-bold uppercase text-[9px] block">Deployment Schedule Data</span>
          <span className="font-bold text-textSecondary">{formatTime(freshness.deploymentData)}</span>
        </div>
      </div>
    </Card>
  );
};
export default DataFreshness;
