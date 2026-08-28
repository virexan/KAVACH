import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { WelfareAlert } from '@/services/caseService';

interface Props {
  alert: WelfareAlert;
  onReview: (caseId: string) => void;
}

export const WelfareAlertCard: React.FC<Props> = ({ alert, onReview }) => {
  const getIcon = (type: string) => {
    if (type === 'RISK_INCREASE' || type === 'NEW_RISK') return '⚠️';
    if (type === 'FOLLOW_UP_DUE') return '📅';
    return '🔔';
  };

  return (
    <Card className="bg-surface p-4 flex gap-4 items-start select-none border border-border/80 animate-fadeIn">
      <span className="text-xl p-2 bg-warning/10 border border-warning/20 rounded-lg flex-shrink-0 text-warning">
        {getIcon(alert.type)}
      </span>
      <div className="space-y-1.5 flex-1 font-sans">
        <div className="flex justify-between items-start gap-3">
          <h4 className="text-sm font-bold text-textPrimary leading-tight">
            {alert.title}
          </h4>
          <span className="text-[10px] text-textMuted font-bold">
            {new Date(alert.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-xs text-textSecondary leading-relaxed">{alert.description}</p>
        
        <div className="pt-2 flex justify-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onReview(alert.caseId)}
          >
            Review Case
          </Button>
        </div>
      </div>
    </Card>
  );
};
export default WelfareAlertCard;
