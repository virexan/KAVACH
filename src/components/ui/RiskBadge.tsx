import React from 'react';
import type { RiskLevel } from '@/theme/tokens';

export interface RiskBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  level: RiskLevel;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className = '', ...props }) => {
  const styles = {
    LOW: 'bg-riskLow/10 text-riskLow border-riskLow/20',
    MODERATE: 'bg-riskModerate/10 text-riskModerate border-riskModerate/20',
    ELEVATED: 'bg-riskElevated/10 text-riskElevated border-riskElevated/20',
    HIGH: 'bg-riskHigh/10 text-riskHigh border-riskHigh/20',
  };

  const label = level.charAt(0) + level.slice(1).toLowerCase();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border select-none ${styles[level]} ${className}`}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current" />
      {label}
    </span>
  );
};
export default RiskBadge;
