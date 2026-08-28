import React from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorState from '@/components/ui/ErrorState';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <ErrorState
        title="404 - Resource Not Found"
        description="The page you requested could not be located on this portal."
        retryLabel="Return Home"
        onRetry={() => navigate('/')}
        className="max-w-md shadow-card bg-surface"
      />
    </div>
  );
};
export default NotFoundPage;
