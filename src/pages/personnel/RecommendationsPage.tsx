import React from 'react';
import { useQuery } from '@tanstack/react-query';
import recommendationService from '@/services/recommendationService';
import RecommendationCard from '@/components/personnel/RecommendationCard';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

export const RecommendationsPage: React.FC = () => {
  const { data: recRes, isLoading, isError } = useQuery({
    queryKey: ['personal-recommendations'],
    queryFn: () => recommendationService.getRecommendations(),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="line" className="h-8 w-1/4" />
        <Skeleton variant="card" className="h-32 w-full" />
        <Skeleton variant="card" className="h-32 w-full" />
      </div>
    );
  }

  const list = recRes?.data || [];

  return (
    <div className="space-y-6 select-none max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">Suggestions for You</h1>
        <p className="text-xs text-textMuted mt-0.5">Supportive recommendations based on recent check-in patterns.</p>
      </div>

      {isError ? (
        <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-semibold p-4 rounded-md text-center">
          Failed to load suggestions. Please retry.
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          title="No recommendations"
          description="No new suggestions right now."
          className="bg-surface border border-border"
        />
      ) : (
        <div className="space-y-4 animate-fadeIn">
          {list.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      )}
    </div>
  );
};
export default RecommendationsPage;
