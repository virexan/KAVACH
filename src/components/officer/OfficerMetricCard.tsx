import React from 'react';
import Card from '../ui/Card';

interface Props {
  count: number;
  label: string;
  description?: string;
  type?: 'neutral' | 'warning' | 'danger' | 'success';
}

export const OfficerMetricCard: React.FC<Props> = ({ count, label, description, type = 'neutral' }) => {
  const getBorderColor = () => {
    if (type === 'warning') return 'border-l-warning';
    if (type === 'danger') return 'border-l-danger';
    if (type === 'success') return 'border-l-success';
    return 'border-l-primary';
  };

  return (
    <Card className={`bg-surface border-l-4 p-5 flex flex-col justify-between h-full ${getBorderColor()} select-none`}>
      <div className="space-y-1.5">
        <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider block">
          {label}
        </span>
        <span className="text-3xl font-black text-textPrimary leading-none block">
          {count}
        </span>
      </div>
      {description && (
        <p className="text-xs text-textSecondary mt-3 leading-normal font-medium">
          {description}
        </p>
      )}
    </Card>
  );
};
export default OfficerMetricCard;
