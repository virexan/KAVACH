import React from 'react';
import Card from '../../ui/Card';

interface Props {
  trend: 'IMPROVING' | 'STABLE' | 'INCREASING' | 'INSUFFICIENT_DATA';
}

export const RiskTrajectory: React.FC<Props> = ({ trend }) => {
  const getStyles = (t: string) => {
    switch (t) {
      case 'IMPROVING':
        return { text: 'text-success', icon: '↑', bg: 'bg-success/5 border-success/10', desc: 'Welfare indicators show improving recovery trends.' };
      case 'INCREASING':
        return { text: 'text-warning font-bold', icon: '↓', bg: 'bg-warning/5 border-warning/10', desc: 'Fatigue signals and workloads are increasing.' };
      case 'STABLE':
        return { text: 'text-primary', icon: '→', bg: 'bg-primary/5 border-primary/10', desc: 'Welfare assessment remains consistent.' };
      default:
        return { text: 'text-textMuted', icon: '—', bg: 'bg-surfaceAlt/40 border-border', desc: 'No trends can be calculated.' };
    }
  };

  const styles = getStyles(trend);

  return (
    <Card className={`p-5 flex flex-col justify-between h-full select-none ${styles.bg} font-sans`}>
      <div className="space-y-2 text-left">
        <h4 className="text-xs font-semibold text-textMuted uppercase tracking-wider">
          Risk Trajectory
        </h4>
        <div className="flex items-baseline gap-2 pt-1">
          <span className={`text-3xl font-black block tracking-tight ${styles.text}`}>
            {trend === 'INCREASING' ? 'Increasing' : trend === 'IMPROVING' ? 'Improving' : trend === 'STABLE' ? 'Stable' : 'Insufficient'}
          </span>
          <span className={`text-xl font-black ${styles.text}`} aria-hidden="true">
            {styles.icon}
          </span>
        </div>
        <p className="text-xs text-textSecondary leading-relaxed pt-1.5 font-medium">
          {styles.desc}
        </p>
      </div>

      <div className="pt-4 border-t border-border/40 text-xs text-left text-textMuted font-semibold">
        Compared with previous 30 days (FR-12)
      </div>
    </Card>
  );
};
export default RiskTrajectory;
