import React from 'react';
import { useAuthStore } from '@/store/authStore';

interface Props {
  scope: string;
}

export const OfficerDashboardHeader: React.FC<Props> = ({ scope }) => {
  const user = useAuthStore((state) => state.user);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none border-b border-border pb-4 mb-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-textPrimary leading-tight">Welfare Overview</h1>
        <p className="text-sm font-semibold text-textSecondary">
          {getGreeting()}, {user?.displayName}
        </p>
      </div>

      <div className="text-right sm:space-y-1">
        <div className="text-xs text-textMuted font-bold uppercase tracking-wider">
          Unit Scope: <span className="text-primary">{scope}</span>
        </div>
        <p className="text-[10px] text-textMuted">
          Last assessment: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};
export default OfficerDashboardHeader;
