import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import wellnessService from '@/services/wellnessService';
import WellnessHistoryTable from '@/components/personnel/WellnessHistoryTable';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';

export const WellnessHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: historyRes, isLoading, isError, refetch } = useQuery({
    queryKey: ['wellness-history', page],
    queryFn: () => wellnessService.getHistory(page, pageSize),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="line" className="h-8 w-1/3" />
        <Skeleton variant="block" className="h-40 w-full" />
      </div>
    );
  }

  const logs = historyRes?.data || [];
  const total = historyRes?.meta?.total || 0;
  const hasMore = page * pageSize < total;
  const hasPrev = page > 1;

  return (
    <div className="space-y-6 select-none">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-textPrimary leading-tight">Wellness History</h1>
          <p className="text-xs text-textMuted mt-0.5">Logs of your previous daily wellbeing self-reports.</p>
        </div>
        <Button variant="primary" size="sm" className="font-bold" onClick={() => navigate('/personnel/check-in')}>
          New Check-In
        </Button>
      </div>

      {isError ? (
        <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-semibold p-4 rounded-md text-center space-y-2">
          <p>Failed to retrieve check-in records.</p>
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            Retry Query
          </Button>
        </div>
      ) : logs.length === 0 ? (
        <EmptyState
          title="No history"
          description="Your check-in history will appear here."
          actionLabel="Start Check-In"
          onAction={() => navigate('/personnel/check-in')}
          className="bg-surface border border-border"
        />
      ) : (
        <div className="space-y-4 animate-fadeIn">
          <WellnessHistoryTable logs={logs} />
          
          {/* Pagination Controls */}
          {total > pageSize && (
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-textMuted font-semibold">
                Page {page} of {Math.ceil(total / pageSize)}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!hasPrev}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!hasMore}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default WellnessHistoryPage;
