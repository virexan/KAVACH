import React, { useState } from 'react';
import Button from '../ui/Button';

interface Props {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<Props> = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const CHAR_LIMIT = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (text.trim() && !isLoading) {
        onSend(text.trim());
        setText('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-border rounded-lg bg-surface p-2 space-y-2 select-none font-sans text-left">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, CHAR_LIMIT))}
        onKeyDown={handleKeyDown}
        placeholder="Ask about welfare, workload or policies... (FR-31)"
        disabled={isLoading}
        rows={2}
        className="w-full p-2 border-0 bg-transparent text-textPrimary text-xs focus:ring-0 focus:outline-none resize-none disabled:opacity-60 font-sans"
      />

      <div className="flex justify-between items-center border-t border-border/30 pt-2 text-[10px] text-textMuted font-medium font-sans">
        <span>
          {text.length} / {CHAR_LIMIT} chars
        </span>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!text.trim() || isLoading}
          isLoading={isLoading}
          className="font-bold"
        >
          Send
        </Button>
      </div>
    </form>
  );
};
export default ChatInput;
