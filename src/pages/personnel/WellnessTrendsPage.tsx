import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import wellnessService from '@/services/wellnessService';
import TrendChart from '@/components/personnel/TrendChart';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

export const WellnessTrendsPage: React.FC = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  const { data: trendRes, isLoading, isError } = useQuery({
    queryKey: ['wellness-trends', period],
    queryFn: () => wellnessService.getTrends(period),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="line" className="h-8 w-1/4" />
        <Skeleton variant="block" className="h-64 w-full" />
      </div>
    );
  }

  const data = trendRes?.data || [];

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-textPrimary leading-tight">Wellness Trends</h1>
          <p className="text-xs text-textMuted mt-0.5">Visualize your wellbeing indicators changing over time.</p>
        </div>

        {/* Period Selector Tabs (FR-37) */}
        <div className="flex bg-surfaceAlt/85 border border-border p-1 rounded-lg">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors focus:outline-none ${
                period === p
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-textSecondary hover:bg-surfaceAlt'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {isError ? (
        <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-semibold p-4 rounded-md text-center">
          Failed to load trend data. Please retry.
        </div>
      ) : data.length < 2 ? (
        <EmptyState
          title="No trend data"
          description="More check-ins are needed to show a meaningful trend."
          actionLabel="Complete Today's Check-In"
          onAction={() => navigate('/personnel/check-in')}
          className="bg-surface border border-border"
        />
      ) : (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Chart */}
          <TrendChart data={data} />

          {/* Supportive Explanation Box */}
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 text-xs text-textSecondary leading-relaxed space-y-1.5">
            <h4 className="font-bold text-primary text-[10px] uppercase tracking-wider">How to read this chart</h4>
            <p>
              This line represents your daily scores. Steady horizontal lines represent stable indicators. Downward slopes in stress indicate relaxation, whereas upward slopes in sleep indicate better quality rest.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default WellnessTrendsPage;
