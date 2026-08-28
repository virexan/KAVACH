import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import RecommendationStatusBadge from './RecommendationStatusBadge';
import RecommendationPriorityBadge from './RecommendationPriorityBadge';
import type { Recommendation } from '@/services/recommendationService';

interface Props {
  recommendation: Recommendation;
  onViewDetails: (rec: Recommendation) => void;
}

export const RecommendationCard: React.FC<Props> = ({ recommendation, onViewDetails }) => {
  return (
    <Card className="bg-surface p-5 border border-border/80 space-y-4 select-none text-left font-sans animate-fadeIn">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="flex gap-2 items-center flex-wrap">
            <RecommendationStatusBadge status={recommendation.status} />
            <RecommendationPriorityBadge priority={recommendation.priority} />
          </div>
          <h4 className="font-bold text-textPrimary text-base leading-tight select-none pt-1">
            {recommendation.title}
          </h4>
          <span className="text-[10px] text-textMuted font-bold block uppercase tracking-wider">
            Case: {recommendation.personnelDisplayId}
          </span>
        </div>
      </div>

      <p className="text-xs text-textSecondary leading-relaxed line-clamp-2">
        {recommendation.description}
      </p>

      <div className="pt-2 border-t border-border/40 flex justify-end">
        <Button variant="secondary" size="sm" onClick={() => onViewDetails(recommendation)}>
          View Details
        </Button>
      </div>
    </Card>
  );
};
export default RecommendationCard;
