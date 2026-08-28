import React from 'react';
import Card from '../../ui/Card';
import type { RiskFactor } from '@/services/caseService';

interface Props {
  factors: RiskFactor[];
  onSelectFactor: (factor: RiskFactor) => void;
}

export const ContributingFactors: React.FC<Props> = ({ factors, onSelectFactor }) => {
  const getSeverityPercent = (sev: string) => {
    if (sev === 'HIGH') return 80;
    if (sev === 'MODERATE') return 50;
    return 20;
  };

  const getSeverityColor = (sev: string) => {
    if (sev === 'HIGH') return 'bg-danger';
    if (sev === 'MODERATE') return 'bg-warning';
    return 'bg-primary';
  };

  if (!factors || factors.length === 0) {
    return (
      <Card className="p-5 select-none text-left bg-surface border border-border font-sans">
        <h4 className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Contributing Factors</h4>
        <p className="text-xs text-textMuted font-medium">No contributing factors active.</p>
      </Card>
    );
  }

  return (
    <Card className="p-5 select-none text-left bg-surface border border-border font-sans">
      <h3 className="font-bold text-textPrimary text-base border-b border-border pb-2 mb-4">
        Contributing Factors
      </h3>

      <div className="space-y-4">
        {factors.map((f) => (
          <div
            key={f.id}
            onClick={() => onSelectFactor(f)}
            className="flex items-center justify-between p-3 border border-border/60 hover:bg-surfaceAlt/20 rounded-md cursor-pointer transition-colors animate-fadeIn"
          >
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-textPrimary">{f.label}</span>
              <span className="text-[10px] text-textMuted block font-semibold">
                Trend: {f.trend ? f.trend.replace('_', ' ') : 'STABLE'}
              </span>
            </div>

            <div className="flex items-center gap-3 w-40 justify-end">
              <span className="text-[10px] font-bold uppercase text-textSecondary">{f.severity}</span>
              <div className="w-24 bg-border h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${getSeverityColor(f.severity)}`}
                  style={{ width: `${getSeverityPercent(f.severity)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
export default ContributingFactors;
