import React from 'react';
import WelfareAlertCard from './WelfareAlertCard';
import type { WelfareAlert } from '@/services/caseService';
import EmptyState from '../ui/EmptyState';

interface Props {
  alerts: WelfareAlert[];
  onReview: (caseId: string) => void;
}

export const AlertList: React.FC<Props> = ({ alerts, onReview }) => {
  if (alerts.length === 0) {
    return (
      <EmptyState
        title="No alerts"
        description="No new welfare alerts. We'll show new signals here when they require review."
        className="bg-surface border border-border"
      />
    );
  }

  return (
    <div className="space-y-4 font-sans">
      {alerts.map((alert) => (
        <WelfareAlertCard key={alert.id} alert={alert} onReview={onReview} />
      ))}
    </div>
  );
};
export default AlertList;
