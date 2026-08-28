import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const handleEnter = () => {
    if (isAuthenticated && user) {
      // Redirect directly to their dashboard based on role
      switch (user.role) {
        case 'PERSONNEL':
          navigate('/personnel');
          break;
        case 'WELFARE_OFFICER':
          navigate('/officer');
          break;
        case 'COMMANDER':
          navigate('/commander');
          break;
        case 'ADMIN':
          navigate('/admin');
          break;
        default:
          navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background text-textPrimary font-sans flex flex-col justify-between select-none text-left p-6 sm:p-12 animate-fadeIn">
      {/* Top Navbar */}
      <header className="flex justify-between items-center border-b border-border pb-4 mb-8">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-primary" />
          <span className="text-lg font-black tracking-wider text-textPrimary uppercase">
            KAVACH Portal
          </span>
        </div>
        <Button variant="secondary" size="sm" onClick={handleEnter} className="font-bold">
          {isAuthenticated ? 'Go to Dashboard' : 'Sign In'}
        </Button>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto my-auto space-y-12 py-6">
        <div className="space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded uppercase tracking-wider">
            ✦ AI-Powered Welfare & Workload Analysis Platform
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-textPrimary tracking-tight leading-tight">
            Early Welfare Support & Aggregate Command Intelligence
          </h1>
          <p className="text-sm sm:text-base text-textSecondary leading-relaxed max-w-2xl">
            Calibrating operational workloads, deployment rosters, and voluntary check-in fatigue trends to safeguard force wellbeing under strict privacy bounds.
          </p>
          <div className="pt-4 flex justify-center sm:justify-start">
            <Button variant="primary" size="lg" onClick={handleEnter} className="font-bold">
              {isAuthenticated ? 'Enter Platform Dashboard' : 'Enter Secure Platform'}
            </Button>
          </div>
        </div>

        {/* Persona grids */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 font-sans">
          <Card className="p-5 border border-border bg-surface space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Personnel Experience
            </div>
            <p className="text-xs text-textSecondary leading-relaxed">
              Voluntary check-ins, sleep and fatigue tracking, self-managed consent versions, and local support resource syncs.
            </p>
          </Card>

          <Card className="p-5 border border-border bg-surface space-y-2">
            <div className="flex items-center gap-2 text-warning font-bold text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-warning" />
              Welfare Officer Space
            </div>
            <p className="text-xs text-textSecondary leading-relaxed">
              Actionable explainability factors, priority risk signals warnings, and scheduled interventions outcome logs.
            </p>
          </Card>

          <Card className="p-5 border border-border bg-surface space-y-2">
            <div className="flex items-center gap-2 text-info font-bold text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-info" />
              Commander Analytics
            </div>
            <p className="text-xs text-textSecondary leading-relaxed">
              Aggregate unit workload stress indices, cohort trends mapping, and privacy-preserving threshold suppression.
            </p>
          </Card>

          <Card className="p-5 border border-border bg-surface space-y-2">
            <div className="flex items-center gap-2 text-success font-bold text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Platform Governance
            </div>
            <p className="text-xs text-textSecondary leading-relaxed">
              Role permission matrices, model version history, append-only logs audit trails, and system health status.
            </p>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border pt-6 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-textMuted font-medium uppercase tracking-wider">
        <span>🔒 Secure Governed Environment • Decodable JWT Sessions</span>
        <span>© 2026 KAVACH Welfare Platform</span>
      </footer>
    </div>
  );
};
export default LandingPage;
