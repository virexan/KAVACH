import React from 'react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className = '', id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col w-full gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-textSecondary select-none">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`w-full px-3 py-2 text-sm bg-surface border rounded-md border-border text-textPrimary appearance-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:bg-surfaceAlt pr-10 ${
              error ? 'border-danger focus:border-danger focus:ring-danger' : ''
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-textMuted">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && <span className="text-xs text-danger">{error}</span>}
        {!error && helperText && <span className="text-xs text-textMuted">{helperText}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';
export default Select;
