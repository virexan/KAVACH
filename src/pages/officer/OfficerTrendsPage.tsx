import React from 'react';
import Card from '@/components/ui/Card';

export const OfficerTrendsPage: React.FC = () => {
  return (
    <div className="space-y-6 select-none max-w-3xl mx-auto font-sans">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">Aggregate Risk Trends</h1>
        <p className="text-xs text-textMuted mt-0.5">Visualize risk and workload distribution shifts across authorized units.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
        <Card className="bg-surface p-5 space-y-4">
          <h3 className="font-bold text-textPrimary text-sm border-b border-border pb-2 uppercase tracking-wide">
            Unit Workload Pressures
          </h3>
          <p className="text-xs text-textSecondary leading-relaxed">
            Unit 7 shows elevated workload pressures (+18% workload index) over the last 14 days, matching active field drills. Unit 9 reports stable workload indices.
          </p>
          <div className="w-full bg-border h-2 rounded-full overflow-hidden">
            <div className="h-full bg-warning rounded-full" style={{ width: '78%' }} />
          </div>
          <span className="text-[10px] text-textMuted block font-bold">Average workload pressure index: 78%</span>
        </Card>

        <Card className="bg-surface p-5 space-y-4">
          <h3 className="font-bold text-textPrimary text-sm border-b border-border pb-2 uppercase tracking-wide">
            Improving Cases Ratio
          </h3>
          <p className="text-xs text-textSecondary leading-relaxed">
            Approximately 64% of flagged cases have shifted towards stabilizing or improving trends following scheduled rest leaves.
          </p>
          <div className="w-full bg-border h-2 rounded-full overflow-hidden">
            <div className="h-full bg-success rounded-full" style={{ width: '64%' }} />
          </div>
          <span className="text-[10px] text-textMuted block font-bold">Case improvement ratio: 64%</span>
        </Card>
      </div>
    </div>
  );
};
export default OfficerTrendsPage;
