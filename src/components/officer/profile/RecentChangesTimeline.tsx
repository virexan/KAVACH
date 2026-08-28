import React from 'react';
import Card from '../../ui/Card';
import type { RiskEvent } from '@/services/caseService';

interface Props {
  events: RiskEvent[];
}

export const RecentChangesTimeline: React.FC<Props> = ({ events }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'RISK_CHANGE': return '⚠️';
      case 'WORKLOAD_CHANGE': return '📊';
      case 'WELLNESS_CHANGE': return '💤';
      case 'DEPLOYMENT_CHANGE': return '🗺️';
      case 'OFFICER_ACTION': return '👮';
      default: return '⚙️';
    }
  };

  if (!events || events.length === 0) {
    return (
      <Card className="p-5 select-none text-left bg-surface border border-border font-sans">
        <h4 className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Recent Changes</h4>
        <p className="text-xs text-textMuted">No recent updates logged.</p>
      </Card>
    );
  }

  return (
    <Card className="p-5 select-none text-left bg-surface border border-border font-sans">
      <h3 className="font-bold text-textPrimary text-sm border-b border-border pb-2 mb-4 uppercase tracking-wide">
        Recent Changes (Event Timeline)
      </h3>

      <div className="relative border-l-2 border-border ml-3 pl-6 space-y-5 py-2">
        {events.map((ev) => (
          <div key={ev.id} className="relative animate-fadeIn">
            <span className="absolute -left-[35px] top-0.5 w-5 h-5 bg-surface border border-border rounded-full flex items-center justify-center text-xs select-none">
              {getIcon(ev.type)}
            </span>
            <div className="space-y-1">
              <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider block">
                {new Date(ev.timestamp).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
              </span>
              <h4 className="text-xs font-bold text-textPrimary leading-tight">
                {ev.title}
              </h4>
              {ev.description && (
                <p className="text-xs text-textSecondary leading-normal">
                  {ev.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
export default RecentChangesTimeline;
