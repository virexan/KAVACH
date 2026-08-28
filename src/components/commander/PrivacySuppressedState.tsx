import React from 'react';
import Card from '../ui/Card';

export const PrivacySuppressedState: React.FC = () => {
  return (
    <Card className="p-8 text-center bg-surface border border-border space-y-4 max-w-md mx-auto select-none font-sans text-left my-8 animate-fadeIn">
      <span className="text-3xl block" aria-hidden="true">🔒</span>
      <h3 className="font-bold text-textPrimary text-base">Aggregate View Suppressed</h3>
      <p className="text-xs text-textSecondary leading-relaxed">
        Welfare and workload analytics are unavailable for this unit because its current personnel count falls below the minimum required reporting size (FR-39).
      </p>
      <div className="bg-surfaceAlt/60 border border-border p-3 rounded text-[10px] text-textMuted leading-relaxed">
        ℹ️ <strong>Privacy Protection Rule (FR-11):</strong> To protect personnel privacy, KAVACH suppresses individual metrics and small-group aggregations. Choose a larger unit scope.
      </div>
    </Card>
  );
};
export default PrivacySuppressedState;
