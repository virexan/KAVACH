import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import DemoAccountsPanel from './DemoAccountsPanel';
import { apiClient } from '@/lib/apiClient';

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const login = useAuthStore((state) => state.login);
  
  const [serviceId, setServiceId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMockActive = apiClient.useMocks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validations (FR-1.2)
    if (!serviceId.trim() || !password.trim()) {
      setError('Both Service ID and Password are required.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await login(serviceId, password);
      onSuccess();
    } catch (err: any) {
      // Differentiate network failure from wrong-password errors (FR-1.4, FR-19)
      if (err.code === 'NETWORK_ERROR') {
        setError('Network connection failed. Please verify connectivity and retry.');
      } else {
        setError(err.message || 'Invalid Service ID or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutofill = (selectedId: string) => {
    setServiceId(selectedId);
    setPassword('demo1234');
    setError(null);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Inline assertive error region (FR-24) */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-danger/10 border border-danger/20 text-danger text-xs font-semibold px-4 py-2.5 rounded-md leading-relaxed select-none"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Service ID / Username"
          type="text"
          placeholder="e.g. PERS001"
          required
          autoComplete="off"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          disabled={isLoading}
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
          Sign In
        </Button>
      </form>

      {/* Sandbox helper panel (FR-1.6, UX-4) */}
      {isMockActive && (
        <div className="pt-4 border-t border-border/60">
          <DemoAccountsPanel onSelectUser={handleAutofill} />
        </div>
      )}
    </div>
  );
};
export default LoginForm;
