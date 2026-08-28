import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Card from '@/components/ui/Card';
import LoginForm from '@/components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();

  const redirectParam = searchParams.get('redirect') || '';

  const getHomeRoute = (role: string): string => {
    switch (role) {
      case 'PERSONNEL':
        return '/personnel';
      case 'WELFARE_OFFICER':
        return '/officer';
      case 'COMMANDER':
        return '/commander';
      case 'ADMIN':
        return '/admin';
      default:
        return '/login';
    }
  };

  useEffect(() => {
    // If already authenticated, bypass login view automatically (FR-1.5, UX-2)
    if (isAuthenticated && user) {
      const target = redirectParam ? decodeURIComponent(redirectParam) : getHomeRoute(user.role);
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, navigate, redirectParam]);

  const handleLoginSuccess = () => {
    // Successful login callback - state updates will trigger the redirect in useEffect above
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 select-none">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl mx-auto shadow-panel">
            K
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-textPrimary">
            KAVACH Portal
          </h1>
          <p className="text-sm text-textMuted max-w-xs mx-auto">
            AI-Powered Welfare & Workload Analysis Platform
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-base font-bold text-textPrimary border-b border-border pb-3">
              Secure Sign In
            </h2>
            <p className="text-xs text-textMuted mt-1">
              Gov Credentials Verification Gateway
            </p>
          </div>
          
          <LoginForm onSuccess={handleLoginSuccess} />
        </Card>
      </div>
    </div>
  );
};
export default LoginPage;
