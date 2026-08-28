import React from 'react';
import Card from '../ui/Card';

interface Props {
  title: string;
  value: string | number;
  description: string;
}

export const AdminMetricCard: React.FC<Props> = ({ title, value, description }) => {
  return (
    <Card className="bg-surface border border-border p-4 font-sans select-none text-left flex flex-col justify-between min-h-[100px] animate-fadeIn">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block">
          {title}
        </span>
        <span className="text-2xl font-black text-textPrimary leading-none">{value}</span>
      </div>
      <p className="text-[10px] text-textSecondary font-medium pt-2 border-t border-border/40 leading-relaxed mt-2">
        {description}
      </p>
    </Card>
  );
};
export default AdminMetricCard;
