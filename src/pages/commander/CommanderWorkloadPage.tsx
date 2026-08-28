import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import commanderService from '@/services/commanderService';
import WorkloadOverview from '@/components/commander/WorkloadOverview';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';

export const CommanderWorkloadPage: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState('UNIT-7');

  const { data: dbRes, isLoading } = useQuery({
    queryKey: ['commander-workload-page', selectedUnit],
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
        <h1 className="text-xl font-black text-textPrimary leading-tight">Workload Analytics</h1>
        <p className="text-xs text-textMuted mt-0.5">Duty hours, training indices, and deployment duration logs.</p>
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
          <WorkloadOverview summary={dbRes.data.workloadSummary} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4 bg-surface border border-border space-y-2">
              <h3 className="font-bold text-textPrimary text-sm">Deployment Load Details</h3>
              <p className="text-xs text-textSecondary leading-relaxed">
                Roster duration indicates Unit 7 is currently experiencing Elevated deployment pressures compared to local averages.
              </p>
            </Card>

            <Card className="p-4 bg-surface border border-border space-y-2">
              <h3 className="font-bold text-textPrimary text-sm">Leave Utilization Details</h3>
              <p className="text-xs text-textSecondary leading-relaxed">
                Roster overlaps resulted in a slight decline in leave consumption. Recommend reviewing balance.
              </p>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default CommanderWorkloadPage;
