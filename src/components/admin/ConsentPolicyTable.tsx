import React from 'react';
import Card from '../ui/Card';
import type { ConsentPolicy } from '@/services/adminService';

interface Props {
  policies: ConsentPolicy[];
  onPublish: (policy: ConsentPolicy) => void;
}

export const ConsentPolicyTable: React.FC<Props> = ({ policies, onPublish }) => {
  return (
    <Card className="bg-surface border border-border p-5 font-sans select-none text-left space-y-4 animate-fadeIn">
      <div>
        <h3 className="font-bold text-textPrimary text-base">Consent Policy Governance</h3>
        <p className="text-[10px] text-textMuted uppercase font-bold tracking-wide">System collection versions and active policies (FR-27)</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-surfaceAlt/60 text-textSecondary font-bold">
              <th className="p-3">Policy Scope</th>
              <th className="p-3">Version</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {policies.map((p) => (
              <tr key={p.id} className="hover:bg-surfaceAlt/10">
                <td className="p-3 font-semibold">
                  <span className="text-textPrimary block font-bold">{p.name}</span>
                  <span className="text-[10px] text-textMuted block font-medium pt-0.5">{p.purpose}</span>
                </td>
                <td className="p-3 text-textSecondary font-bold">{p.version}</td>
                <td className="p-3 text-textSecondary font-medium">{p.dataCategory}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-1.5 py-0.5 border rounded text-[9px] font-bold uppercase tracking-wider ${
                    p.status === 'ACTIVE' ? 'bg-success/10 text-success border-success/20' :
                    p.status === 'DRAFT' ? 'bg-warning/10 text-warning border-warning/20' :
                    'bg-surfaceAlt text-textSecondary border-border'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {p.status === 'DRAFT' && (
                    <button
                      onClick={() => onPublish(p)}
                      className="text-xs font-bold text-primary hover:underline focus:outline-none font-sans"
                    >
                      Publish policy
                    </button>
                  )}
                  {p.status === 'ACTIVE' && (
                    <span className="text-[10px] text-textMuted font-bold uppercase">Authorized active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
export default ConsentPolicyTable;
