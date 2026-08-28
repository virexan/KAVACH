import React from 'react';

interface ProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const CheckInProgress: React.FC<ProgressProps> = ({ currentStep, totalSteps }) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);
  return (
    <div className="w-full select-none" aria-label={`Step ${currentStep} of ${totalSteps}`}>
      <div className="flex justify-between items-center text-xs text-textMuted font-bold mb-1.5 uppercase tracking-wide">
        <span>Check-In Progress</span>
        <span>{percentage}% Complete</span>
      </div>
      <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-200"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
export default CheckInProgress;
