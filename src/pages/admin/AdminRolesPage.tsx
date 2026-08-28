import React from 'react';
import RoleMatrix from '@/components/admin/RoleMatrix';

export const AdminRolesPage: React.FC = () => {
  return (
    <div className="space-y-6 select-none font-sans text-left animate-fadeIn">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">Roles & Permissions Matrix</h1>
        <p className="text-xs text-textMuted mt-0.5">Audit role permissions mapping for all core portals.</p>
      </div>

      <RoleMatrix />
    </div>
  );
};
export default AdminRolesPage;
