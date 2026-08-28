import React from 'react';
import EmptyState from '@/components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';

export const OfficerHomePlaceholder: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex items-center justify-center min-h-[50vh]">
      <EmptyState
        title="Welfare Officer Workspace"
        description="This section is scheduled for implementation in PRD 4 — Case Management and Welfare Alerts."
        actionLabel="Explore UI Components"
        onAction={() => navigate('/dev/components')}
      />
    </div>
  );
};
export default OfficerHomePlaceholder;
