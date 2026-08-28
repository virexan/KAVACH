import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import type { PersonalRecommendation } from '@/services/recommendationService';

interface RecommendationCardProps {
  recommendation: PersonalRecommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'REST':
        return 'info';
      case 'LEAVE':
        return 'success';
      case 'SUPPORT':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="bg-surface p-5 space-y-4">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <Badge variant={getCategoryStyles(recommendation.category)} className="text-[10px] font-bold py-0.5 select-none uppercase tracking-wide">
            {recommendation.category}
          </Badge>
          <h4 className="font-bold text-textPrimary text-base leading-tight select-none">
            {recommendation.title}
          </h4>
        </div>
        {recommendation.priority === 'HIGH' && (
          <span className="bg-danger/10 text-danger text-[10px] font-black uppercase px-2 py-0.5 rounded select-none border border-danger/10">
            High Priority
          </span>
        )}
      </div>

      <p className={`text-sm text-textSecondary leading-relaxed ${isExpanded ? '' : 'line-clamp-2'} select-none`}>
        {recommendation.description}
      </p>

      <div className="pt-2 flex justify-end">
        <Button variant="secondary" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Hide Details' : 'View Suggestion'}
        </Button>
      </div>
    </Card>
  );
};
export default RecommendationCard;
