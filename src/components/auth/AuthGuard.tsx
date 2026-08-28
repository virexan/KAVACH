import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Skeleton from '../ui/Skeleton';

export const AuthGuard: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, isInitializing, initialize } = useAuthStore();

  useEffect(() => {
    // Trigger silent restore on mount
    initialize();
  }, [initialize]);

  if (isInitializing) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton variant="line" className="h-8 w-1/4 mb-4" />
        <Skeleton variant="block" className="h-48 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const attemptedPath = encodeURIComponent(location.pathname + location.search + location.hash);
    return <Navigate to={`/login?redirect=${attemptedPath}`} replace />;
  }

  return <Outlet />;
};
export default AuthGuard;
