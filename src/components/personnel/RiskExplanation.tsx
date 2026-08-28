import React from 'react';
import type { PersonalRiskFactor } from '@/services/riskService';
import Card from '../ui/Card';

interface RiskExplanationProps {
  factors: PersonalRiskFactor[];
}

export const RiskExplanation: React.FC<RiskExplanationProps> = ({ factors }) => {
  return (
    <div className="space-y-6 select-none">
      <Card className="bg-surface">
        <h4 className="font-bold text-textPrimary text-sm mb-4 border-b border-border pb-2">
          What may be contributing
        </h4>
        <p className="text-xs text-textMuted mb-4">
          Your recent check-in patterns indicate that the following indicators may currently affect your wellbeing indices:
        </p>
        
        <ul className="space-y-4">
          {factors.map((f, idx) => (
            <li key={idx} className="flex flex-col gap-1 border-l-2 border-primary/30 pl-3">
              <span className="text-sm font-semibold text-textPrimary">{f.factor}</span>
              <span className="text-xs text-textSecondary leading-relaxed">{f.description}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* AI Transparency Notice (FR-51, UX-3) */}
      <div className="bg-surfaceAlt/60 border border-border rounded-lg p-4 text-xs text-textMuted leading-relaxed space-y-1">
        <h5 className="font-bold text-textSecondary uppercase tracking-wide text-[10px]">
          About this overview
        </h5>
        <p>
          This wellbeing overview is derived from operational workloads and voluntary self-report check-ins. It is designed to identify fatigue patterns early and offer support.
        </p>
        <p className="font-semibold text-textSecondary pt-1">
          This is not a medical diagnosis.
        </p>
      </div>
    </div>
  );
};
export default RiskExplanation;
