import React from 'react';

interface Props {
  status: 'NOT_REQUIRED' | 'REQUIRED' | 'DUE' | 'IN_PROGRESS' | 'COMPLETED';
}

export const FollowUpStatusBadge: React.FC<Props> = ({ status }) => {
  const getStyles = (st: string) => {
    switch (st) {
      case 'NOT_REQUIRED':
        return 'bg-surfaceAlt text-textMuted border-border';
      case 'REQUIRED':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'DUE':
        return 'bg-danger/10 text-danger border-danger/20';
      case 'IN_PROGRESS':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'COMPLETED':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-surfaceAlt text-textSecondary border-border';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider select-none ${getStyles(status)}`}>
      {status.replace('_', ' ')}
    </span>
  );
};
export default FollowUpStatusBadge;
