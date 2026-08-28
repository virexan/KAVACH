import { mockResolve } from '@/lib/mockAdapter';
import type { ApiResponse } from '@/types/api';

export interface WelfareNotification {
  id: string;
  title: string;
  message: string;
  type: 'REMINDER' | 'ALERT' | 'UPDATE' | 'GENERAL';
  createdAt: string;
  read: boolean;
}

const mockNotifications: WelfareNotification[] = [
  {
    id: 'n-001',
    title: 'Daily Check-In Available',
    message: "Today's check-in is ready. Spend a moment checking in with yourself to track wellbeing trends.",
    type: 'REMINDER',
    createdAt: new Date().toISOString(),
    read: false,
  },
  {
    id: 'n-002',
    title: 'Support Suggestion Generated',
    message: 'A supportive rest and recovery recommendation has been updated based on sleep logs.',
    type: 'ALERT',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 'n-003',
    title: 'Privacy Consent Update',
    message: 'Data minimization terms have been clarified in v1.2 consent parameters.',
    type: 'UPDATE',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  }
];

export const notificationService = {
  async getNotifications(): Promise<ApiResponse<WelfareNotification[]>> {
    return mockResolve({ data: mockNotifications });
  }
};
export default notificationService;
