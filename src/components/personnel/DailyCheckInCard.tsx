import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface DailyCheckInCardProps {
  completed: boolean;
}

export const DailyCheckInCard: React.FC<DailyCheckInCardProps> = ({ completed }) => {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col justify-between h-full bg-surface">
      <div className="space-y-2 select-none">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-textPrimary text-base">Today's Check-In</h3>
          <span className={`w-2.5 h-2.5 rounded-full ${completed ? 'bg-success' : 'bg-warning'}`} />
        </div>
        <p className="text-sm text-textSecondary leading-relaxed">
          {completed 
            ? 'Completed today ✓ Thank you for checking in. Your next check-in is available tomorrow.'
            : 'Today\'s check-in is still available. Take a moment to reflect on your physical and mental energy levels.'
          }
        </p>
        <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider block">
          ~2 minutes
        </span>
      </div>

      <div className="mt-5 pt-3 border-t border-border/60">
        {completed ? (
          <Button variant="secondary" size="sm" className="w-full" onClick={() => navigate('/personnel/history')}>
            View Response History
          </Button>
        ) : (
          <Button variant="primary" size="sm" className="w-full font-bold" onClick={() => navigate('/personnel/check-in')}>
            Start Check-In
          </Button>
        )}
      </div>
    </Card>
  );
};
export default DailyCheckInCard;
