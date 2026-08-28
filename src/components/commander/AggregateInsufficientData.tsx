import React from 'react';
import Card from '../ui/Card';

export const AggregateInsufficientData: React.FC = () => {
  return (
    <Card className="p-8 text-center bg-surface border border-border space-y-3 max-w-sm mx-auto select-none font-sans text-left my-8 animate-fadeIn">
      <span className="text-3xl block" aria-hidden="true">📊</span>
      <h3 className="font-bold text-textPrimary text-base">Not Enough Aggregate Data</h3>
      <p className="text-xs text-textSecondary leading-relaxed">
        There is not enough information logged during this period to display a reliable trend for this group. Try a longer reporting period. (FR-38)
      </p>
    </Card>
  );
};
export default AggregateInsufficientData;
