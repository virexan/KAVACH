import React from 'react';
import Card from '../ui/Card';
import type { RiskDistribution } from '@/services/commanderService';

interface Props {
  distribution: RiskDistribution;
}

export const AggregateRiskDistribution: React.FC<Props> = ({ distribution }) => {
  const { low, moderate, elevated, high, insufficient } = distribution;
  const total = low + moderate + elevated + high + insufficient;

  const getPercent = (count: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  const items = [
    { label: 'High Risk', count: high, percent: getPercent(high), color: 'bg-danger', text: 'text-danger' },
    { label: 'Elevated Risk', count: elevated, percent: getPercent(elevated), color: 'bg-warning', text: 'text-warning' },
    { label: 'Moderate Risk', count: moderate, percent: getPercent(moderate), color: 'bg-primary', text: 'text-primary' },
    { label: 'Low Risk', count: low, percent: getPercent(low), color: 'bg-success', text: 'text-success' },
    { label: 'Insufficient Data', count: insufficient, percent: getPercent(insufficient), color: 'bg-surfaceAlt border border-border', text: 'text-textMuted' }
  ];

  return (
    <Card className="bg-surface border border-border p-5 font-sans select-none text-left space-y-4 animate-fadeIn">
      <div>
        <h3 className="font-bold text-textPrimary text-base">Unit Welfare Risk</h3>
        <p className="text-[10px] text-textMuted uppercase font-bold tracking-wide">Aggregate headcounts & proportions (FR-12)</p>
      </div>

      {/* Stacked aggregate bar representation */}
      <div className="h-4 w-full flex rounded-full overflow-hidden bg-surfaceAlt select-none">
        {items.map((item) => (
          item.count > 0 && (
            <div
              key={item.label}
              style={{ width: `${item.percent}%` }}
              className={`${item.color} h-full transition-all duration-500`}
              title={`${item.label}: ${item.count} (${item.percent}%)`}
            />
          )
        ))}
      </div>

      {/* Numeric Detail list */}
      <div className="space-y-2.5 pt-2 border-t border-border/40 text-xs">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between items-center select-none">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="font-semibold text-textSecondary">{item.label}</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-textPrimary">{item.count}</span>
              <span className="text-textMuted text-[10px] font-semibold">({item.percent}%)</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
export default AggregateRiskDistribution;
