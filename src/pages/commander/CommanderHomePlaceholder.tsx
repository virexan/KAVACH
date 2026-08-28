import React from 'react';
import EmptyState from '@/components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';

export const CommanderHomePlaceholder: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex items-center justify-center min-h-[50vh]">
      <EmptyState
        title="Commander Dashboard"
        description="This section is scheduled for implementation in PRD 5 — Aggregate Welfare & Workload Analysis."
        actionLabel="Explore UI Components"
        onAction={() => navigate('/dev/components')}
      />
    </div>
  );
};
export default CommanderHomePlaceholder;
