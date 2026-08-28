import React from 'react';
import type { AssistantMessage, SourceCitation } from '@/services/assistantService';

interface Props {
  message: AssistantMessage;
  onSelectCitation?: (citation: SourceCitation) => void;
  onCopy?: (text: string) => void;
}

export const ChatMessage: React.FC<Props> = ({ message, onSelectCitation, onCopy }) => {
  const isUser = message.role === 'USER';

  if (isUser) {
    return (
      <div className="flex justify-end select-none font-sans text-left animate-fadeIn">
        <div className="max-w-[70%] bg-primary/10 border border-primary/20 text-textPrimary px-4 py-2.5 rounded-2xl rounded-tr-none text-xs font-semibold leading-relaxed">
          {message.content}
        </div>
      </div>
    );
  }

  const getEvidenceBadge = (ev: string) => {
    switch (ev) {
      case 'GROUNDED':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded uppercase tracking-wider font-sans">
            ✓ Grounded in available data (FR-20)
          </span>
        );
      case 'PARTIALLY_GROUNDED':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-warning bg-warning/10 border border-warning/20 px-2 py-0.5 rounded uppercase tracking-wider font-sans">
            ⚠ Partially Grounded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-danger bg-danger/10 border border-danger/20 px-2 py-0.5 rounded uppercase tracking-wider font-sans">
            ⚠ Insufficient policy grounding (FR-21)
          </span>
        );
    }
  };

  return (
    <div className="flex justify-start select-none font-sans text-left space-y-3 flex-col max-w-[85%] animate-fadeIn">
      {/* Evidence Tag */}
      <div>{getEvidenceBadge(message.evidence || 'GROUNDED')}</div>

      {/* Answer Block */}
      <div className="bg-surface border border-border text-textSecondary px-5 py-4 rounded-2xl rounded-tl-none text-xs leading-relaxed font-sans space-y-4">
        <div className="whitespace-pre-line font-medium font-sans leading-relaxed">{message.content}</div>

        {/* Citations List (FR-17) */}
        {message.citations && message.citations.length > 0 && (
          <div className="border-t border-border/40 pt-3 space-y-2">
            <span className="text-[9px] font-bold text-textMuted uppercase block">
              Sources & Evidence Citations
            </span>
            <div className="flex flex-wrap gap-2">
              {message.citations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectCitation?.(c)}
                  className="px-2 py-1 border border-border/80 hover:border-primary bg-surfaceAlt/30 text-[10px] text-textSecondary hover:text-primary rounded font-semibold transition-colors flex items-center gap-1 focus:outline-none font-sans"
                >
                  📄 {c.title} <span className="text-textMuted text-[8px] font-medium">({c.section || c.sourceType})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions (FR-35) */}
        <div className="flex gap-4 justify-end border-t border-border/30 pt-2 text-[10px] font-bold text-textMuted uppercase font-sans">
          <button
            onClick={() => onCopy?.(message.content)}
            className="hover:text-primary transition-colors focus:outline-none font-sans"
          >
            Copy Answer
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatMessage;
