import React from 'react';
import Card from '../ui/Card';
import Toggle from '../ui/Toggle';

interface ToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  statusText: string;
  disabled?: boolean;
}

export const ConsentToggle: React.FC<ToggleProps> = ({
  label,
  description,
  checked,
  onChange,
  statusText,
  disabled = false,
}) => {
  return (
    <Card className="bg-surface p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none animate-fadeIn">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-textPrimary text-sm">{label}</h4>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
            checked 
              ? 'bg-success/10 text-success border-success/10'
              : 'bg-surfaceAlt text-textSecondary border-border'
          }`}>
            {statusText}
          </span>
        </div>
        <p className="text-xs text-textSecondary leading-relaxed max-w-xl">
          {description}
        </p>
      </div>

      <div className="flex-shrink-0">
        <Toggle
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </Card>
  );
};
export default ConsentToggle;
