import React from 'react';
import Card from '../ui/Card';
import type { PressurePoint } from '@/services/commanderService';

interface Props {
  point: PressurePoint;
}

export const PressurePointCard: React.FC<Props> = ({ point }) => {
  const getSeverityStyle = (sev: string) => {
    if (sev === 'HIGH') return 'bg-danger/10 text-danger border-danger/20';
    if (sev === 'MODERATE') return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-primary/10 text-primary border-primary/20';
  };

  return (
    <Card className="p-4 bg-surface border border-border flex flex-col justify-between font-sans select-none text-left space-y-3 animate-fadeIn">
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider">
            {point.category}
          </span>
          <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase tracking-wider ${getSeverityStyle(point.severity)}`}>
            {point.severity} Severity
          </span>
        </div>
        <h4 className="font-bold text-textPrimary text-sm leading-tight select-none">
          {point.title}
        </h4>
      </div>

      <p className="text-xs text-textSecondary leading-relaxed">
        {point.description}
      </p>

      <div className="pt-2 border-t border-border/40 text-[10px] text-textMuted font-semibold">
        Trend: <span className="text-textSecondary uppercase">{point.trend.toLowerCase()}</span>
      </div>
    </Card>
  );
};
export default PressurePointCard;
