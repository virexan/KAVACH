import { mockResolve } from '@/lib/mockAdapter';
import type { ApiResponse } from '@/types/api';

export type UserRole = 'PERSONNEL' | 'WELFARE_OFFICER' | 'COMMANDER' | 'ADMIN';

export interface SourceCitation {
  id: string;
  title: string;
  sourceType: 'POLICY' | 'GUIDELINE' | 'ANALYTICS' | 'CASE_DATA' | 'WORKLOAD_DATA' | 'SYSTEM_DOCUMENT';
  excerpt?: string;
  section?: string;
  updatedAt?: string;
  relevance?: number;
}

export interface AssistantMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  citations?: SourceCitation[];
  evidence?: 'GROUNDED' | 'PARTIALLY_GROUNDED' | 'INSUFFICIENT_INFORMATION';
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
  messages: AssistantMessage[];
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  category: 'RISK' | 'WORKLOAD' | 'POLICY' | 'SUPPORT' | 'TREND';
}

export interface KnowledgeSource {
  id: string;
  title: string;
  type: string;
  version?: string;
  updatedAt?: string;
  content: string;
  relevantSections?: string[];
}

// Seed Mock Documents (FR-54)
const mockKnowledgeBase: KnowledgeSource[] = [
  {
    id: 'doc-01',
    title: 'Welfare Follow-Up Procedure',
    type: 'Procedure',
    version: 'v1.2',
    updatedAt: '2026-08-15',
    content: 'Section 4: Follow-Up Scheduling. After any elevated or high risk signal is acknowledged by an authorized Welfare Officer, a follow-up action must be scheduled within 48 hours. Follow-up options include counseling syncs, medical reviews, roster adjustments, or training pauses. All intervention details are securely logged.',
    relevantSections: ['Section 4 — Follow-Up Scheduling']
  },
  {
    id: 'doc-02',
    title: 'Personnel Wellness Policy',
    type: 'Policy',
    version: 'v2.0',
    updatedAt: '2026-08-01',
    content: 'Section 2: Voluntary Data Sharing. Personnel retain absolute ownership of voluntary wellness answers. Consent can be updated at any time in the settings page. Data is isolated from command portals and only accessible to authorized welfare officers during active alerts.',
    relevantSections: ['Section 2 — Voluntary Data Consent']
  },
  {
    id: 'doc-03',
    title: 'Workload Management Guidelines',
    type: 'Guideline',
    version: 'v1.1',
    updatedAt: '2026-07-20',
    content: 'Section 5: Duty Load Caps. Standard weekly duty hours should not exceed 48 hours during baseline operational cycles. Any shift spike above 55 hours triggers alert signals to indicate potential fatigue accumulation.',
    relevantSections: ['Section 5 — Duty Hour Bounds']
  },
  {
    id: 'doc-04',
    title: 'Commander Welfare Guidelines',
    type: 'Guideline',
    version: 'v1.0',
    updatedAt: '2026-08-25',
    content: 'Section 3: Aggregate Response Actions. When unit-level stress counts increase, leadership should consider: 1. Distributing duty loads across subunits, 2. Reviewing leave backlogs to encourage recovery windows, 3. Syncing with assigned Welfare Officers to verify support availability.',
    relevantSections: ['Section 3 — Commander Response Actions']
  }
];

// Seed Conversations
let mockConversations: Conversation[] = [
  {
    id: 'conv-01',
    title: 'Unit 7 Welfare Trend Explanation',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    role: 'COMMANDER',
    messages: [
      {
        id: 'msg-01-1',
        role: 'USER',
        content: 'Why is Unit 7\'s welfare risk increasing?',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'msg-01-2',
        role: 'ASSISTANT',
        content: 'The aggregate welfare-risk signal for Unit 7 has increased during the selected reporting cycle. The main associated factors are: 1. Increased weekly duty hours (averaging 54.2 hours, a 12% rise), 2. Higher deployment duration loads (up 8%), 3. Decreased leave utilization (down 6%). These factors are associated with the observed trend and do not establish direct causation.',
        citations: [
          { id: 'cit-01', title: 'Unit 7 Welfare Trends', sourceType: 'ANALYTICS', section: 'Aggregate Risk History', updatedAt: '2026-08-28' },
          { id: 'cit-02', title: 'Workload Analytics Summary', sourceType: 'WORKLOAD_DATA', section: 'Duty & Deployment Roster', updatedAt: '2026-08-28' }
        ],
        evidence: 'GROUNDED',
        createdAt: new Date(Date.now() - 3590000).toISOString()
      }
    ]
  }
];

export const assistantService = {
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    return mockResolve({ data: mockConversations });
  },

  async getConversation(id: string): Promise<ApiResponse<Conversation>> {
    const found = mockConversations.find((c) => c.id === id);
    if (!found) throw new Error('Conversation not found');
    return mockResolve({ data: found });
  },

  async createConversation(role: UserRole = 'PERSONNEL'): Promise<ApiResponse<Conversation>> {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role,
      messages: []
    };
    mockConversations.unshift(newConv);
    return mockResolve({ data: newConv });
  },

  async askQuestion(params: {
    conversationId: string;
    message: string;
    role: UserRole;
  }): Promise<ApiResponse<AssistantMessage>> {
    const { conversationId, message, role } = params;
    const conv = mockConversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.updatedAt = new Date().toISOString();
      if (conv.messages.length === 0) {
        conv.title = message.length > 25 ? `${message.substring(0, 25)}...` : message;
      }
    }

    const qLower = message.toLowerCase();
    let reply = '';
    let citations: SourceCitation[] = [];
    let evidence: 'GROUNDED' | 'PARTIALLY_GROUNDED' | 'INSUFFICIENT_INFORMATION' = 'GROUNDED';

    // 1. Role boundaries checks (FR-22, FR-56)
    if (role === 'COMMANDER' && (qLower.includes('who is') || qLower.includes('individual') || qLower.includes('names') || qLower.includes('high risk personnel'))) {
      reply = 'Individual welfare-risk details and personnel identifiers are restricted in the Commander analytics portal. I can summarize unit-level stress proportions, workload averages, and anonymous trends instead.';
      evidence = 'INSUFFICIENT_INFORMATION';
    }
    else if (role === 'PERSONNEL' && (qLower.includes('other') || qLower.includes('officer') || qLower.includes('case'))) {
      reply = 'Access Denied: Personnel accounts are restricted from accessing case details or another member\'s check-in records. You can ask about your own wellbeing summaries and resource guides.';
      evidence = 'INSUFFICIENT_INFORMATION';
    }
    // 2. Mock RAG Matchers (FR-53)
    else if (qLower.includes('unit 7') && qLower.includes('risk')) {
      reply = 'The aggregate welfare-risk signal for Unit 7 has increased during the selected reporting cycle. The main associated factors are: 1. Increased weekly duty hours (averaging 54.2 hours, a 12% rise), 2. Higher deployment duration loads (up 8%), 3. Decreased leave utilization (down 6%). These factors are associated with the observed trend and do not establish direct causation.';
      citations = [
        { id: 'cit-01', title: 'Unit 7 Welfare Trends', sourceType: 'ANALYTICS', section: 'Aggregate Risk History', updatedAt: '2026-08-28' },
        { id: 'cit-02', title: 'Workload Analytics Summary', sourceType: 'WORKLOAD_DATA', section: 'Duty & Deployment Roster', updatedAt: '2026-08-28' }
      ];
      evidence = 'GROUNDED';
    }
    else if (qLower.includes('case') && qLower.includes('elevated')) {
      reply = 'Case P-1042 risk is currently elevated. The primary contributing factors retrieved from voluntary check-ins and logs are: 1. Fatigue index spikes matching consecutive 12-hour night rosters, 2. Self-reported sleep duration dropping to 4.5 hours, 3. Overlapping training cycles. Roster adjustments are recommended to mitigate risk.';
      citations = [
        { id: 'cit-03', title: 'Case P-1042 Risk Profile', sourceType: 'CASE_DATA', section: 'Explainability Metrics', updatedAt: '2026-08-28' },
        { id: 'cit-04', title: 'Check-In Wellness Trends', sourceType: 'CASE_DATA', section: 'Sleep logs history', updatedAt: '2026-08-28' }
      ];
      evidence = 'GROUNDED';
    }
    else if (qLower.includes('follow-up') && qLower.includes('policy')) {
      reply = 'According to the approved Welfare Follow-Up Procedure (v1.2), after any elevated risk alert is acknowledged by a Welfare Officer, a supportive follow-up action must be scheduled within 48 hours. Options include counseling syncs, roster adjustments, or training pauses. All records must preserve confidentiality.';
      citations = [
        { id: 'cit-05', title: 'Welfare Follow-Up Procedure', sourceType: 'POLICY', section: 'Section 4 — Follow-Up Scheduling', updatedAt: '2026-08-15' }
      ];
      evidence = 'GROUNDED';
    }
    else if (qLower.includes('leadership') || qLower.includes('consider') || qLower.includes('action')) {
      reply = 'When unit-level welfare stress indices rise, the approved Commander guidelines suggest: 1. Reviewing duty allocations to distribute workloads, 2. Checking leaves backlog to encourage recovery windows, 3. Syncing with Welfare Officers to confirm local counseling availability.';
      citations = [
        { id: 'cit-06', title: 'Commander Welfare Guidelines', sourceType: 'GUIDELINE', section: 'Section 3 — Leadership Response Actions', updatedAt: '2026-08-25' }
      ];
      evidence = 'GROUNDED';
    }
    // 3. Fallback (FR-21, FR-73)
    else {
      reply = 'I don\'t have enough grounded information to answer that question reliably. Available RAG knowledge documents do not include data required for this query. You could try asking about: 1. Unit 7 risk trends, 2. Case risk factors, 3. Follow-up scheduling policies, or 4. Leadership support guidelines.';
      evidence = 'INSUFFICIENT_INFORMATION';
    }

    const aiMessage: AssistantMessage = {
      id: `msg-${Date.now()}`,
      role: 'ASSISTANT',
      content: reply,
      citations,
      evidence,
      createdAt: new Date().toISOString()
    };

    if (conv) {
      conv.messages.push({
        id: `msg-usr-${Date.now()}`,
        role: 'USER',
        content: message,
        createdAt: new Date().toISOString()
      });
      conv.messages.push(aiMessage);
    }

    return mockResolve({ data: aiMessage });
  },

  getSuggestedPrompts(role: UserRole): SuggestedQuestion[] {
    switch (role) {
      case 'PERSONNEL':
        return [
          { id: 'p-1', text: 'What support resources are available?', category: 'SUPPORT' },
          { id: 'p-2', text: 'How can I improve my rest and recovery?', category: 'POLICY' },
          { id: 'p-3', text: 'What does my voluntary data consent cover?', category: 'POLICY' }
        ];
      case 'WELFARE_OFFICER':
        return [
          { id: 'o-1', text: 'Why is this case currently elevated?', category: 'RISK' },
          { id: 'o-2', text: 'What does the welfare follow-up policy say?', category: 'POLICY' },
          { id: 'o-3', text: 'Summarize factors contributing to elevations.', category: 'TREND' }
        ];
      case 'COMMANDER':
        return [
          { id: 'c-1', text: 'Why is Unit 7\'s welfare risk increasing?', category: 'TREND' },
          { id: 'c-2', text: 'What supportive options could leadership consider?', category: 'SUPPORT' },
          { id: 'c-3', text: 'Summarize Unit 7 workload shifts.', category: 'WORKLOAD' }
        ];
      default:
        return [
          { id: 'a-1', text: 'Explain the current platform consent policies.', category: 'POLICY' },
          { id: 'a-2', text: 'Show active ML risk model details.', category: 'POLICY' }
        ];
    }
  },

  async searchKnowledge(query: string): Promise<ApiResponse<KnowledgeSource[]>> {
    let list = [...mockKnowledgeBase];
    if (query) {
      list = list.filter((d) => d.title.toLowerCase().includes(query.toLowerCase()) || d.content.toLowerCase().includes(query.toLowerCase()));
    }
    return mockResolve({ data: list });
  }
};

export default assistantService;
