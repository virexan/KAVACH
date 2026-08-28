import React from 'react';
import Card from '../ui/Card';

interface Props {
  title: string;
  value: string | number;
  description: string;
  trend?: {
    direction: 'UP' | 'DOWN' | 'STABLE';
    label: string;
  };
}

export const CommanderMetricCard: React.FC<Props> = ({ title, value, description, trend }) => {
  const getTrendColor = (dir: string) => {
    if (dir === 'UP') return 'text-danger';
    if (dir === 'DOWN') return 'text-success';
    return 'text-textSecondary';
  };

  return (
    <Card className="bg-surface border border-border p-4 font-sans select-none text-left flex flex-col justify-between min-h-[110px] animate-fadeIn">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-textPrimary leading-none">{value}</span>
          {trend && (
            <span className={`text-[10px] font-bold ${getTrendColor(trend.direction)}`}>
              {trend.direction === 'UP' && '↑'}
              {trend.direction === 'DOWN' && '↓'}
              {trend.direction === 'STABLE' && '→'} {trend.label}
            </span>
          )}
        </div>
      </div>
      <p className="text-[10px] text-textSecondary font-medium pt-2 border-t border-border/40 leading-relaxed mt-2">
        {description}
      </p>
    </Card>
  );
};
export default CommanderMetricCard;
