import React from 'react';
import Card from '../../ui/Card';

interface Props {
  personnelDisplayId: string;
  onBack: () => void;
}

export const InsufficientDataState: React.FC<Props> = ({ personnelDisplayId, onBack }) => {
  return (
    <div className="space-y-6 select-none max-w-2xl mx-auto font-sans text-left animate-fadeIn">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-bold text-textMuted hover:text-primary transition-colors flex items-center gap-1.5 focus:outline-none mb-1"
          >
            ← Back to Cases
          </button>
          <h1 className="text-2xl font-black text-textPrimary leading-tight">
            Personnel {personnelDisplayId}
          </h1>
        </div>
        <span className="bg-surfaceAlt text-textSecondary border border-border inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
          Insufficient Data (FR-37)
        </span>
      </div>

      <Card className="p-8 text-center bg-surface border border-border space-y-4">
        <span className="text-3xl block" aria-hidden="true">📊</span>
        <h3 className="font-bold text-textPrimary text-base">Insufficient History Logged</h3>
        <p className="text-xs text-textSecondary max-w-sm mx-auto leading-relaxed">
          A reliable risk trend cannot currently be established. Additional self-report submissions or workload entries are needed before calculating evaluations.
        </p>
      </Card>
      
      {/* Grid of indicators showing missing states (FR-38) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4 bg-surface border border-border text-xs space-y-2">
          <span className="font-bold text-textPrimary uppercase text-[10px] tracking-wide block">Wellness Submissions</span>
          <span className="text-textMuted font-bold">No recent wellness check-ins logged (FR-38)</span>
        </Card>
        <Card className="p-4 bg-surface border border-border text-xs space-y-2">
          <span className="font-bold text-textPrimary uppercase text-[10px] tracking-wide block">Active Duty Hours</span>
          <span className="text-textMuted font-bold">No workload records found</span>
        </Card>
      </div>
    </div>
  );
};
export default InsufficientDataState;
