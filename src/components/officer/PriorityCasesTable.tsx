import React from 'react';
import type { WelfareCase } from '@/services/caseService';
import RiskLevelBadge from './RiskLevelBadge';
import RiskTrendIndicator from './RiskTrendIndicator';
import FollowUpStatusBadge from './FollowUpStatusBadge';
import RiskFactorSummary from './RiskFactorSummary';

interface Props {
  cases: WelfareCase[];
  onSelectCase: (c: WelfareCase) => void;
}

export const PriorityCasesTable: React.FC<Props> = ({ cases, onSelectCase }) => {
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      {/* Desktop Table View (FR-13, FR-55) */}
      <div className="hidden md:block overflow-x-auto border border-border rounded-md bg-surface select-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surfaceAlt/60 text-xs font-bold text-textSecondary border-b border-border">
              <th className="p-3">Personnel</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Risk Level</th>
              <th className="p-3">Trend</th>
              <th className="p-3">Confidence</th>
              <th className="p-3">Contributing Factors</th>
              <th className="p-3">Last Assessment</th>
              <th className="p-3">Follow-Up</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {cases.map((c) => (
              <tr key={c.id} className="hover:bg-surfaceAlt/20">
                <td className="p-3 font-semibold text-textPrimary">{c.personnelDisplayId}</td>
                <td className="p-3 text-textSecondary">{c.unitId}</td>
                <td className="p-3">
                  <RiskLevelBadge level={c.riskLevel} />
                </td>
                <td className="p-3">
                  <RiskTrendIndicator trend={c.trend} />
                </td>
                <td className="p-3 text-textSecondary">
                  {c.confidence ? `${c.confidence}%` : '—'}
                </td>
                <td className="p-3">
                  <RiskFactorSummary factors={c.primaryFactors} />
                </td>
                <td className="p-3 text-xs text-textMuted">{formatDate(c.lastAssessmentAt)}</td>
                <td className="p-3">
                  <FollowUpStatusBadge status={c.followUpStatus} />
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => onSelectCase(c)}
                    className="text-xs font-bold text-primary hover:underline focus:outline-none"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked View (FR-55) */}
      <div className="md:hidden space-y-3">
        {cases.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelectCase(c)}
            className="p-4 border border-border rounded-lg bg-surface space-y-3 cursor-pointer active:bg-surfaceAlt/30 select-none animate-fadeIn"
          >
            <div className="flex justify-between items-center border-b border-border/40 pb-2">
              <div className="flex flex-col">
                <span className="font-bold text-textPrimary text-sm">{c.personnelDisplayId}</span>
                <span className="text-[10px] text-textMuted">{c.unitId}</span>
              </div>
              <RiskLevelBadge level={c.riskLevel} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-textSecondary">
              <div>Trend: <RiskTrendIndicator trend={c.trend} /></div>
              <div>Confidence: <strong className="text-textPrimary">{c.confidence ? `${c.confidence}%` : '—'}</strong></div>
              <div className="col-span-2 mt-1">
                <RiskFactorSummary factors={c.primaryFactors} />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-border/40 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="text-textMuted">Follow-up:</span>
                <FollowUpStatusBadge status={c.followUpStatus} />
              </div>
              <span className="text-primary font-bold uppercase">Tap to Review</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PriorityCasesTable;
