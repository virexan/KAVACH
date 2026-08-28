import React from 'react';
import type { CommanderDashboard } from '@/services/commanderService';

interface Props {
  units: CommanderDashboard[];
  onViewUnit: (unitId: string) => void;
}

export const UnitComparisonTable: React.FC<Props> = ({ units, onViewUnit }) => {
  return (
    <div className="space-y-4 select-none font-sans text-left">
      <div>
        <h3 className="font-bold text-textPrimary text-base">Subunit Comparisons</h3>
        <p className="text-[10px] text-textMuted uppercase font-bold tracking-wide">Comparative aggregate performance across authorized zones (FR-23)</p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto border border-border rounded-md bg-surface">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surfaceAlt/60 text-xs font-bold text-textSecondary border-b border-border">
              <th className="p-3">Unit</th>
              <th className="p-3">Scope Count</th>
              <th className="p-3">Risk Trend</th>
              <th className="p-3">Duty Hours</th>
              <th className="p-3">Leave Utilization</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {units.filter(u => u.unitId !== 'ALL').map((u) => (
              <tr key={u.unitId} className="hover:bg-surfaceAlt/10">
                <td className="p-3 font-semibold text-textPrimary">{u.unitName}</td>
                <td className="p-3 text-textSecondary">{u.personnelInScope} personnel</td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
                    u.riskTrend.direction === 'IMPROVING' ? 'bg-success/10 text-success border-success/20' :
                    u.riskTrend.direction === 'INCREASING' ? 'bg-danger/10 text-danger border-danger/20' :
                    'bg-surfaceAlt text-textSecondary border-border'
                  }`}>
                    {u.riskTrend.direction.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="p-3 text-textSecondary font-medium">
                  {u.workloadSummary.dutyHours?.current ? `${u.workloadSummary.dutyHours.current} hrs/wk` : '—'}
                </td>
                <td className="p-3 text-textSecondary font-medium">
                  {u.workloadSummary.leaveUtilization?.current ? `${u.workloadSummary.leaveUtilization.current}%` : '—'}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => onViewUnit(u.unitId)}
                    className="text-xs font-bold text-primary hover:underline focus:outline-none"
                  >
                    View Analytics
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked list (FR-58) */}
      <div className="md:hidden space-y-3">
        {units.filter(u => u.unitId !== 'ALL').map((u) => (
          <div
            key={u.unitId}
            className="p-4 border border-border rounded-lg bg-surface space-y-3 animate-fadeIn"
          >
            <div className="flex justify-between items-center border-b border-border/40 pb-2">
              <span className="font-bold text-textPrimary text-sm">{u.unitName}</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                u.riskTrend.direction === 'IMPROVING' ? 'bg-success/10 text-success border-success/20' :
                u.riskTrend.direction === 'INCREASING' ? 'bg-danger/10 text-danger border-danger/20' :
                'bg-surfaceAlt text-textSecondary border-border'
              }`}>
                {u.riskTrend.direction}
              </span>
            </div>

            <div className="space-y-1 text-xs text-textSecondary">
              <p>Force Scope: <strong className="text-textPrimary">{u.personnelInScope} personnel</strong></p>
              <p>Workload Index: <strong className="text-textPrimary">{u.workloadSummary.dutyHours?.current || '—'} hrs/wk</strong></p>
              <p>Leave Utilization: <strong className="text-textPrimary">{u.workloadSummary.leaveUtilization?.current || '—'}%</strong></p>
            </div>

            <div className="flex justify-end pt-2 border-t border-border/40">
              <button
                onClick={() => onViewUnit(u.unitId)}
                className="px-2.5 py-1 border border-border text-primary text-[10px] font-bold rounded"
              >
                View Analytics
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default UnitComparisonTable;
