import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import commanderService from '@/services/commanderService';
import CommanderHeader from '@/components/commander/CommanderHeader';
import CommanderMetricCard from '@/components/commander/CommanderMetricCard';
import AggregateRiskDistribution from '@/components/commander/AggregateRiskDistribution';
import AggregateRiskTrendChart from '@/components/commander/AggregateRiskTrendChart';
import PressurePointList from '@/components/commander/PressurePointList';
import UnitComparisonTable from '@/components/commander/UnitComparisonTable';
import CommanderAlertList from '@/components/commander/CommanderAlertList';
import PrivacySuppressedState from '@/components/commander/PrivacySuppressedState';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

export const CommanderDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedUnit, setSelectedUnit] = useState('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const { data: dbRes, isLoading, isError, refetch } = useQuery({
    queryKey: ['commander-dashboard', selectedUnit, selectedPeriod],
    queryFn: () => commanderService.getDashboard(selectedUnit),
  });

  const { data: comparisonUnits, isLoading: isUnitsLoading } = useQuery({
    queryKey: ['commander-comparison-units'],
    queryFn: async () => {
      const ids = ['UNIT-1', 'UNIT-2', 'UNIT-3', 'UNIT-4', 'UNIT-7'];
      const resList = await Promise.all(ids.map(id => commanderService.getUnitAnalytics(id)));
      return resList.map((r) => r.data);
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="line" className="h-8 w-1/3" />
        <Skeleton variant="block" className="h-48 w-full" />
      </div>
    );
  }

  if (isError || !dbRes) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <ErrorState
          title="Dashboard Load Failed"
          description="Unable to load the unit welfare overview. (FR-57)"
          retryLabel="Try Again"
          onRetry={() => refetch()}
          className="max-w-md bg-surface border border-border"
        />
      </div>
    );
  }

  const db = dbRes.data;

  // Mount privacy suppression placeholder (FR-39)
  if (db.isSuppressed) {
    return (
      <div className="space-y-6 select-none font-sans text-left">
        <CommanderHeader
          selectedUnit={selectedUnit}
          selectedPeriod={selectedPeriod}
          updatedAt={db.dataUpdatedAt}
          onChangeUnit={setSelectedUnit}
          onChangePeriod={setSelectedPeriod}
        />
        <PrivacySuppressedState />
      </div>
    );
  }

  // Find elevated risk percentage
  const elevatedHighCount = db.riskDistribution.elevated + db.riskDistribution.high;

  return (
    <div className="space-y-6 select-none font-sans text-left animate-fadeIn">
      {/* Header */}
      <CommanderHeader
        selectedUnit={selectedUnit}
        selectedPeriod={selectedPeriod}
        updatedAt={db.dataUpdatedAt}
        onChangeUnit={setSelectedUnit}
        onChangePeriod={setSelectedPeriod}
      />

      {/* Metrics widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <CommanderMetricCard
          title="Personnel In Scope"
          value={db.personnelInScope}
          description="Total active personnel members tracked under authorization rules."
        />
        <CommanderMetricCard
          title="Elevated/High signals"
          value={`${elevatedHighCount} personnel`}
          description="Aggregate headcount identified above normal welfare baselines."
        />
        <CommanderMetricCard
          title="Welfare Trend"
          value={db.riskTrend.direction.replace(/_/g, ' ')}
          description="Calculated change in risk distributions over this range."
          trend={{
            direction: db.riskTrend.direction === 'INCREASING' ? 'UP' : db.riskTrend.direction === 'IMPROVING' ? 'DOWN' : 'STABLE',
            label: 'Risk trend direction'
          }}
        />
        <CommanderMetricCard
          title="Workload Pressure"
          value={db.workloadSummary.dutyHours?.direction === 'INCREASING' ? 'Increasing' : 'Stable'}
          description="Average weekly duty hours shift rate."
        />
      </div>

      {/* Core analytics columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AggregateRiskDistribution distribution={db.riskDistribution} />
          <AggregateRiskTrendChart points={db.riskTrend.points} direction={db.riskTrend.direction} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider pb-2">Unit Notifications</h3>
            <CommanderAlertList alerts={db.alerts} />
          </div>
          <PressurePointList points={db.pressurePoints} />
        </div>
      </div>

      {/* Comparisons section */}
      {!isUnitsLoading && comparisonUnits && (
        <UnitComparisonTable
          units={comparisonUnits}
          onViewUnit={(unitId) => navigate(`/commander/unit/${unitId}`)}
        />
      )}
    </div>
  );
};
export default CommanderDashboardPage;
