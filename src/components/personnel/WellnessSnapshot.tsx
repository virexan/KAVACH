import React from 'react';
import Card from '../ui/Card';

interface MetricProps {
  label: string;
  value: string;
  type?: 'positive' | 'neutral' | 'negative';
}

export const WellnessMetric: React.FC<MetricProps> = ({ label, value, type = 'neutral' }) => {
  const badgeColors = {
    positive: 'bg-success/10 text-success border-success/20',
    neutral: 'bg-surfaceAlt text-textSecondary border-border',
    negative: 'bg-warning/10 text-warning border-warning/20',
  };

  return (
    <div className="flex justify-between items-center p-3 border border-border rounded-md bg-surfaceAlt/10 select-none">
      <span className="text-sm font-semibold text-textSecondary">{label}</span>
      <span className={`px-2.5 py-0.5 text-xs font-bold rounded border ${badgeColors[type]}`}>
        {value}
      </span>
    </div>
  );
};

interface SnapshotProps {
  metrics: {
    mood: string;
    energy: string;
    sleep: string;
    stress: string;
    fatigue: string;
  };
}

export const WellnessSnapshot: React.FC<SnapshotProps> = ({ metrics }) => {
  const getType = (val: string, inverse = false) => {
    const value = val.toLowerCase();
    if (value === 'good') return 'positive';
    if (value === 'low') return inverse ? 'positive' : 'negative';
    if (value === 'needs attention') return 'negative';
    return 'neutral';
  };

  return (
    <Card className="bg-surface">
      <h3 className="font-bold text-textPrimary text-base mb-4 select-none">Your Recent Wellbeing</h3>
      <div className="space-y-2.5">
        <WellnessMetric label="Mood" value={metrics.mood} type={getType(metrics.mood)} />
        <WellnessMetric label="Energy" value={metrics.energy} type={getType(metrics.energy)} />
        <WellnessMetric label="Sleep" value={metrics.sleep} type={getType(metrics.sleep)} />
        <WellnessMetric label="Stress" value={metrics.stress} type={getType(metrics.stress, true)} />
        <WellnessMetric label="Fatigue" value={metrics.fatigue} type={getType(metrics.fatigue, true)} />
      </div>
    </Card>
  );
};
export default WellnessSnapshot;
