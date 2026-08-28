import React from 'react';
import type { RiskLevel } from '@/theme/tokens';

interface Props {
  level: RiskLevel | 'INSUFFICIENT_DATA';
  className?: string;
}

export const RiskLevelBadge: React.FC<Props> = ({ level, className = '' }) => {
  const getStyles = (lvl: string) => {
    switch (lvl) {
      case 'LOW':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'MODERATE':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'ELEVATED':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'HIGH':
        return 'bg-danger/10 text-danger border-danger/20';
      default:
        return 'bg-surfaceAlt text-textSecondary border-border';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border uppercase select-none tracking-wide ${getStyles(level)} ${className}`}>
      {level.replace('_', ' ')}
    </span>
  );
};
export default RiskLevelBadge;
