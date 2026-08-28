import React from 'react';
import EmptyState from '@/components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';

export const AdminHomePlaceholder: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex items-center justify-center min-h-[50vh]">
      <EmptyState
        title="Administration Console"
        description="This section is scheduled for implementation in PRD 2 (Auth + RBAC) and PRD 9 (System Configurations)."
        actionLabel="Explore UI Components"
        onAction={() => navigate('/dev/components')}
      />
    </div>
  );
};
export default AdminHomePlaceholder;
