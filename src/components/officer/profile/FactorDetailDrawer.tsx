import React from 'react';
import Drawer from '../../ui/Drawer';
import type { RiskFactor } from '@/services/caseService';

interface Props {
  factor: RiskFactor | null;
  onClose: () => void;
}

export const FactorDetailDrawer: React.FC<Props> = ({ factor, onClose }) => {
  if (!factor) return null;

  return (
    <Drawer
      isOpen={!!factor}
      onClose={onClose}
      title={`Factor Context — ${factor.label}`}
      placement="right"
      className="max-w-[360px] w-full"
    >
      <div className="space-y-5 select-none text-left font-sans">
        <div className="border border-border rounded-md p-4 bg-surfaceAlt/15 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-textSecondary">Metric Category</span>
            <span className="font-bold text-textPrimary uppercase tracking-wider">{factor.category}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-textSecondary">Severity</span>
            <span className="font-bold text-textPrimary uppercase tracking-wider">{factor.severity}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-textSecondary">Recent Trajectory</span>
            <span className="font-bold text-textPrimary uppercase tracking-wider">
              {factor.trend ? factor.trend.replace('_', ' ') : 'STABLE'}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h4 className="text-[10px] text-textMuted font-bold uppercase tracking-wider">
            Analysis & Changes (AI Explanation)
          </h4>
          <p className="text-xs text-textSecondary leading-relaxed bg-surface border border-border p-3.5 rounded-md font-medium">
            {factor.explanation || 'No historical deviation explanation logged.'}
          </p>
        </div>
      </div>
    </Drawer>
  );
};
export default FactorDetailDrawer;
