import { mockResolve } from '@/lib/mockAdapter';
import type { ApiResponse } from '@/types/api';

export type FollowUpType = 'WELFARE_CONVERSATION' | 'GENERAL_CHECK_IN' | 'SUPPORT_RESOURCES' | 'WORKLOAD_REVIEW' | 'LEAVE_REVIEW' | 'MONITORING' | 'OTHER';
export type FollowUpStatus = 'SCHEDULED' | 'DUE' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DEFERRED';
export type OutcomeType = 'NO_FURTHER_ACTION' | 'CONTINUE_MONITORING' | 'ADDITIONAL_FOLLOW_UP' | 'ADDITIONAL_SUPPORT';

export interface FollowUpOutcome {
  id: string;
  followUpId: string;
  outcome: OutcomeType;
  notes?: string;
  nextReviewDate?: string;
  recordedAt: string;
}

export interface FollowUp {
  id: string;
  caseId: string;
  personnelDisplayId: string;
  recommendationId?: string;
  type: FollowUpType;
  status: FollowUpStatus;
  scheduledFor?: string;
  createdAt: string;
  completedAt?: string;
  notes?: string;
  outcome?: FollowUpOutcome;
}

let mockFollowUps: FollowUp[] = [
  {
    id: 'int-201',
    caseId: 'case-001',
    personnelDisplayId: 'P-1042',
    recommendationId: 'rec-101',
    type: 'WELFARE_CONVERSATION',
    status: 'SCHEDULED',
    scheduledFor: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'int-202',
    caseId: 'case-002',
    personnelDisplayId: 'P-1043',
    recommendationId: 'rec-103',
    type: 'WORKLOAD_REVIEW',
    status: 'DUE',
    scheduledFor: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'int-203',
    caseId: 'case-003',
    personnelDisplayId: 'P-1044',
    type: 'GENERAL_CHECK_IN',
    status: 'IN_PROGRESS',
    scheduledFor: new Date().toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'int-204',
    caseId: 'case-004',
    personnelDisplayId: 'P-1045',
    type: 'WELFARE_CONVERSATION',
    status: 'COMPLETED',
    scheduledFor: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    outcome: {
      id: 'out-301',
      followUpId: 'int-204',
      outcome: 'CONTINUE_MONITORING',
      notes: 'Personnel responded positively. Advised resting schedules.',
      nextReviewDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      recordedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'int-205',
    caseId: 'case-006',
    personnelDisplayId: 'P-1047',
    type: 'SUPPORT_RESOURCES',
    status: 'CANCELLED',
    scheduledFor: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    notes: 'Member requested rescheduling due to active drills.'
  }
];

export const interventionService = {
  async getFollowUps(params: {
    status?: string;
    type?: string;
    caseId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<FollowUp[]>> {
    let filtered = [...mockFollowUps];
    const { status, type, caseId, page = 1, pageSize = 10 } = params;

    if (caseId) {
      filtered = filtered.filter((f) => f.caseId === caseId);
    }
    if (status && status !== 'ALL') {
      filtered = filtered.filter((f) => f.status === status);
    }
    if (type && type !== 'ALL') {
      filtered = filtered.filter((f) => f.type === type);
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

  async getFollowUpById(id: string): Promise<ApiResponse<FollowUp>> {
    const found = mockFollowUps.find((f) => f.id === id);
    if (!found) throw new Error('Intervention not found');
    return mockResolve({ data: found });
  },

  async createFollowUp(
    caseId: string,
    request: {
      recommendationId?: string;
      type: FollowUpType;
      scheduledFor?: string;
      description?: string;
    }
  ): Promise<ApiResponse<FollowUp>> {
    const newFollowUp: FollowUp = {
      id: `int-${Math.floor(Math.random() * 900) + 300}`,
      caseId,
      personnelDisplayId: 'P-1042', // Mock fallback display
      recommendationId: request.recommendationId,
      type: request.type,
      status: 'SCHEDULED',
      scheduledFor: request.scheduledFor,
      createdAt: new Date().toISOString(),
      notes: request.description
    };
    
    mockFollowUps.unshift(newFollowUp);
    console.log(`[AUDIT_LOG] FOLLOW_UP_CREATED - CaseId: ${caseId} - Type: ${request.type}`);
    return mockResolve({ data: newFollowUp });
  },

  async updateFollowUp(
    id: string,
    updates: {
      status?: FollowUpStatus;
      scheduledFor?: string;
      notes?: string;
    }
  ): Promise<ApiResponse<FollowUp>> {
    const found = mockFollowUps.find((f) => f.id === id);
    if (!found) throw new Error('Intervention not found');

    if (updates.status) {
      found.status = updates.status;
      console.log(`[AUDIT_LOG] FOLLOW_UP_STATUS_CHANGED - Id: ${id} - Status: ${updates.status}`);
    }
    if (updates.scheduledFor) {
      found.scheduledFor = updates.scheduledFor;
      console.log(`[AUDIT_LOG] FOLLOW_UP_RESCHEDULED - Id: ${id} - Scheduled: ${updates.scheduledFor}`);
    }
    if (updates.notes) {
      found.notes = updates.notes;
    }

    return mockResolve({ data: found });
  },

  async recordOutcome(
    followUpId: string,
    request: {
      outcome: OutcomeType;
      notes?: string;
      nextReviewDate?: string;
    }
  ): Promise<ApiResponse<FollowUpOutcome>> {
    const found = mockFollowUps.find((f) => f.id === followUpId);
    if (!found) throw new Error('Intervention not found');

    const newOutcome: FollowUpOutcome = {
      id: `out-${Math.floor(Math.random() * 900) + 300}`,
      followUpId,
      outcome: request.outcome,
      notes: request.notes,
      nextReviewDate: request.nextReviewDate,
      recordedAt: new Date().toISOString()
    };

    found.status = 'COMPLETED';
    found.completedAt = new Date().toISOString();
    found.outcome = newOutcome;

    console.log(`[AUDIT_LOG] OUTCOME_RECORDED - FollowUpId: ${followUpId} - Outcome: ${request.outcome}`);
    return mockResolve({ data: newOutcome });
  }
};

export default interventionService;
