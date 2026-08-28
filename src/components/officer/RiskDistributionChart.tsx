import React from 'react';
import Card from '../ui/Card';
import type { RiskDistribution } from '@/services/officerService';

interface Props {
  distribution: RiskDistribution;
}

export const RiskDistributionChart: React.FC<Props> = ({ distribution }) => {
  const total = 
    distribution.low + 
    distribution.moderate + 
    distribution.elevated + 
    distribution.high + 
    distribution.insufficientData;

  const items = [
    { label: 'Low Risk', count: distribution.low, color: 'bg-primary' },
    { label: 'Moderate Risk', count: distribution.moderate, color: 'bg-warning' },
    { label: 'Elevated Risk', count: distribution.elevated, color: 'bg-orange-500' },
    { label: 'High Risk', count: distribution.high, color: 'bg-danger' },
    { label: 'Insufficient Data', count: distribution.insufficientData, color: 'bg-textMuted' },
  ];

  return (
    <Card className="bg-surface p-5 select-none space-y-4">
      <div>
        <h3 className="font-bold text-textPrimary text-base">Risk Distribution</h3>
        <p className="text-xs text-textMuted mt-0.5">Summary of risk statuses for authorized scope.</p>
      </div>

      <div className="space-y-3 pt-2">
        {items.map((item) => {
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-textSecondary">{item.label}</span>
                <span className="font-bold text-textPrimary">
                  {item.count} ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
export default RiskDistributionChart;
