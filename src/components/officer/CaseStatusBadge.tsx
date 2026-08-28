import React from 'react';

interface Props {
  status: 'NEW' | 'REVIEW_REQUIRED' | 'ACKNOWLEDGED' | 'FOLLOW_UP_REQUIRED' | 'IN_PROGRESS' | 'MONITORING' | 'RESOLVED';
}

export const CaseStatusBadge: React.FC<Props> = ({ status }) => {
  const getStyles = (st: string) => {
    switch (st) {
      case 'NEW':
        return 'bg-info/10 text-info border-info/20';
      case 'REVIEW_REQUIRED':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'ACKNOWLEDGED':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'FOLLOW_UP_REQUIRED':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'IN_PROGRESS':
      case 'MONITORING':
        return 'bg-success/10 text-success border-success/20';
      case 'RESOLVED':
        return 'bg-surfaceAlt text-textSecondary border-border';
      default:
        return 'bg-surfaceAlt text-textSecondary border-border';
    }
  };

  const getLabel = (st: string) => {
    return st.replace(/_/g, ' ');
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider select-none ${getStyles(status)}`}>
      {getLabel(status)}
    </span>
  );
};
export default CaseStatusBadge;
