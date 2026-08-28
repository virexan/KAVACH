import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import commanderService from '@/services/commanderService';
import AggregateRiskTrendChart from '@/components/commander/AggregateRiskTrendChart';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';

export const CommanderTrendsPage: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState('UNIT-7');

  const { data: dbRes, isLoading } = useQuery({
    queryKey: ['commander-trends', selectedUnit],
    queryFn: () => commanderService.getDashboard(selectedUnit),
  });

  const unitOptions = [
    { label: 'Unit 1 (Active Support)', value: 'UNIT-1' },
    { label: 'Unit 2 (Tactical Logistics)', value: 'UNIT-2' },
    { label: 'Unit 4 (Engineering Base)', value: 'UNIT-4' },
    { label: 'Unit 7 (Tactical Operations)', value: 'UNIT-7' }
  ];

  return (
    <div className="space-y-6 select-none font-sans text-left animate-fadeIn">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">Welfare Risk Trends</h1>
        <p className="text-xs text-textMuted mt-0.5">Historical aggregate movement rates across subunits.</p>
      </div>

      <div className="max-w-xs select-none">
        <Select
          label="Select Unit Scope"
          options={unitOptions}
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
        />
      </div>

      {isLoading ? (
        <Skeleton variant="block" className="h-48 w-full" />
      ) : dbRes ? (
        <div className="space-y-6">
          <AggregateRiskTrendChart
            points={dbRes.data.riskTrend.points}
            direction={dbRes.data.riskTrend.direction}
          />

          {/* Workload vs Welfare Correlation Insight (FR-28) */}
          <Card className="bg-surface p-5 border border-border space-y-3">
            <h3 className="font-bold text-textPrimary text-sm">Workload vs Welfare Trend Analysis</h3>
            <p className="text-xs text-textSecondary leading-relaxed">
              Both weekly workload hours and aggregate welfare risk signals display correlation over this reporting cycle.
            </p>
            <div className="bg-surfaceAlt/60 border border-border p-3 rounded text-[10px] text-textMuted leading-relaxed select-none">
              ℹ️ <strong>Correlation Disclaimer (FR-28):</strong> Association does not imply causation. The engine maps alignment across duty loads and voluntary logs to support command triage.
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
};
export default CommanderTrendsPage;
