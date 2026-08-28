import React from 'react';

interface Props {
  nextReviewDate?: string;
}

export const MonitoringBanner: React.FC<Props> = ({ nextReviewDate }) => {
  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-md p-4 flex items-center gap-3 select-none font-sans text-left animate-fadeIn">
      <span className="text-xl">📊</span>
      <div className="space-y-0.5">
        <h4 className="font-bold text-primary text-xs uppercase tracking-wide">Welfare Monitoring Active</h4>
        <p className="text-xs text-textSecondary font-medium leading-relaxed">
          This case is currently placed under active monitoring. Next review scheduled for:{' '}
          <strong className="text-textPrimary">{formatDate(nextReviewDate)}</strong>.
        </p>
      </div>
    </div>
  );
};
export default MonitoringBanner;
