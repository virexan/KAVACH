import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const checkboxId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-2.5">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={`mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-background disabled:opacity-50 cursor-pointer ${className}`}
            {...props}
          />
          <label htmlFor={checkboxId} className="text-sm font-medium text-textSecondary select-none cursor-pointer">
            {label}
          </label>
        </div>
        {error && <span className="text-xs text-danger pl-6">{error}</span>}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
export default Checkbox;
