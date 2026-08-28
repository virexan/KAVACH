import React from 'react';
import Card from '../ui/Card';

interface TrendProps {
  trend: 'Improving' | 'Stable' | 'Needs attention' | 'Declining' | 'Insufficient data';
}

export const WellnessTrendCard: React.FC<TrendProps> = ({ trend }) => {
  const getTrendStyles = (t: string) => {
    switch (t) {
      case 'Improving':
        return { text: 'text-success', icon: '↑', bg: 'bg-success/5 border-success/15' };
      case 'Declining':
      case 'Needs attention':
        return { text: 'text-warning', icon: '↓', bg: 'bg-warning/5 border-warning/15' };
      case 'Stable':
        return { text: 'text-primary', icon: '→', bg: 'bg-primary/5 border-primary/15' };
      default:
        return { text: 'text-textMuted', icon: '•', bg: 'bg-surfaceAlt border-border' };
    }
  };

  const styles = getTrendStyles(trend);

  return (
    <Card className={`bg-surface border-l-4 flex flex-col justify-between p-5 ${styles.bg}`}>
      <div className="space-y-1 select-none">
        <h4 className="text-xs font-semibold text-textMuted uppercase tracking-wider">
          Wellbeing Trend
        </h4>
        <div className="flex items-baseline gap-2 pt-1">
          <span className={`text-2xl font-black ${styles.text}`}>
            {trend}
          </span>
          <span className={`text-lg font-black ${styles.text}`} aria-hidden="true">
            {styles.icon}
          </span>
        </div>
      </div>
      <p className="text-xs text-textSecondary mt-3 select-none leading-relaxed">
        Compared with your previous 7 days of workload and check-in reports.
      </p>
    </Card>
  );
};
export default WellnessTrendCard;
