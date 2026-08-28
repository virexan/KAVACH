import React from 'react';
import Button from './Button';

export interface ErrorStateProps {
  icon?: React.ReactNode;
  title?: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  icon,
  title = 'Something went wrong',
  description,
  onRetry,
  retryLabel = 'Retry',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center border border-danger/10 rounded-lg bg-danger/5 ${className}`}>
      {icon ? (
        <div className="text-danger mb-4">{icon}</div>
      ) : (
        <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center text-danger mb-4">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      )}
      <h3 className="text-base font-semibold text-textPrimary mb-1 select-none">{title}</h3>
      <p className="text-sm text-textMuted max-w-sm mb-5 select-none">{description}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
};
export default ErrorState;
