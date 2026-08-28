import React from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col w-full gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-semibold text-textSecondary select-none">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`w-full px-3 py-2 text-sm bg-surface border rounded-md border-border text-textPrimary placeholder-textMuted/60 transition-colors focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:bg-surfaceAlt min-h-[80px] ${
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
TextArea.displayName = 'TextArea';
export default TextArea;
