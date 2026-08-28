import React from 'react';

interface Props {
  trend: 'IMPROVING' | 'STABLE' | 'INCREASING' | 'INSUFFICIENT_DATA';
}

export const RiskTrendIndicator: React.FC<Props> = ({ trend }) => {
  const getStyles = (t: string) => {
    switch (t) {
      case 'IMPROVING':
        return { text: 'text-success', label: 'Improving ↑' };
      case 'INCREASING':
        return { text: 'text-warning font-bold', label: 'Increasing ↓' };
      case 'STABLE':
        return { text: 'text-primary', label: 'Stable →' };
      default:
        return { text: 'text-textMuted', label: 'Insufficient Data' };
    }
  };

  const style = getStyles(trend);

  return (
    <span className={`text-xs font-bold select-none ${style.text}`}>
      {style.label}
    </span>
  );
};
export default RiskTrendIndicator;
