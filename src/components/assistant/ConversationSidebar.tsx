import React from 'react';
import type { Conversation } from '@/services/assistantService';

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
}

export const ConversationSidebar: React.FC<Props> = ({ conversations, activeId, onSelect, onCreate }) => {
  return (
    <div className="w-[260px] flex-shrink-0 border-r border-border h-full bg-surface select-none font-sans text-left flex flex-col justify-between">
      <div className="p-4 space-y-4">
        <button
          onClick={onCreate}
          className="w-full py-2.5 px-4 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 focus:outline-none font-sans"
        >
          <span>+</span> New Conversation (FR-29)
        </button>

        <div className="space-y-1">
          <span className="text-[9px] font-bold text-textMuted uppercase tracking-wider block mb-2 px-1">
            Recent Conversations (FR-28)
          </span>

          <div className="space-y-1 max-h-[60vh] overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`w-full p-2.5 rounded-lg text-xs text-left font-semibold truncate transition-colors focus:outline-none block font-sans ${
                  activeId === conv.id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-textSecondary hover:bg-surfaceAlt/60 border border-transparent'
                }`}
              >
                {conv.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border bg-surfaceAlt/20 text-[10px] text-textMuted leading-relaxed">
        🔒 Chats persist locally. Conversational data is secure.
      </div>
    </div>
  );
};
export default ConversationSidebar;
