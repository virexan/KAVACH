import React from 'react';
import Card from '../ui/Card';

export const RoleMatrix: React.FC = () => {
  const permissions = [
    { name: 'WELLNESS_SELF_READ', desc: 'Read own wellness profile logs', roles: [true, false, false, false] },
    { name: 'WELLNESS_SELF_WRITE', desc: 'Complete daily check-ins', roles: [true, false, false, false] },
    { name: 'CASE_READ', desc: 'Review personnel risk directory profiles', roles: [false, true, false, false] },
    { name: 'CASE_ACKNOWLEDGE', desc: 'Acknowledge case risk triggers', roles: [false, true, false, false] },
    { name: 'FOLLOWUP_CREATE', desc: 'Schedule follow-up tasks', roles: [false, true, false, false] },
    { name: 'AGGREGATE_ANALYTICS_READ', desc: 'Review unit workload statistics', roles: [false, false, true, false] },
    { name: 'USER_READ_WRITE', desc: 'Manage user profiles and roles', roles: [false, false, false, true] },
    { name: 'AUDIT_READ', desc: 'Review platform audit log logs', roles: [false, false, false, true] },
    { name: 'SYSTEM_SETTINGS_UPDATE', desc: 'Update timeouts and session thresholds', roles: [false, false, false, true] }
  ];

  return (
    <Card className="bg-surface border border-border p-5 font-sans select-none text-left space-y-4 overflow-x-auto animate-fadeIn">
      <div>
        <h3 className="font-bold text-textPrimary text-base">Roles & Permissions Matrix</h3>
        <p className="text-[10px] text-textMuted uppercase font-bold tracking-wide">Platform RBAC permission mappings (FR-18)</p>
      </div>

      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-border bg-surfaceAlt/60 text-textSecondary font-bold">
            <th className="p-3">Permission Item</th>
            <th className="p-3 text-center">Personnel</th>
            <th className="p-3 text-center">Officer</th>
            <th className="p-3 text-center">Commander</th>
            <th className="p-3 text-center">Admin</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {permissions.map((p) => (
            <tr key={p.name} className="hover:bg-surfaceAlt/10">
              <td className="p-3 font-semibold">
                <span className="text-textPrimary block font-bold">{p.name}</span>
                <span className="text-[10px] text-textMuted block">{p.desc}</span>
              </td>
              {p.roles.map((hasPerm, i) => (
                <td key={i} className="p-3 text-center text-sm">
                  {hasPerm ? (
                    <span className="text-success font-black" aria-label="Permitted">✓</span>
                  ) : (
                    <span className="text-textMuted font-black" aria-label="Denied">—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
export default RoleMatrix;
