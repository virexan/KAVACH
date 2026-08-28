import React from 'react';
import { useQuery } from '@tanstack/react-query';
import resourceService from '@/services/resourceService';
import ResourceCard from '@/components/personnel/ResourceCard';
import SupportRequestCard from '@/components/personnel/SupportRequestCard';
import Skeleton from '@/components/ui/Skeleton';

export const ResourcesPage: React.FC = () => {
  const { data: resRes, isLoading, isError } = useQuery({
    queryKey: ['welfare-resources'],
    queryFn: () => resourceService.getResources(),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="line" className="h-8 w-1/4" />
        <Skeleton variant="card" className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      </div>
    );
  }

  const list = resRes?.data || [];

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">Welfare Resources</h1>
        <p className="text-xs text-textMuted mt-0.5">Discover support directories, counselling helplines, and recovery tools.</p>
      </div>

      {/* Talk to Welfare Officer pathway (FR-29) */}
      <SupportRequestCard />

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-textPrimary uppercase tracking-wider text-[10px]">
          Available Support Directories
        </h3>

        {isError ? (
          <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-semibold p-4 rounded-md text-center">
            Failed to load welfare directories. Please retry.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {list.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default ResourcesPage;
