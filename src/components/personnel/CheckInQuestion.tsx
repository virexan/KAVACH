import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export interface QuestionOption {
  label: string;
  value: number;
  icon?: string;
}

interface QuestionProps {
  questionTitle: string;
  questionDescription?: string;
  options: QuestionOption[];
  selectedValue: number | null;
  onSelect: (value: number) => void;
  onNext: () => void;
  onBack?: () => void;
  isFirst?: boolean;
}

export const CheckInQuestion: React.FC<QuestionProps> = ({
  questionTitle,
  questionDescription,
  options,
  selectedValue,
  onSelect,
  onNext,
  onBack,
  isFirst = false,
}) => {
  return (
    <Card className="bg-surface p-6 space-y-6">
      <div className="space-y-1.5 select-none">
        <h3 className="text-lg font-bold text-textPrimary leading-tight">{questionTitle}</h3>
        {questionDescription && <p className="text-sm text-textMuted">{questionDescription}</p>}
      </div>

      <div className="flex flex-col gap-2.5">
        {options.map((opt) => {
          const isSelected = selectedValue === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={`w-full min-h-[48px] px-4 py-3 rounded-md text-sm font-semibold border flex items-center gap-3 transition-colors text-left focus:outline-none ${
                isSelected
                  ? 'bg-primary/10 text-primary border-primary'
                  : 'bg-surface border-border text-textSecondary hover:bg-surfaceAlt'
              }`}
            >
              {opt.icon && <span className="text-lg">{opt.icon}</span>}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-border/60">
        {onBack && !isFirst ? (
          <Button variant="secondary" size="sm" onClick={onBack}>
            Previous
          </Button>
        ) : (
          <div />
        )}
        <Button variant="primary" size="sm" onClick={onNext} disabled={selectedValue === null}>
          Next
        </Button>
      </div>
    </Card>
  );
};
export default CheckInQuestion;
