import React from 'react';
import Card from '../ui/Card';
import WorkloadMetric from './WorkloadMetric';
import type { AggregateWorkloadSummary } from '@/services/commanderService';

interface Props {
  summary: AggregateWorkloadSummary;
}

export const WorkloadOverview: React.FC<Props> = ({ summary }) => {
  return (
    <Card className="bg-surface border border-border p-5 font-sans select-none text-left space-y-4 animate-fadeIn">
      <div>
        <h3 className="font-bold text-textPrimary text-base">Workload & Deployment Overview</h3>
        <p className="text-[10px] text-textMuted uppercase font-bold tracking-wide">Aggregate operational stressors (FR-15)</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <WorkloadMetric label="Duty Hours" metric={summary.dutyHours} />
        <WorkloadMetric label="Deployment Load" metric={summary.deployment} />
        <WorkloadMetric label="Training Load" metric={summary.trainingLoad} />
        <WorkloadMetric label="Leave Utilization" metric={summary.leaveUtilization} />
      </div>
    </Card>
  );
};
export default WorkloadOverview;
