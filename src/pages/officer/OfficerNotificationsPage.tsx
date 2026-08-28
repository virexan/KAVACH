import React from 'react';
import Card from '@/components/ui/Card';

export const OfficerNotificationsPage: React.FC = () => {
  const notifs = [
    { id: '1', title: 'System Scope Sync', text: 'Unit scope authorization verified. Unit 7 and Unit 9 metrics active.', date: 'Today, 08:30 AM' },
    { id: '2', title: 'Daily Aggregates Refreshed', text: 'Risk distribution calculations and trajectories updated from nightly checks.', date: 'Today, 04:00 AM' }
  ];

  return (
    <div className="space-y-6 select-none max-w-2xl mx-auto font-sans">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">System Logs</h1>
        <p className="text-xs text-textMuted mt-0.5">Welfare monitoring platform operational logs.</p>
      </div>

      <div className="space-y-3 animate-fadeIn">
        {notifs.map((n) => (
          <Card key={n.id} className="bg-surface p-4 flex gap-4 items-start border border-border/80">
            <span className="text-xl p-2 bg-surfaceAlt rounded-lg flex-shrink-0">⚙️</span>
            <div className="space-y-1.5 flex-1">
              <div className="flex justify-between items-start gap-3">
                <h4 className="text-sm font-bold text-textPrimary leading-tight">{n.title}</h4>
                <span className="text-[10px] text-textMuted font-bold">{n.date}</span>
              </div>
              <p className="text-xs text-textSecondary leading-relaxed">{n.text}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default OfficerNotificationsPage;
