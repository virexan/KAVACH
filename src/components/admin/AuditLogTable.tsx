import React from 'react';
import type { AuditEvent } from '@/services/adminService';

interface Props {
  logs: AuditEvent[];
  onSelect: (event: AuditEvent) => void;
}

export const AuditLogTable: React.FC<Props> = ({ logs, onSelect }) => {
  const getResultStyle = (res: string) => {
    if (res === 'SUCCESS') return 'text-success bg-success/10 border-success/20';
    return 'text-danger bg-danger/10 border-danger/20';
  };

  return (
    <div className="space-y-4 font-sans text-left select-none">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto border border-border rounded-md bg-surface">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surfaceAlt/60 text-xs font-bold text-textSecondary border-b border-border">
              <th className="p-3">Time</th>
              <th className="p-3">Actor</th>
              <th className="p-3">Category</th>
              <th className="p-3">Action Description</th>
              <th className="p-3">Result</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-surfaceAlt/10">
                <td className="p-3 text-textSecondary font-semibold">
                  {new Date(log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>
                <td className="p-3 text-textPrimary font-bold">{log.actorDisplayName}</td>
                <td className="p-3">
                  <span className="bg-surfaceAlt text-textSecondary border border-border px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                    {log.category}
                  </span>
                </td>
                <td className="p-3 text-textSecondary font-medium">{log.summary || log.action}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 border rounded text-[8px] font-bold uppercase tracking-wider ${getResultStyle(log.result)}`}>
                    {log.result}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => onSelect(log)}
                    className="text-xs font-bold text-primary hover:underline focus:outline-none"
                  >
                    View detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile list (FR-70) */}
      <div className="md:hidden space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            onClick={() => onSelect(log)}
            className="p-4 border border-border rounded-lg bg-surface space-y-3 cursor-pointer hover:bg-surfaceAlt/20 animate-fadeIn"
          >
            <div className="flex justify-between items-center border-b border-border/40 pb-2">
              <span className="font-bold text-textPrimary text-xs">{log.actorDisplayName}</span>
              <span className={`px-1.5 py-0.5 border rounded text-[8px] font-bold uppercase tracking-wider ${getResultStyle(log.result)}`}>
                {log.result}
              </span>
            </div>
            <p className="text-xs text-textSecondary leading-snug">{log.summary || log.action}</p>
            <div className="flex justify-between items-center text-[10px] text-textMuted pt-1">
              <span>{log.category}</span>
              <span>{new Date(log.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AuditLogTable;
