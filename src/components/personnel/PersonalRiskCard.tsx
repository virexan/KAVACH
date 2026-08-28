import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import RiskBadge from '../ui/RiskBadge';
import type { RiskLevel } from '@/theme/tokens';

interface RiskCardProps {
  level: RiskLevel;
  trend: 'IMPROVING' | 'STABLE' | 'INCREASING' | 'INSUFFICIENT_DATA';
}

export const PersonalRiskCard: React.FC<RiskCardProps> = ({ level, trend }) => {
  const navigate = useNavigate();

  const getTrendLabel = (t: string) => {
    if (t === 'IMPROVING') return 'Improving ↑';
    if (t === 'INCREASING') return 'Increasing ↓';
    if (t === 'STABLE') return 'Stable →';
    return 'Insufficient data';
  };

  return (
    <Card className="bg-surface flex flex-col justify-between h-full">
      <div className="space-y-4 select-none">
        <h3 className="font-bold text-textPrimary text-base">Your Welfare Overview</h3>
        
        <div className="flex justify-between items-center py-2 border-b border-border/40">
          <span className="text-sm text-textSecondary font-semibold">Current status</span>
          <RiskBadge level={level} />
        </div>

        <div className="flex justify-between items-center py-2 border-b border-border/40">
          <span className="text-sm text-textSecondary font-semibold">Trend</span>
          <span className="text-sm text-textPrimary font-bold">{getTrendLabel(trend)}</span>
        </div>
        
        <p className="text-xs text-textMuted leading-relaxed">
          Based on recent workload and voluntary wellbeing signals.
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-border/60">
        <Button variant="secondary" size="sm" className="w-full" onClick={() => navigate('/personnel/risk')}>
          Understand More
        </Button>
      </div>
    </Card>
  );
};
export default PersonalRiskCard;
