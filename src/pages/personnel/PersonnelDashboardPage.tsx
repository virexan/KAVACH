import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import wellnessService from '@/services/wellnessService';
import riskService from '@/services/riskService';
import DailyCheckInCard from '@/components/personnel/DailyCheckInCard';
import WellnessSnapshot from '@/components/personnel/WellnessSnapshot';
import WellnessTrendCard from '@/components/personnel/WellnessTrendCard';
import PersonalRiskCard from '@/components/personnel/PersonalRiskCard';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

export const PersonnelDashboardPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  const { data: summaryRes, isLoading: isSummaryLoading, isError: isSummaryError, refetch: refetchSummary } = useQuery({
    queryKey: ['wellness-summary'],
    queryFn: () => wellnessService.getSummary(),
  });

  const { data: riskRes, isLoading: isRiskLoading, isError: isRiskError, refetch: refetchRisk } = useQuery({
    queryKey: ['personal-risk'],
    queryFn: () => riskService.getPersonalRisk(),
  });

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleRetry = () => {
    refetchSummary();
    refetchRisk();
  };

  if (isSummaryLoading || isRiskLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="line" className="h-8 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton variant="card" className="h-48" />
          <Skeleton variant="card" className="h-48" />
          <Skeleton variant="card" className="h-48" />
          <Skeleton variant="card" className="h-48" />
        </div>
      </div>
    );
  }

  if (isSummaryError || isRiskError) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <ErrorState
          title="Failed to Load Dashboard"
          description="We couldn't retrieve your latest wellbeing parameters. Please verify connectivity and try again."
          retryLabel="Try Again"
          onRetry={handleRetry}
          className="max-w-md shadow-panel bg-surface border border-border"
        />
      </div>
    );
  }

  const summary = summaryRes?.data;
  const risk = riskRes?.data;

  const isCompletedToday = !!summary?.latestCheckIn && 
    new Date(summary.latestCheckIn.submittedAt).toDateString() === new Date().toDateString();

  return (
    <div className="space-y-6 select-none">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-textPrimary leading-tight">
          {getGreeting()}, {user?.displayName}
        </h1>
        <p className="text-xs text-textMuted font-medium uppercase tracking-wide">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <DailyCheckInCard completed={isCompletedToday} />
        </div>
        <div className="lg:col-span-1">
          <WellnessTrendCard trend={summary?.currentTrend || 'Stable'} />
        </div>
        <div className="lg:col-span-1">
          {risk ? (
            <PersonalRiskCard level={risk.level} trend={risk.trend} />
          ) : (
            <div className="h-full border border-border rounded-lg bg-surface flex flex-col justify-center items-center p-6 text-center">
              <span className="text-xs text-textMuted font-bold uppercase">Insufficient Signals</span>
              <p className="text-xs text-textSecondary mt-2">Complete a few daily check-ins to build patterns.</p>
            </div>
          )}
        </div>
      </div>

      {summary?.metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WellnessSnapshot metrics={summary.metrics} />
          </div>
          <div className="lg:col-span-1 border border-border/40 bg-surfaceAlt/10 rounded-lg p-5 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="font-bold text-textPrimary text-sm uppercase tracking-wider text-[10px]">
                Support Notice
              </h4>
              <p className="text-xs text-textSecondary leading-relaxed">
                Your entries are voluntary and secure. Your detailed answers are private to your welfare log and are never visible to operational command paths.
              </p>
            </div>
            <div className="text-[10px] text-textMuted leading-normal pt-4 border-t border-border/40 mt-4">
              AI insights are used to suggest wellness resources and prevent chronic operational fatigue.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PersonnelDashboardPage;
