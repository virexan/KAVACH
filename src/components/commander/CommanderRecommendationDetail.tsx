import React, { useState } from 'react';
import Drawer from '../ui/Drawer';
import Button from '../ui/Button';
import type { CommanderRecommendation } from '@/services/commanderService';
import commanderService from '@/services/commanderService';

interface Props {
  recommendation: CommanderRecommendation | null;
  unitId: string;
  onClose: () => void;
  onUpdate: () => void;
}

export const CommanderRecommendationDetail: React.FC<Props> = ({
  recommendation,
  unitId,
  onClose,
  onUpdate
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!recommendation) return null;

  const handleAction = async (status: 'CONSIDERED' | 'DISMISSED') => {
    setIsLoading(true);
    try {
      await commanderService.acknowledgeRecommendation(unitId, recommendation.id, status);
      onUpdate();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer
      isOpen={!!recommendation}
      onClose={onClose}
      title="Organizational Consideration"
      placement="right"
      className="max-w-[420px] w-full"
    >
      <div className="space-y-6 select-none text-left font-sans animate-fadeIn">
        <div className="space-y-1">
          <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider block">
            Category: {recommendation.category.replace(/_/g, ' ')}
          </span>
          <h3 className="text-base font-bold text-textPrimary leading-tight">{recommendation.title}</h3>
        </div>

        <div className="space-y-2 border border-border rounded-md p-4 bg-surfaceAlt/10 text-xs">
          <div>
            <span className="text-[9px] font-bold text-textMuted uppercase block">Why this was suggested</span>
            <p className="text-textSecondary leading-relaxed pt-0.5 font-medium">{recommendation.rationale}</p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <span className="text-[9px] font-bold text-textMuted uppercase block">Suggested consideration</span>
          <p className="text-textSecondary leading-relaxed font-medium">
            Review whether current workload shifts or rosters can be balanced or adjusted where operationally feasible.
          </p>
        </div>

        {/* AI Disclaimer Warning (FR-68) */}
        <div className="bg-primary/5 border border-primary/10 rounded-md p-3.5 text-[10px] text-textSecondary leading-relaxed space-y-1">
          <h5 className="font-bold text-primary uppercase tracking-wide text-[8px]">
            AI-Assisted Insight (FR-68)
          </h5>
          <p>
            This insight is based on aggregated available welfare and workload signals.
          </p>
          <p className="font-bold text-textPrimary">
            It is intended to support organizational review and does not establish causation.
          </p>
        </div>

        {/* Action Controls (FR-32) */}
        {recommendation.status === 'NEW' && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
            <Button
              variant="primary"
              size="sm"
              className="font-bold"
              onClick={() => handleAction('CONSIDERED')}
              isLoading={isLoading}
            >
              Mark Considered
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="font-bold"
              onClick={() => handleAction('DISMISSED')}
              isLoading={isLoading}
            >
              Dismiss
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
};
export default CommanderRecommendationDetail;
