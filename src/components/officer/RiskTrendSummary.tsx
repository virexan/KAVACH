import React from 'react';
import Card from '../ui/Card';

interface Props {
  trend: 'IMPROVING' | 'STABLE' | 'INCREASING';
}

export const RiskTrendSummary: React.FC<Props> = ({ trend }) => {
  const getTrendStyles = (t: string) => {
    switch (t) {
      case 'IMPROVING':
        return { text: 'text-success', icon: '↑', bg: 'bg-success/5 border-success/15', desc: 'Decreasing overall risk counts.' };
      case 'INCREASING':
        return { text: 'text-warning font-bold', icon: '↓', bg: 'bg-warning/5 border-warning/15', desc: 'Rising workload and fatigue alerts.' };
      default:
        return { text: 'text-primary', icon: '→', bg: 'bg-primary/5 border-primary/15', desc: 'Consistent risk distribution curves.' };
    }
  };

  const styles = getTrendStyles(trend);

  return (
    <Card className={`bg-surface border-l-4 flex flex-col justify-between p-5 ${styles.bg}`}>
      <div className="space-y-1 select-none">
        <h4 className="text-xs font-semibold text-textMuted uppercase tracking-wider">
          Welfare Risk Trajectory
        </h4>
        <div className="flex items-baseline gap-2 pt-1">
          <span className={`text-2xl font-black ${styles.text}`}>
            {trend === 'INCREASING' ? 'Increasing' : trend === 'IMPROVING' ? 'Improving' : 'Stable'}
          </span>
          <span className={`text-lg font-black ${styles.text}`} aria-hidden="true">
            {styles.icon}
          </span>
        </div>
      </div>
      <p className="text-xs text-textSecondary mt-3 select-none leading-relaxed">
        {styles.desc} Compared with the previous 30 days.
      </p>
    </Card>
  );
};
export default RiskTrendSummary;
