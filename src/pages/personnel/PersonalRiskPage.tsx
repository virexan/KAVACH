import React from 'react';
import { useQuery } from '@tanstack/react-query';
import riskService from '@/services/riskService';
import RiskExplanation from '@/components/personnel/RiskExplanation';
import Skeleton from '@/components/ui/Skeleton';
import RiskBadge from '@/components/ui/RiskBadge';

export const PersonalRiskPage: React.FC = () => {
  const { data: riskRes, isLoading, isError } = useQuery({
    queryKey: ['personal-risk'],
    queryFn: () => riskService.getPersonalRisk(),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="line" className="h-8 w-1/4" />
        <Skeleton variant="block" className="h-48 w-full" />
      </div>
    );
  }

  const risk = riskRes?.data;

  return (
    <div className="space-y-6 select-none max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">Wellbeing Overview</h1>
        <p className="text-xs text-textMuted mt-0.5">Details of your recent workload & stress factors.</p>
      </div>

      {isError || !risk ? (
        <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-semibold p-4 rounded-md text-center">
          Failed to load wellbeing details. Please retry.
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          {/* Status Bar Summary */}
          <div className="flex justify-between items-center bg-surface border border-border p-4 rounded-lg shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Current Status</span>
              <div className="flex items-center gap-2">
                <RiskBadge level={risk.level} />
              </div>
            </div>
            <div className="text-right space-y-1">
              <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Trend Direction</span>
              <p className="text-sm font-bold text-textPrimary">
                {risk.trend === 'IMPROVING' ? 'Improving ↑' : risk.trend === 'INCREASING' ? 'Increasing ↓' : 'Stable →'}
              </p>
            </div>
          </div>

          {/* Contributors & AI Transparency Explanation (FR-51) */}
          {risk.contributingFactors && (
            <RiskExplanation factors={risk.contributingFactors} />
          )}
        </div>
      )}
    </div>
  );
};
export default PersonalRiskPage;
