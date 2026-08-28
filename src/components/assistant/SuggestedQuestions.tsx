import React from 'react';
import type { SuggestedQuestion } from '@/services/assistantService';

interface Props {
  suggestions: SuggestedQuestion[];
  onSelect: (text: string) => void;
}

export const SuggestedQuestions: React.FC<Props> = ({ suggestions, onSelect }) => {
  return (
    <div className="space-y-2 select-none font-sans text-left">
      <span className="text-[9px] font-bold text-textMuted uppercase tracking-wider block px-1">
        Suggested Questions
      </span>
      <div className="flex flex-wrap gap-2 font-sans">
        {suggestions.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.text)}
            className="px-3 py-1.5 bg-surface border border-border text-textSecondary text-xs font-semibold rounded-lg hover:border-primary hover:text-primary transition-all focus:outline-none font-sans"
          >
            {s.text}
          </button>
        ))}
      </div>
    </div>
  );
};
export default SuggestedQuestions;
