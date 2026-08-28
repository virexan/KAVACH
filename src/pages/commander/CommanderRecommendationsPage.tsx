import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import commanderService from '@/services/commanderService';
import type { CommanderRecommendation } from '@/services/commanderService';
import CommanderRecommendationCard from '@/components/commander/CommanderRecommendationCard';
import CommanderRecommendationDetail from '@/components/commander/CommanderRecommendationDetail';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

export const CommanderRecommendationsPage: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState('UNIT-7');
  const [status, setStatus] = useState('ALL');
  const [priority, setPriority] = useState('ALL');
  const [selectedRec, setSelectedRec] = useState<CommanderRecommendation | null>(null);

  const { data: recsRes, isLoading, isError, refetch } = useQuery({
    queryKey: ['commander-recommendations-list', selectedUnit, status, priority],
    queryFn: () => commanderService.getRecommendations({ unitId: selectedUnit, status, priority }),
  });

  const unitOptions = [
    { label: 'Unit 1 (Active Support)', value: 'UNIT-1' },
    { label: 'Unit 2 (Tactical Logistics)', value: 'UNIT-2' },
    { label: 'Unit 4 (Engineering Base)', value: 'UNIT-4' },
    { label: 'Unit 7 (Tactical Operations)', value: 'UNIT-7' }
  ];

  const statusOptions = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'New', value: 'NEW' },
    { label: 'Reviewed', value: 'REVIEWED' },
    { label: 'Considered', value: 'CONSIDERED' },
    { label: 'Dismissed', value: 'DISMISSED' }
  ];

  const priorityOptions = [
    { label: 'All Priorities', value: 'ALL' },
    { label: 'High', value: 'HIGH' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Low', value: 'LOW' }
  ];

  const list = recsRes?.data || [];

  return (
    <div className="space-y-6 select-none font-sans text-left animate-fadeIn">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">Organizational Recommendations</h1>
        <p className="text-xs text-textMuted mt-0.5">Aggregate AI-assisted considerations matching subunit stressors (FR-29).</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end bg-surface border border-border p-4 rounded-lg">
        <Select label="Filter Unit" options={unitOptions} value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)} />
        <Select label="Filter Status" options={statusOptions} value={status} onChange={(e) => setStatus(e.target.value)} />
        <Select label="Filter Priority" options={priorityOptions} value={priority} onChange={(e) => setPriority(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      ) : isError ? (
        <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-semibold p-4 rounded-md text-center font-sans">
          Recommendations temporarily unavailable. (FR-57)
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          title="No recommendations"
          description="There are currently no organizational actions requiring review."
          className="bg-surface border border-border font-sans"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
          {list.map((rec) => (
            <CommanderRecommendationCard
              key={rec.id}
              recommendation={rec}
              onViewDetails={setSelectedRec}
            />
          ))}
        </div>
      )}

      <CommanderRecommendationDetail
        recommendation={selectedRec}
        unitId={selectedUnit}
        onClose={() => setSelectedRec(null)}
        onUpdate={refetch}
      />
    </div>
  );
};
export default CommanderRecommendationsPage;
