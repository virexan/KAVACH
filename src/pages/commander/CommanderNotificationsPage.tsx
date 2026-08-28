import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import commanderService from '@/services/commanderService';
import CommanderAlertList from '@/components/commander/CommanderAlertList';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';

export const CommanderNotificationsPage: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState('UNIT-7');

  const { data: alertsRes, isLoading } = useQuery({
    queryKey: ['commander-alerts-page', selectedUnit],
    queryFn: () => commanderService.getAlerts(selectedUnit),
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
        <h1 className="text-xl font-black text-textPrimary leading-tight">System Alerts Log</h1>
        <p className="text-xs text-textMuted mt-0.5">Audit stream of aggregate risk trend shifts and workload alarms.</p>
      </div>

      <div className="max-w-xs select-none">
        <Select
          label="Filter Unit Scope"
          options={unitOptions}
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
        />
      </div>

      {isLoading ? (
        <Skeleton variant="block" className="h-28 w-full" />
      ) : alertsRes ? (
        <CommanderAlertList alerts={alertsRes.data} />
      ) : null}
    </div>
  );
};
export default CommanderNotificationsPage;
