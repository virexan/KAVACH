import React from 'react';

export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioGroupProps {
  label?: string;
  name: string;
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  options,
  selectedValue,
  onChange,
  error,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <span className="text-xs font-semibold text-textSecondary select-none">{label}</span>}
      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const optionId = `${name}-${opt.value}`;
          return (
            <div key={opt.value} className="flex items-center gap-2.5">
              <input
                type="radio"
                id={optionId}
                name={name}
                value={opt.value}
                checked={selectedValue === opt.value}
                onChange={() => onChange(opt.value)}
                disabled={disabled}
                className="h-4 w-4 border-border text-primary focus:ring-primary disabled:opacity-50 cursor-pointer"
              />
              <label
                htmlFor={optionId}
                className="text-sm font-medium text-textSecondary select-none cursor-pointer"
              >
                {opt.label}
              </label>
            </div>
          );
        })}
      </div>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
};
export default RadioGroup;
