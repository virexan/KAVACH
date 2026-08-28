import React from 'react';
import Button from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center border border-dashed border-border rounded-lg bg-surfaceAlt/20 ${className}`}>
      {icon ? (
        <div className="text-textMuted mb-4">{icon}</div>
      ) : (
        <div className="w-12 h-12 rounded-full bg-surfaceAlt flex items-center justify-center text-textMuted mb-4">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4a2 2 0 00-2 2v1a2 2 0 01-2 2H9a2 2 0 01-2-2v-1a2 2 0 00-2-2H2"
            />
          </svg>
        </div>
      )}
      <h3 className="text-base font-semibold text-textPrimary mb-1 select-none">{title}</h3>
      <p className="text-sm text-textMuted max-w-sm mb-5 select-none">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
export default EmptyState;
