import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col w-full gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-textSecondary select-none">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-3 py-2 text-sm bg-surface border rounded-md border-border text-textPrimary placeholder-textMuted/60 transition-colors focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:bg-surfaceAlt ${
            error ? 'border-danger focus:border-danger focus:ring-danger' : ''
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-danger">{error}</span>}
        {!error && helperText && <span className="text-xs text-textMuted">{helperText}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
export default Input;
