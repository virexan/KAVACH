import { mockResolve } from '@/lib/mockAdapter';
import type { ApiResponse } from '@/types/api';

export type RecommendationCategory = 'WORKLOAD' | 'REST_AND_RECOVERY' | 'LEAVE' | 'WELFARE_SUPPORT' | 'FOLLOW_UP' | 'MONITORING' | 'GENERAL_WELLBEING';
export type RecommendationPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type RecommendationStatus = 'NEW' | 'REVIEWED' | 'ACCEPTED' | 'DISMISSED' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';

export interface Recommendation {
  id: string;
  caseId: string;
  personnelDisplayId: string;
  title: string;
  description: string;
  category: RecommendationCategory;
  priority: RecommendationPriority;
  trigger: string;
  context: string;
  consideration: string;
  status: RecommendationStatus;
  generatedAt: string;
  expiresAt?: string;
  dismissReason?: string;
  notes?: string;
}

// Backward compatibility type for Personnel Experience (PRD 3)
export interface PersonalRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  createdAt?: string;
  generatedAt?: string;
  status: string;
}

let mockRecommendations: Recommendation[] = [
  {
    id: 'rec-101',
    caseId: 'case-001',
    personnelDisplayId: 'P-1042',
    title: 'Review Current Workload Allocation',
    description: 'Review active duties to identify opportunities for shift rotation or resting leaves.',
    category: 'WORKLOAD',
    priority: 'HIGH',
    trigger: 'Weekly active workload index exceeded circadian thresholds.',
    context: 'Recent workload index increased over the 14-day assessment period alongside sleep quality decline.',
    consideration: 'Consider whether current duty allocation can be adjusted or rotated where operationally feasible.',
    status: 'NEW',
    generatedAt: new Date().toISOString()
  },
  {
    id: 'rec-102',
    caseId: 'case-001',
    personnelDisplayId: 'P-1042',
    title: 'Offer Voluntary Welfare Check-In',
    description: 'Schedule a confidential follow-up check-in conversation.',
    category: 'WELFARE_SUPPORT',
    priority: 'MEDIUM',
    trigger: 'Consistently declining self-reported stress indicators.',
    context: 'Voluntary wellness sleep scores fell below 5/10 over the last 3 checks.',
    consideration: 'Offer the personnel member a voluntary check-in to discuss rest and counseling options.',
    status: 'NEW',
    generatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rec-103',
    caseId: 'case-002',
    personnelDisplayId: 'P-1043',
    title: 'Enforce Rest and Recovery Schedule',
    description: 'Temporary relief from active continuous duty rotations.',
    category: 'REST_AND_RECOVERY',
    priority: 'HIGH',
    trigger: 'Extended deployment duties exceeding circadian safe thresholds.',
    context: 'Deployment days exceeded 24 continuous active duty hours.',
    consideration: 'Coordinate with commander sections to schedule a mandatory 24-hour fatigue recovery block.',
    status: 'NEW',
    generatedAt: new Date().toISOString()
  },
  {
    id: 'rec-104',
    caseId: 'case-003',
    personnelDisplayId: 'P-1044',
    title: 'Monitor Sleep Hygiene Trends',
    description: 'Track sleep patterns without active interventions.',
    category: 'MONITORING',
    priority: 'LOW',
    trigger: 'Slightly fragmented sleep cycles.',
    context: 'Sleep averages are stable but remain below recommended limits.',
    consideration: 'No active casework needed. Continue monitoring next wellness check-in cycles.',
    status: 'ACCEPTED',
    generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const recommendationService = {
  // Make params optional for backward compatibility
  async getRecommendations(params: {
    status?: string;
    priority?: string;
    category?: string;
    caseId?: string;
    page?: number;
    pageSize?: number;
  } = {}): Promise<ApiResponse<Recommendation[]>> {
    let filtered = [...mockRecommendations];
    const { status, priority, category, caseId, page = 1, pageSize = 10 } = params;

    if (caseId) {
      filtered = filtered.filter((r) => r.caseId === caseId);
    }
    if (status && status !== 'ALL') {
      filtered = filtered.filter((r) => r.status === status);
    }
    if (priority && priority !== 'ALL') {
      filtered = filtered.filter((r) => r.priority === priority);
    }
    if (category && category !== 'ALL') {
      filtered = filtered.filter((r) => r.category === category);
    }

    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return mockResolve({
      data: paginated,
      meta: {
        page,
        pageSize,
        total: filtered.length
      }
    });
  },

  async getRecommendationById(id: string): Promise<ApiResponse<Recommendation>> {
    const found = mockRecommendations.find((r) => r.id === id);
    if (!found) throw new Error('Recommendation not found');
    return mockResolve({ data: found });
  },

  async acceptRecommendation(id: string, notes?: string): Promise<ApiResponse<{ success: boolean; updatedAt: string }>> {
    const found = mockRecommendations.find((r) => r.id === id);
    if (found) {
      found.status = 'ACCEPTED';
      found.notes = notes;
    }
    console.log(`[AUDIT_LOG] RECOMMENDATION_ACCEPTED - RecId: ${id}`);
    return mockResolve({
      data: {
        success: true,
        updatedAt: new Date().toISOString()
      }
    });
  },

  async dismissRecommendation(
    id: string,
    reason: string,
    notes?: string
  ): Promise<ApiResponse<{ success: boolean; updatedAt: string }>> {
    const found = mockRecommendations.find((r) => r.id === id);
    if (found) {
      found.status = 'DISMISSED';
      found.dismissReason = reason;
      found.notes = notes;
    }
    console.log(`[AUDIT_LOG] RECOMMENDATION_DISMISSED - RecId: ${id} - Reason: ${reason}`);
    return mockResolve({
      data: {
        success: true,
        updatedAt: new Date().toISOString()
      }
    });
  }
};

export default recommendationService;
