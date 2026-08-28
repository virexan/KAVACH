import React from 'react';
import Card from '../ui/Card';
import PressurePointCard from './PressurePointCard';
import type { PressurePoint } from '@/services/commanderService';

interface Props {
  points: PressurePoint[];
}

export const PressurePointList: React.FC<Props> = ({ points }) => {
  return (
    <Card className="bg-surface border border-border p-5 font-sans select-none text-left space-y-4 animate-fadeIn">
      <div>
        <h3 className="font-bold text-textPrimary text-base">Current Pressure Points</h3>
        <p className="text-[10px] text-textMuted uppercase font-bold tracking-wide">Top associated stressors in this reporting period (FR-21)</p>
      </div>

      {points.length === 0 ? (
        <p className="text-xs text-textMuted font-bold">No organizational pressure points detected.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {points.map((p) => (
            <PressurePointCard key={p.id} point={p} />
          ))}
        </div>
      )}

      {/* Causality Disclaimer (FR-22) */}
      <div className="bg-surfaceAlt border border-border p-3 rounded-md text-[10px] text-textSecondary leading-relaxed select-none">
        ℹ️ <strong>Causality Disclaimer (FR-22):</strong> These operational factors are statistically associated with current aggregate risk indicators. Association does not necessarily imply direct causation. Review recommendations in local context.
      </div>
    </Card>
  );
};
export default PressurePointList;
