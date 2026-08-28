import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export const OfficerAIAssistantPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: 'Hello! I can assist you with KAVACH regulations, rest hour policies, or counseling referrals. What policy information can I help you find today?' }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setQuery('');

    // Simulate RAG reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Based on Section 4.2 of the Welfare Leave Directives, personnel experiencing consecutive active duty workload indicators exceeding 72 hours are entitled to a mandatory rest period of 24 hours. Welfare Officers can request voluntary check-in callbacks to log rest recommendations.`,
        }
      ]);
    }, 600);
  };

  return (
    <div className="space-y-6 select-none max-w-2xl mx-auto font-sans">
      <div>
        <h1 className="text-xl font-black text-textPrimary leading-tight">Welfare AI Assistant</h1>
        <p className="text-xs text-textMuted mt-0.5">Confidential assistant for verifying regulations and policies.</p>
      </div>

      <Card className="bg-surface p-5 border border-border/80 flex flex-col h-[400px]">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col max-w-[85%] p-3 rounded-md text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-primary text-white ml-auto'
                  : 'bg-surfaceAlt text-textSecondary border border-border'
              }`}
            >
              <span className="font-bold uppercase tracking-wider text-[8px] mb-1 opacity-80">
                {msg.sender === 'user' ? 'You' : 'Welfare AI'}
              </span>
              <span>{msg.text}</span>
            </div>
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={handleSend} className="flex gap-2 pt-4 border-t border-border mt-4">
          <div className="flex-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about rest leaves, circadian guidelines..."
              required
            />
          </div>
          <div className="flex-shrink-0 pt-6">
            <Button type="submit" variant="primary" className="font-bold">
              Ask AI
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
export default OfficerAIAssistantPage;
