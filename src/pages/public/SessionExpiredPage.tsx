import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ErrorState from '@/components/ui/ErrorState';

export const SessionExpiredPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectParam = searchParams.get('redirect') || '';

  const handleLoginAgain = () => {
    const target = redirectParam 
      ? `/login?redirect=${encodeURIComponent(redirectParam)}` 
      : '/login';
    navigate(target);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <ErrorState
        title="Session Expired"
        description="Your security credentials have expired due to inactivity. Please sign in again to restore your dashboard context."
        retryLabel="Sign In Again"
        onRetry={handleLoginAgain}
        className="max-w-md shadow-panel bg-surface border border-border"
      />
    </div>
  );
};
export default SessionExpiredPage;
