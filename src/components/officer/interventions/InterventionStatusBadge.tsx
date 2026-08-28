import React from 'react';
import type { FollowUpStatus } from '@/services/interventionService';

interface Props {
  status: FollowUpStatus;
}

export const InterventionStatusBadge: React.FC<Props> = ({ status }) => {
  const getStyles = (st: string) => {
    switch (st) {
      case 'SCHEDULED':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'DUE':
        return 'bg-danger/10 text-danger border-danger/20';
      case 'IN_PROGRESS':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'COMPLETED':
        return 'bg-success/10 text-success border-success/20';
      case 'CANCELLED':
        return 'bg-surfaceAlt text-textMuted border-border';
      default:
        return 'bg-surfaceAlt text-textSecondary border-border';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider select-none ${getStyles(status)} font-sans`}>
      {status}
    </span>
  );
};
export default InterventionStatusBadge;
