import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { CommanderRecommendation } from '@/services/commanderService';

interface Props {
  recommendation: CommanderRecommendation;
  onViewDetails: (rec: CommanderRecommendation) => void;
}

export const CommanderRecommendationCard: React.FC<Props> = ({ recommendation, onViewDetails }) => {
  const getPriorityStyle = (pr: string) => {
    if (pr === 'HIGH') return 'bg-danger/10 text-danger border-danger/20';
    if (pr === 'MEDIUM') return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-primary/10 text-primary border-primary/20';
  };

  return (
    <Card className="bg-surface p-5 border border-border/80 space-y-4 select-none text-left font-sans animate-fadeIn">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="flex gap-2 items-center flex-wrap">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getPriorityStyle(recommendation.priority)}`}>
              {recommendation.priority} Attention
            </span>
            <span className="bg-surfaceAlt text-textSecondary border border-border inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              {recommendation.status}
            </span>
          </div>
          <h4 className="font-bold text-textPrimary text-base leading-tight select-none pt-1">
            {recommendation.title}
          </h4>
        </div>
      </div>

      <p className="text-xs text-textSecondary leading-relaxed line-clamp-2">
        {recommendation.rationale}
      </p>

      <div className="pt-2 border-t border-border/40 flex justify-between items-center text-[10px] text-textMuted font-bold uppercase">
        <span>Category: {recommendation.category.replace(/_/g, ' ')}</span>
        <Button variant="secondary" size="sm" onClick={() => onViewDetails(recommendation)}>
          View details
        </Button>
      </div>
    </Card>
  );
};
export default CommanderRecommendationCard;
