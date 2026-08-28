import React from 'react';

interface Props {
  updatedAt: string;
}

export const AdminHeader: React.FC<Props> = ({ updatedAt }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4 select-none font-sans text-left animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-textPrimary leading-tight">Platform Governance Console</h1>
        <p className="text-xs text-textMuted mt-0.5">
          Secure administration panel. Session state checked:{' '}
          <span className="font-semibold text-textSecondary">{new Date(updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs font-bold text-success bg-success/10 border border-success/20 px-3 py-1.5 rounded-full select-none">
        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
        System Operational (FR-9)
      </div>
    </div>
  );
};
export default AdminHeader;
