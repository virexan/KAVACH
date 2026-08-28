import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import assistantService from '@/services/assistantService';
import type { SourceCitation, UserRole } from '@/services/assistantService';
import AssistantHeader from '@/components/assistant/AssistantHeader';
import ConversationSidebar from '@/components/assistant/ConversationSidebar';
import ChatInput from '@/components/assistant/ChatInput';
import ChatMessage from '@/components/assistant/ChatMessage';
import SuggestedQuestions from '@/components/assistant/SuggestedQuestions';
import SourceDrawer from '@/components/assistant/SourceDrawer';
import Card from '@/components/ui/Card';

export const AssistantPage: React.FC = () => {
  const { user } = useAuthStore();
  const currentRole: UserRole = (user?.role || 'PERSONNEL') as UserRole;

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [selectedCitation, setSelectedCitation] = useState<SourceCitation | null>(null);

  const { data: convsRes, refetch: refetchConvs } = useQuery({
    queryKey: ['assistant-conversations-list'],
    queryFn: () => assistantService.getConversations(),
  });

  const { data: activeConvRes, refetch: refetchActiveConv } = useQuery({
    queryKey: ['assistant-active-conversation', activeConvId],
    queryFn: () => assistantService.getConversation(activeConvId!),
    enabled: !!activeConvId,
  });

  const createMutation = useMutation({
    mutationFn: () => assistantService.createConversation(currentRole),
    onSuccess: (res) => {
      setActiveConvId(res.data.id);
      refetchConvs();
    }
  });

  const askMutation = useMutation({
    mutationFn: (message: string) =>
      assistantService.askQuestion({
        conversationId: activeConvId!,
        message,
        role: currentRole,
      }),
    onSuccess: () => {
      refetchActiveConv();
      refetchConvs();
    }
  });

  const handleSend = (text: string) => {
    if (!activeConvId) {
      createMutation.mutate(undefined, {
        onSuccess: (res) => {
          assistantService.askQuestion({
            conversationId: res.data.id,
            message: text,
            role: currentRole
          }).then(() => {
            setActiveConvId(res.data.id);
            refetchActiveConv();
            refetchConvs();
          });
        }
      });
    } else {
      askMutation.mutate(text);
    }
  };

  const conversations = convsRes?.data || [];
  const activeConversation = activeConvRes?.data;
  const messages = activeConversation?.messages || [];
  const suggestedPrompts = assistantService.getSuggestedPrompts(currentRole);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Answer content copied to clipboard.');
  };

  return (
    <div className="flex h-[80vh] border border-border rounded-xl bg-surface select-none font-sans text-left animate-fadeIn overflow-hidden">
      {/* Sidebar history */}
      <div className="hidden md:block">
        <ConversationSidebar
          conversations={conversations}
          activeId={activeConvId}
          onSelect={setActiveConvId}
          onCreate={() => createMutation.mutate()}
        />
      </div>

      {/* Main chat window */}
      <div className="flex-1 flex flex-col justify-between h-full bg-surfaceAlt/10 relative p-6 font-sans">
        <div className="space-y-4 overflow-y-auto flex-1 pr-2 pb-6">
          <AssistantHeader />

          {/* Messages list */}
          {messages.length === 0 ? (
            <div className="space-y-6 py-6 animate-fadeIn font-sans">
              <Card className="p-6 border border-border bg-surface text-center max-w-lg mx-auto space-y-3 font-sans">
                <h3 className="text-base font-bold text-textPrimary">How can I assist you?</h3>
                <p className="text-xs text-textSecondary leading-relaxed font-sans">
                  I can analyze aggregate unit trends, explain specific risk profile signals, or check approved welfare and recovery procedures. Ask a query below or select a suggested prompt matching your credentials.
                </p>
              </Card>

              <div className="max-w-lg mx-auto font-sans">
                <SuggestedQuestions
                  suggestions={suggestedPrompts}
                  onSelect={handleSend}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6 pt-4 font-sans">
              {messages.map((m) => (
                <ChatMessage
                  key={m.id}
                  message={m}
                  onSelectCitation={setSelectedCitation}
                  onCopy={handleCopy}
                />
              ))}

              {askMutation.isPending && (
                <div className="flex justify-start select-none font-sans text-left items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  <span className="text-[10px] text-textMuted font-bold uppercase animate-pulse font-sans">
                    AI is thinking... (FR-33)
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input box & Disclaimer */}
        <div className="border-t border-border/40 pt-4 space-y-3">
          <ChatInput onSend={handleSend} isLoading={askMutation.isPending} />
          
          <p className="text-[9px] text-textMuted leading-relaxed text-center font-medium font-sans">
            ⚠️ <strong>AI Disclosure (FR-37):</strong> AI responses support decision-making. Verify details against approved guidelines. The assistant does not provide medical or psychological diagnosis.
          </p>
        </div>
      </div>

      {/* RAG Source drawer */}
      <SourceDrawer
        citation={selectedCitation}
        onClose={() => setSelectedCitation(null)}
      />
    </div>
  );
};
export default AssistantPage;
