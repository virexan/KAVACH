import React from 'react';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChangeValue: (value: number) => void;
  helperText?: string;
  error?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChangeValue,
  helperText,
  error,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      <div className="flex justify-between items-center">
        {label && <span className="text-xs font-semibold text-textSecondary select-none">{label}</span>}
        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChangeValue(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-surfaceAlt border border-border rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
        {...props}
      />
      <div className="flex justify-between text-[10px] text-textMuted select-none">
        <span>{min}</span>
        <span>{max}</span>
      </div>
      {error && <span className="text-xs text-danger">{error}</span>}
      {!error && helperText && <span className="text-xs text-textMuted">{helperText}</span>}
    </div>
  );
};
export default Slider;
