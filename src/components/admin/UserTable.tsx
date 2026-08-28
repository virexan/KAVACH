import React from 'react';
import type { AdminUser } from '@/services/adminService';

interface Props {
  users: AdminUser[];
  onView: (id: string) => void;
  onChangeRole: (user: AdminUser) => void;
  onChangeStatus: (user: AdminUser, action: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE') => void;
}

export const UserTable: React.FC<Props> = ({ users, onView, onChangeRole, onChangeStatus }) => {
  const getStatusStyle = (st: string) => {
    switch (st) {
      case 'ACTIVE':
        return 'bg-success/10 text-success border-success/20';
      case 'SUSPENDED':
        return 'bg-danger/10 text-danger border-danger/20';
      case 'PENDING':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-surfaceAlt text-textSecondary border-border';
    }
  };

  return (
    <div className="space-y-4 select-none font-sans text-left">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto border border-border rounded-md bg-surface">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surfaceAlt/60 text-xs font-bold text-textSecondary border-b border-border">
              <th className="p-3">User Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Account Status</th>
              <th className="p-3">Created</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-surfaceAlt/10">
                <td className="p-3 font-semibold text-textPrimary">{u.displayName}</td>
                <td className="p-3 text-textSecondary">{u.role.replace(/_/g, ' ')}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(u.status)}`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-3 text-xs text-textMuted">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-3 text-right space-x-3">
                  <button onClick={() => onView(u.id)} className="text-xs font-bold text-primary hover:underline focus:outline-none">
                    View
                  </button>
                  <button onClick={() => onChangeRole(u)} className="text-xs font-bold text-textSecondary hover:underline focus:outline-none">
                    Change Role
                  </button>
                  {u.status !== 'SUSPENDED' ? (
                    <button onClick={() => onChangeStatus(u, 'SUSPENDED')} className="text-xs font-bold text-danger hover:underline focus:outline-none">
                      Suspend
                    </button>
                  ) : (
                    <button onClick={() => onChangeStatus(u, 'ACTIVE')} className="text-xs font-bold text-success hover:underline focus:outline-none">
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked List (FR-70) */}
      <div className="md:hidden space-y-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="p-4 border border-border rounded-lg bg-surface space-y-3 animate-fadeIn"
          >
            <div className="flex justify-between items-center border-b border-border/40 pb-2">
              <span className="font-bold text-textPrimary text-sm">{u.displayName}</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${getStatusStyle(u.status)}`}>
                {u.status}
              </span>
            </div>

            <div className="space-y-1 text-xs text-textSecondary">
              <p>Role: <strong className="text-textPrimary">{u.role}</strong></p>
              <p className="text-[10px] text-textMuted">Created: {new Date(u.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-border/40">
              <button onClick={() => onView(u.id)} className="px-2 py-1 border border-border text-primary text-[10px] font-bold rounded">
                View
              </button>
              <button onClick={() => onChangeRole(u)} className="px-2.5 py-1 border border-border text-textSecondary text-[10px] font-bold rounded">
                Role
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default UserTable;
