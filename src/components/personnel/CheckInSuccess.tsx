import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';

export const CheckInSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-surface p-8 max-w-md mx-auto text-center space-y-6 select-none">
      <div className="space-y-2">
        <div className="w-12 h-12 rounded-full bg-success/15 border border-success/30 flex items-center justify-center text-success mx-auto">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-textPrimary">Check-in complete ✓</h3>
        <p className="text-sm text-textSecondary leading-relaxed">
          Thank you for checking in. Your responses have been successfully recorded in your private welfare log.
        </p>
      </div>

      <div className="bg-surfaceAlt/60 border border-border rounded-lg p-3 text-xs text-textMuted leading-relaxed">
        Your recent wellbeing overview and trend maps have been updated.
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button variant="secondary" size="sm" className="flex-1" onClick={() => navigate('/personnel')}>
          Go to Dashboard
        </Button>
        <Button variant="primary" size="sm" className="flex-1 font-bold" onClick={() => navigate('/personnel/trends')}>
          View My Trends
        </Button>
      </div>
    </Card>
  );
};
export default CheckInSuccess;
