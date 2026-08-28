import React from 'react';

export interface SkeletonProps {
  variant?: 'line' | 'block' | 'card' | 'table-row';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ variant = 'line', className = '' }) => {
  const baseClass = 'animate-pulse bg-textMuted/15 rounded-md';
  
  if (variant === 'line') {
    return <div className={`${baseClass} h-4 w-2/3 ${className}`} />;
  }
  
  if (variant === 'block') {
    return <div className={`${baseClass} h-20 w-full ${className}`} />;
  }

  if (variant === 'card') {
    return (
      <div className={`border border-border rounded-lg p-5 shadow-card space-y-4 bg-surface ${className}`}>
        <div className="flex items-center gap-3">
          <div className={`${baseClass} h-10 w-10 rounded-full`} />
          <div className="space-y-2 flex-1">
            <div className={`${baseClass} h-4 w-1/3`} />
            <div className={`${baseClass} h-3 w-1/2`} />
          </div>
        </div>
        <div className="space-y-2">
          <div className={`${baseClass} h-4 w-full`} />
          <div className={`${baseClass} h-4 w-5/6`} />
        </div>
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <div className={`flex items-center justify-between border-b border-border py-4 px-6 bg-surface ${className}`}>
        <div className={`${baseClass} h-4 w-1/4`} />
        <div className={`${baseClass} h-4 w-1/6`} />
        <div className={`${baseClass} h-4 w-1/5`} />
        <div className={`${baseClass} h-4 w-12`} />
      </div>
    );
  }

  return null;
};
export default Skeleton;
