import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import commanderService from '@/services/commanderService';
import AggregateRiskDistribution from '@/components/commander/AggregateRiskDistribution';
import AggregateRiskTrendChart from '@/components/commander/AggregateRiskTrendChart';
import WorkloadOverview from '@/components/commander/WorkloadOverview';
import PressurePointList from '@/components/commander/PressurePointList';
import PrivacySuppressedState from '@/components/commander/PrivacySuppressedState';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

export const CommanderUnitPage: React.FC = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();

  const { data: unitRes, isLoading, isError, refetch } = useQuery({
    queryKey: ['commander-unit-analytics', unitId],
    queryFn: () => commanderService.getUnitAnalytics(unitId!),
    enabled: !!unitId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="line" className="h-8 w-1/3" />
        <Skeleton variant="block" className="h-48 w-full" />
      </div>
    );
  }

  if (isError || !unitRes) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <ErrorState
          title="Unit Analytics Failed"
          description="We couldn't retrieve aggregate metrics for this unit."
          retryLabel="Try Again"
          onRetry={() => refetch()}
          className="max-w-md bg-surface border border-border"
        />
      </div>
    );
  }

  const unit = unitRes.data;

  // Mount privacy suppression placeholder (FR-39)
  if (unit.isSuppressed) {
    return (
      <div className="space-y-6 select-none font-sans text-left my-6 max-w-md mx-auto">
        <button
          onClick={() => navigate('/commander')}
          className="text-xs font-bold text-textMuted hover:text-primary transition-colors focus:outline-none"
        >
          ← Back to Dashboard
        </button>
        <PrivacySuppressedState />
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none font-sans text-left animate-fadeIn">
      <div className="border-b border-border pb-4">
        <button
          onClick={() => navigate('/commander')}
          className="text-xs font-bold text-textMuted hover:text-primary transition-colors flex items-center gap-1.5 focus:outline-none mb-1"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-black text-textPrimary leading-tight">
          {unit.unitName}
        </h1>
        <p className="text-xs text-textMuted mt-0.5">
          Personnel in Scope: <strong className="text-textSecondary font-bold">{unit.personnelInScope} personnel</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AggregateRiskDistribution distribution={unit.riskDistribution} />
          <AggregateRiskTrendChart points={unit.riskTrend.points} direction={unit.riskTrend.direction} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <PressurePointList points={unit.pressurePoints} />
        </div>
      </div>

      <WorkloadOverview summary={unit.workloadSummary} />
    </div>
  );
};
export default CommanderUnitPage;
