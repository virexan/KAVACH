import React from 'react';
import EmptyState from '@/components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';

export const PersonnelHomePlaceholder: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex items-center justify-center min-h-[50vh]">
      <EmptyState
        title="Personnel Welfare Center"
        description="This section is scheduled for implementation in PRD 3 — Personnel Welfare Check-In & Self-Reports."
        actionLabel="Explore UI Components"
        onAction={() => navigate('/dev/components')}
      />
    </div>
  );
};
export default PersonnelHomePlaceholder;
