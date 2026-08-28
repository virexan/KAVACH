import React from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorState from '@/components/ui/ErrorState';
import { useAuthStore } from '@/store/authStore';

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleAction = () => {
    if (isAuthenticated) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <ErrorState
        title="Access Denied"
        description="Your user profile does not carry permissions to view the requested segment."
        retryLabel={isAuthenticated ? "Return to Dashboard" : "Back to Sign In"}
        onRetry={handleAction}
        className="max-w-md shadow-panel bg-surface border border-border"
      />
    </div>
  );
};
export default ForbiddenPage;
