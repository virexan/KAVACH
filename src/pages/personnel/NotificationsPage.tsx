import React from 'react';
import { useQuery } from '@tanstack/react-query';
import notificationService from '@/services/notificationService';
import Skeleton from '@/components/ui/Skeleton';
import Card from '@/components/ui/Card';

export const NotificationsPage: React.FC = () => {
  const { data: notifRes, isLoading, isError } = useQuery({
    queryKey: ['personal-notifications'],
    queryFn: () => notificationService.getNotifications(),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="line" className="h-8 w-1/4" />
        <Skeleton variant="card" className="h-20 w-full" />
        <Skeleton variant="card" className="h-20 w-full" />
      </div>
    );
  }

  const list = notifRes?.data || [];

  const getIcon = (type: string) => {
    switch (type) {
      case 'REMINDER':
        return '⏰';
      case 'ALERT':
        return '💡';
      case 'UPDATE':
        return '⚙️';
      default:
        return '✉️';
    }
  };

  return (
    <div className="space-y-6 select-none max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">Notifications</h1>
        <p className="text-xs text-textMuted mt-0.5">Stay updated on check-in reminders and wellbeing alerts.</p>
      </div>

      {isError ? (
        <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-semibold p-4 rounded-md text-center">
          Failed to load notifications. Please retry.
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-12 text-xs text-textMuted border border-dashed border-border rounded-lg bg-surface">
          No notifications right now.
        </div>
      ) : (
        <div className="space-y-3 animate-fadeIn">
          {list.map((n) => (
            <Card key={n.id} className="bg-surface p-4 flex gap-4 items-start select-none">
              <span className="text-xl p-2 bg-surfaceAlt/80 border border-border rounded-lg flex-shrink-0">
                {getIcon(n.type)}
              </span>
              <div className="space-y-1.5 flex-1">
                <div className="flex justify-between items-start gap-3">
                  <h4 className={`text-sm font-bold leading-tight ${n.read ? 'text-textSecondary' : 'text-textPrimary'}`}>
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-textMuted font-bold">
                    {new Date(n.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-textSecondary leading-relaxed">{n.message}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default NotificationsPage;
