import React from 'react';
import type { RecommendationStatus } from '@/services/recommendationService';

interface Props {
  status: RecommendationStatus;
}

export const RecommendationStatusBadge: React.FC<Props> = ({ status }) => {
  const getStyles = (st: string) => {
    switch (st) {
      case 'NEW':
        return 'bg-info/10 text-info border-info/20';
      case 'ACCEPTED':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'DISMISSED':
        return 'bg-surfaceAlt text-textSecondary border-border';
      case 'COMPLETED':
        return 'bg-success/10 text-success border-success/20';
      case 'EXPIRED':
        return 'bg-danger/10 text-danger border-danger/20';
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
export default RecommendationStatusBadge;
