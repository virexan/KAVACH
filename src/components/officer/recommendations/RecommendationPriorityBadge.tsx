import React from 'react';
import type { RecommendationPriority } from '@/services/recommendationService';

interface Props {
  priority: RecommendationPriority;
}

export const RecommendationPriorityBadge: React.FC<Props> = ({ priority }) => {
  const getStyles = (pr: string) => {
    switch (pr) {
      case 'HIGH':
        return 'bg-danger/10 text-danger border-danger/20';
      case 'MEDIUM':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider select-none ${getStyles(priority)} font-sans`}>
      {priority}
    </span>
  );
};
export default RecommendationPriorityBadge;
