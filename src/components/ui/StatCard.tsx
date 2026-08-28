import React from 'react';
import Card from './Card';
import Skeleton from './Skeleton';
import RiskBadge from './RiskBadge';
import type { RiskLevel } from '@/theme/tokens';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  riskLevel?: RiskLevel;
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  riskLevel,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card className="flex flex-col gap-2">
        <Skeleton variant="line" className="w-1/3 h-4" />
        <Skeleton variant="line" className="w-1/2 h-8" />
        <Skeleton variant="line" className="w-1/4 h-3" />
      </Card>
    );
  }

  const getTrendColor = (dir: 'up' | 'down' | 'neutral') => {
    if (dir === 'up') return 'text-success bg-success/10 border-success/20';
    if (dir === 'down') return 'text-danger bg-danger/10 border-danger/20';
    return 'text-textSecondary bg-surfaceAlt border-border';
  };

  return (
    <Card className="relative overflow-hidden">
      {riskLevel && (
        <div
          className="absolute top-0 left-0 bottom-0 w-1"
          style={{
            backgroundColor: `var(--color-risk-${riskLevel.toLowerCase()})`,
          }}
        />
      )}
      
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-textMuted select-none uppercase tracking-wider">
            {title}
          </span>
          <span className="text-2xl font-bold text-textPrimary tracking-tight">
            {value}
          </span>
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-surfaceAlt flex items-center justify-center text-textSecondary flex-shrink-0">
            {icon}
          </div>
        )}
      </div>

      {(trend || riskLevel) && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-border/60">
          {trend && (
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border ${getTrendColor(trend.direction)}`}>
              {trend.direction === 'up' && '↑ '}
              {trend.direction === 'down' && '↓ '}
              {trend.value}
              {trend.label && <span className="ml-1 text-textMuted font-medium">{trend.label}</span>}
            </span>
          )}
          {riskLevel && <RiskBadge level={riskLevel} />}
        </div>
      )}
    </Card>
  );
};
export default StatCard;
