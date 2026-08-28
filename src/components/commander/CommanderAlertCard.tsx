import React from 'react';
import Card from '../ui/Card';
import type { CommanderAlert } from '@/services/commanderService';

interface Props {
  alert: CommanderAlert;
}

export const CommanderAlertCard: React.FC<Props> = ({ alert }) => {
  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case 'RISK_TREND':
        return 'text-danger border-danger/20 bg-danger/10';
      case 'WORKLOAD_CHANGE':
        return 'text-warning border-warning/20 bg-warning/10';
      default:
        return 'text-primary border-primary/20 bg-primary/10';
    }
  };

  return (
    <Card className="p-4 bg-surface border border-border flex items-start gap-3 select-none font-sans text-left animate-fadeIn">
      <span className="text-lg">📢</span>
      <div className="space-y-1">
        <div className="flex gap-2 items-center">
          <h4 className="font-bold text-textPrimary text-xs leading-none">{alert.title}</h4>
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider ${getCategoryStyles(alert.category)}`}>
            {alert.category.replace(/_/g, ' ')}
          </span>
        </div>
        <p className="text-[11px] text-textSecondary leading-relaxed">{alert.description}</p>
        <span className="text-[9px] text-textMuted font-bold block pt-1">
          {new Date(alert.generatedAt).toLocaleDateString()}
        </span>
      </div>
    </Card>
  );
};
export default CommanderAlertCard;
