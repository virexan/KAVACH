import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export const LoginPagePlaceholder: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In PRD 1, login logic is out of scope. Let's redirect to personnel by default.
    navigate('/personnel');
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
          <h2 className="text-base font-bold text-textPrimary mb-6 border-b border-border pb-3">
            Secure Sign In
          </h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Gov Email Address"
              type="email"
              placeholder="e.g. name@nic.in"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full mt-2">
              Sign In (Demo Bypass)
            </Button>
          </form>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-textMuted uppercase tracking-wider">
              Developer Bypass
            </span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Button variant="secondary" size="sm" onClick={() => navigate('/personnel')}>
              Personnel
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/officer')}>
              Officer
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/commander')}>
              Commander
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/admin')}>
              Admin
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default LoginPagePlaceholder;
