import React from 'react';
import type { AggregateMetric } from '@/services/commanderService';

interface MetricProps {
  label: string;
  metric?: AggregateMetric;
}

export const WorkloadMetric: React.FC<MetricProps> = ({ label, metric }) => {
  if (!metric || metric.current === undefined) {
    return (
      <div className="p-4 border border-border rounded-lg bg-surfaceAlt/20 text-left font-sans select-none space-y-1">
        <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block">{label} (FR-19)</span>
        <span className="text-xs text-textSecondary font-bold block pt-1">Insufficient data</span>
      </div>
    );
  }

  const isUp = metric.direction === 'INCREASING';
  const isDown = metric.direction === 'DECREASING';
  const change = metric.changePercent !== undefined ? Math.abs(metric.changePercent) : 0;

  return (
    <div className="p-4 border border-border rounded-lg bg-surface text-left font-sans select-none space-y-2 animate-fadeIn">
      <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block">
        {label}
      </span>
      <div className="flex justify-between items-baseline gap-2 pt-0.5">
        <span className="text-lg font-black text-textPrimary leading-none">
          {metric.current} <span className="text-xs font-bold text-textSecondary">{metric.unit}</span>
        </span>
        {change > 0 && (
          <span className={`text-[10px] font-bold ${isUp ? 'text-danger' : isDown ? 'text-success' : 'text-textSecondary'}`}>
            {isUp && '↑'} {isDown && '↓'} {change}%
          </span>
        )}
      </div>
    </div>
  );
};
export default WorkloadMetric;
