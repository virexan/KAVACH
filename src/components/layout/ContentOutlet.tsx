import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from '../feedback/ErrorBoundary';
import Skeleton from '../ui/Skeleton';
import Breadcrumbs from '../ui/Breadcrumbs';

export const ContentOutlet: React.FC = () => {
  return (
    <ErrorBoundary>
      {/* Route-level Breadcrumbs */}
      <Breadcrumbs />

      <Suspense
        fallback={
          <div className="space-y-6 w-full">
            <Skeleton variant="line" className="h-8 w-1/4 mb-4" />
            <Skeleton variant="block" className="h-48 w-full mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton variant="card" />
              <Skeleton variant="card" />
              <Skeleton variant="card" />
            </div>
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
};
export default ContentOutlet;
