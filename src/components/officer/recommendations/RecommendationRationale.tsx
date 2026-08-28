import React from 'react';
import Card from '../../ui/Card';
import type { Recommendation } from '@/services/recommendationService';

interface Props {
  recommendation: Recommendation;
}

export const RecommendationRationale: React.FC<Props> = ({ recommendation }) => {
  return (
    <Card className="p-5 select-none text-left bg-surface border border-border font-sans space-y-4">
      <div>
        <h4 className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Trigger Source</h4>
        <p className="text-xs text-textPrimary font-semibold leading-relaxed pt-0.5">{recommendation.trigger}</p>
      </div>

      <div>
        <h4 className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Contextual Analysis</h4>
        <p className="text-xs text-textSecondary leading-relaxed pt-0.5">{recommendation.context}</p>
      </div>

      <div>
        <h4 className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Suggested Consideration</h4>
        <p className="text-xs text-textSecondary leading-relaxed pt-0.5">{recommendation.consideration}</p>
      </div>

      <p className="text-[10px] text-textMuted leading-normal border-t border-border/40 pt-3 select-none">
        ⚠️ AI-generated suggestion (FR-40): Review this option alongside active duty logs and Welfare Officer judgment before scheduling check-ins.
      </p>
    </Card>
  );
};
export default RecommendationRationale;
