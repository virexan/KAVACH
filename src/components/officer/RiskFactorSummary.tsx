import React from 'react';
import type { RiskFactorSummary as FactorType } from '@/services/caseService';

interface Props {
  factors: FactorType[];
}

export const RiskFactorSummary: React.FC<Props> = ({ factors }) => {
  if (!factors || factors.length === 0) {
    return <span className="text-textMuted text-xs font-semibold select-none">—</span>;
  }

  const getFactorBadgeClass = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-danger/10 text-danger border-danger/15';
      case 'MODERATE':
        return 'bg-warning/10 text-warning border-warning/15';
      default:
        return 'bg-surfaceAlt text-textSecondary border-border';
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 select-none animate-fadeIn">
      {factors.map((f, idx) => (
        <span
          key={idx}
          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${getFactorBadgeClass(
            f.severity
          )}`}
          title={`${f.factor}: ${f.label}`}
        >
          {f.label}
        </span>
      ))}
    </div>
  );
};
export default RiskFactorSummary;
