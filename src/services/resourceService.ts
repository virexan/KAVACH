import { mockResolve } from '@/lib/mockAdapter';
import type { ApiResponse } from '@/types/api';

export interface WelfareResource {
  id: string;
  title: string;
  description: string;
  category: 'Welfare Support' | 'Counselling' | 'Leave Info' | 'Rest & Recovery' | 'Emergency';
  contactInfo?: string;
  actionLabel?: string;
}

export const resourceService = {
  async getResources(): Promise<ApiResponse<WelfareResource[]>> {
    const list: WelfareResource[] = [
      {
        id: 'res-001',
        title: 'Confidential Counselling Hotline',
        description: 'Toll-free 24/7 mental wellness support and coping guidance for personnel and families.',
        category: 'Counselling',
        contactInfo: '1800-11-KAVACH (Ext: Welfare)',
        actionLabel: 'Call Hotline',
      },
      {
        id: 'res-002',
        title: 'Sleep Hygiene Protocols',
        description: 'Command wellness guide for maintaining sleep quality and cycles inside shared base rooms.',
        category: 'Rest & Recovery',
        actionLabel: 'Open Document',
      },
      {
        id: 'res-003',
        title: 'Welfare Leave Regulations',
        description: 'Guide explaining rapid approval criteria for voluntary rest leaves and fatigue recovery cycles.',
        category: 'Leave Info',
        contactInfo: 'Welfare Section Office',
        actionLabel: 'View Regulations',
      },
      {
        id: 'res-004',
        title: 'Crisis Triage Unit',
        description: 'Medical and mental wellness emergency response cells staffed by qualified support practitioners.',
        category: 'Emergency',
        contactInfo: 'Building A, Unit Medical Wing',
        actionLabel: 'Find Wing',
      }
    ];
    return mockResolve({ data: list });
  },

  async requestSupport(): Promise<ApiResponse<{ status: string; ticketId: string }>> {
    const ticketId = `WFC-${Math.floor(Math.random() * 90000 + 10000)}`;
    return mockResolve({
      data: {
        status: 'SUBMITTED',
        ticketId,
      }
    });
  }
};
export default resourceService;
