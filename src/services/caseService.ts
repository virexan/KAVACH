import { mockResolve } from '@/lib/mockAdapter';
import type { ApiResponse } from '@/types/api';

export type RiskFactorType = 'WORKLOAD' | 'DEPLOYMENT' | 'SLEEP' | 'LEAVE' | 'SELF_REPORT' | 'OTHER';

export interface RiskFactorSummary {
  factor: RiskFactorType;
  severity: 'LOW' | 'MODERATE' | 'HIGH';
  label: string;
}

export interface WelfareCase {
  id: string;
  personnelId: string;
  personnelDisplayId: string;
  unitId: string;
  riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'INSUFFICIENT_DATA';
  trend: 'IMPROVING' | 'STABLE' | 'INCREASING' | 'INSUFFICIENT_DATA';
  confidence?: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  primaryFactors: RiskFactorSummary[];
  lastAssessmentAt: string;
  followUpStatus: 'NOT_REQUIRED' | 'REQUIRED' | 'DUE' | 'IN_PROGRESS' | 'COMPLETED';
  status: 'NEW' | 'REVIEW_REQUIRED' | 'ACKNOWLEDGED' | 'FOLLOW_UP_REQUIRED' | 'IN_PROGRESS' | 'MONITORING' | 'RESOLVED';
  nextFollowUpDate?: string;
  notes?: string;
}

export interface WelfareAlert {
  id: string;
  caseId: string;
  type: 'NEW_RISK' | 'RISK_INCREASE' | 'FOLLOW_UP_DUE' | 'RECOMMENDATION_AVAILABLE' | 'INTERVENTION_UPDATE';
  title: string;
  description: string;
  createdAt: string;
  status: 'NEW' | 'VIEWED' | 'ACKNOWLEDGED' | 'RESOLVED';
}

export interface PersonalRisk {
  level: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'INSUFFICIENT_DATA';
  trend: 'IMPROVING' | 'STABLE' | 'INCREASING' | 'INSUFFICIENT_DATA';
  confidence?: number;
  summary?: string;
  generatedAt?: string;
}

export interface RiskFactor {
  id: string;
  category: 'WORKLOAD' | 'DEPLOYMENT' | 'LEAVE' | 'TRAINING' | 'MOOD' | 'SLEEP' | 'ENERGY' | 'STRESS' | 'FATIGUE' | 'BIOMETRIC' | 'OTHER';
  label: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH';
  trend?: 'INCREASING' | 'DECREASING' | 'STABLE' | 'NO_DATA';
  explanation?: string;
}

export interface RiskEvent {
  id: string;
  timestamp: string;
  type: 'RISK_CHANGE' | 'WORKLOAD_CHANGE' | 'WELLNESS_CHANGE' | 'DEPLOYMENT_CHANGE' | 'LEAVE_CHANGE' | 'OFFICER_ACTION';
  title: string;
  description?: string;
}

export interface DataFreshness {
  riskUpdated: string;
  lastWellnessCheckIn: string;
  workloadData: string;
  deploymentData: string;
}

export interface FollowUpSummary {
  status: 'NOT_REQUIRED' | 'REQUIRED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
  date?: string;
  type?: string;
  notes?: string;
}

export interface RecommendationSummary {
  id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface WelfareCaseProfile {
  id: string;
  personnel: {
    id: string;
    displayId: string;
    name?: string;
    unitId: string;
    status: string;
  };
  status: 'NEW' | 'REVIEW_REQUIRED' | 'ACKNOWLEDGED' | 'FOLLOW_UP_REQUIRED' | 'IN_PROGRESS' | 'MONITORING' | 'RESOLVED';
  risk: PersonalRisk;
  contributingFactors: RiskFactor[];
  recentChanges: RiskEvent[];
  dataFreshness: DataFreshness;
  followUp?: FollowUpSummary;
  recommendations?: RecommendationSummary[];
  riskHistory30D: { date: string; level: string }[];
  timeline: { date: string; label: string; description?: string }[];
}

export interface TrendPoint {
  date: string;
  value: number;
}

export interface WelfareTrend {
  metric: string;
  points: TrendPoint[];
  direction: 'IMPROVING' | 'STABLE' | 'DECLINING' | 'INSUFFICIENT_DATA';
  summary?: string;
}

// Seeded mock cases
let mockCases: WelfareCase[] = [
  {
    id: 'case-001',
    personnelId: 'u-101',
    personnelDisplayId: 'P-1042',
    unitId: 'Unit 7',
    riskLevel: 'ELEVATED',
    trend: 'INCREASING',
    confidence: 82,
    priority: 'HIGH',
    primaryFactors: [
      { factor: 'WORKLOAD', severity: 'HIGH', label: 'High workload indices' },
      { factor: 'SLEEP', severity: 'HIGH', label: 'Declining sleep trend' }
    ],
    lastAssessmentAt: new Date().toISOString(),
    followUpStatus: 'REQUIRED',
    status: 'REVIEW_REQUIRED',
  },
  {
    id: 'case-002',
    personnelId: 'u-102',
    personnelDisplayId: 'P-1043',
    unitId: 'Unit 7',
    riskLevel: 'HIGH',
    trend: 'INCREASING',
    confidence: 89,
    priority: 'CRITICAL',
    primaryFactors: [
      { factor: 'DEPLOYMENT', severity: 'HIGH', label: 'Extended deployment duties' },
      { factor: 'WORKLOAD', severity: 'HIGH', label: 'Consecutive active hours exceeded' },
      { factor: 'SELF_REPORT', severity: 'MODERATE', label: 'High stress check-ins' }
    ],
    lastAssessmentAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    followUpStatus: 'DUE',
    status: 'FOLLOW_UP_REQUIRED',
  },
  {
    id: 'case-003',
    personnelId: 'u-103',
    personnelDisplayId: 'P-1044',
    unitId: 'Unit 7',
    riskLevel: 'MODERATE',
    trend: 'STABLE',
    confidence: 76,
    priority: 'MEDIUM',
    primaryFactors: [
      { factor: 'SLEEP', severity: 'MODERATE', label: 'Fragmented sleep cycles' }
    ],
    lastAssessmentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    followUpStatus: 'IN_PROGRESS',
    status: 'IN_PROGRESS',
    nextFollowUpDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'case-004',
    personnelId: 'u-104',
    personnelDisplayId: 'P-1045',
    unitId: 'Unit 7',
    riskLevel: 'LOW',
    trend: 'IMPROVING',
    confidence: 90,
    priority: 'LOW',
    primaryFactors: [],
    lastAssessmentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    followUpStatus: 'COMPLETED',
    status: 'RESOLVED',
  },
  {
    id: 'case-005',
    personnelId: 'u-105',
    personnelDisplayId: 'P-1046',
    unitId: 'Unit 9',
    riskLevel: 'INSUFFICIENT_DATA',
    trend: 'INSUFFICIENT_DATA',
    priority: 'LOW',
    primaryFactors: [],
    lastAssessmentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    followUpStatus: 'NOT_REQUIRED',
    status: 'NEW',
  },
  {
    id: 'case-006',
    personnelId: 'u-106',
    personnelDisplayId: 'P-1047',
    unitId: 'Unit 9',
    riskLevel: 'ELEVATED',
    trend: 'IMPROVING',
    confidence: 80,
    priority: 'MEDIUM',
    primaryFactors: [
      { factor: 'LEAVE', severity: 'HIGH', label: 'No rest leaves taken in 90 days' }
    ],
    lastAssessmentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    followUpStatus: 'NOT_REQUIRED',
    status: 'ACKNOWLEDGED',
  }
];

// In-Memory Welfare Profiles seeded for all demo scenarios (FR-48, FR-49)
let mockProfiles: Record<string, WelfareCaseProfile> = {
  'case-001': {
    id: 'case-001',
    personnel: { id: 'u-101', displayId: 'P-1042', name: 'Alok Kumar', unitId: 'Unit 7', status: 'Active' },
    status: 'REVIEW_REQUIRED',
    risk: {
      level: 'ELEVATED',
      trend: 'INCREASING',
      confidence: 82,
      summary: 'Multiple duty signals suggest that additional welfare review may be useful.',
      generatedAt: new Date().toISOString()
    },
    contributingFactors: [
      { id: 'f-1', category: 'WORKLOAD', label: 'Workload Pressure', severity: 'HIGH', trend: 'INCREASING', explanation: 'Duty hours have increased significantly over the previous assessment period.' },
      { id: 'f-2', category: 'SLEEP', label: 'Sleep quality', severity: 'HIGH', trend: 'DECREASING', explanation: 'Voluntary wellness sleep ratings have declined over the last 7 days.' },
      { id: 'f-3', category: 'DEPLOYMENT', label: 'Deployment days', severity: 'HIGH', trend: 'STABLE', explanation: 'Active duty deployment cycles exceeded 18 continuous days.' }
    ],
    recentChanges: [
      { id: 'rc-1', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), type: 'RISK_CHANGE', title: 'Risk status updated', description: 'Risk changed from MODERATE to ELEVATED' },
      { id: 'rc-2', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), type: 'WORKLOAD_CHANGE', title: 'Workload index spike', description: 'Weekly active duty hours exceeded 68 hours' },
      { id: 'rc-3', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), type: 'WELLNESS_CHANGE', title: 'Sleep quality decline', description: 'Check-in sleep score fell below 5/10' }
    ],
    dataFreshness: {
      riskUpdated: new Date().toISOString(),
      lastWellnessCheckIn: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      workloadData: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      deploymentData: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    riskHistory30D: [
      { date: '12 Aug', level: 'LOW' },
      { date: '18 Aug', level: 'LOW' },
      { date: '22 Aug', level: 'MODERATE' },
      { date: '26 Aug', level: 'MODERATE' },
      { date: '28 Aug', level: 'ELEVATED' }
    ],
    timeline: [
      { date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), label: 'Risk level became Elevated', description: 'Triggered by sleep and fatigue indices.' },
      { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), label: 'Recommendation generated', description: 'Offer voluntary counseling session.' }
    ],
    followUp: { status: 'REQUIRED' },
    recommendations: [
      { id: 'rec-1', title: 'Review current duty allocation', description: 'Consider workload adjustments or rotating active duty tasks.', priority: 'HIGH' },
      { id: 'rec-2', title: 'Offer voluntary counseling session', description: 'Schedule confidential conversation with welfare representative.', priority: 'MEDIUM' }
    ]
  },
  'case-002': {
    id: 'case-002',
    personnel: { id: 'u-102', displayId: 'P-1043', name: 'Vikram Singh', unitId: 'Unit 7', status: 'Active' },
    status: 'FOLLOW_UP_REQUIRED',
    risk: {
      level: 'HIGH',
      trend: 'INCREASING',
      confidence: 89,
      summary: 'Several significant signals have been identified and should receive timely human review.',
      generatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    },
    contributingFactors: [
      { id: 'f-1', category: 'DEPLOYMENT', label: 'Extended Deployment', severity: 'HIGH', trend: 'INCREASING', explanation: 'Active duty deployment cycles exceeded 24 continuous days.' },
      { id: 'f-2', category: 'WORKLOAD', label: 'Workload pressure', severity: 'HIGH', trend: 'INCREASING', explanation: 'Consecutive active hours exceeded circadian safety directives.' }
    ],
    recentChanges: [
      { id: 'rc-1', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), type: 'RISK_CHANGE', title: 'Risk status updated', description: 'Risk changed from ELEVATED to HIGH' }
    ],
    dataFreshness: {
      riskUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      lastWellnessCheckIn: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      workloadData: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      deploymentData: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    riskHistory30D: [
      { date: '12 Aug', level: 'LOW' },
      { date: '18 Aug', level: 'MODERATE' },
      { date: '22 Aug', level: 'ELEVATED' },
      { date: '28 Aug', level: 'HIGH' }
    ],
    timeline: [
      { date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), label: 'Risk level became High', description: 'Consecutive workloads flagged.' }
    ],
    followUp: { status: 'REQUIRED' },
    recommendations: [
      { id: 'rec-1', title: 'Immediate fatigue mitigation', description: 'Enforce rest schedules and temporary relief from active duties.', priority: 'HIGH' }
    ]
  },
  'case-003': {
    id: 'case-003',
    personnel: { id: 'u-103', displayId: 'P-1044', name: 'Nisha Pillai', unitId: 'Unit 7', status: 'Active' },
    status: 'IN_PROGRESS',
    risk: {
      level: 'MODERATE',
      trend: 'STABLE',
      confidence: 76,
      summary: 'Some signals suggest that continued monitoring may be useful.',
      generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    contributingFactors: [
      { id: 'f-1', category: 'SLEEP', label: 'Fragmented sleep cycles', severity: 'MODERATE', trend: 'STABLE', explanation: 'Sleep ratings stable but below baseline threshold.' }
    ],
    recentChanges: [],
    dataFreshness: {
      riskUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      lastWellnessCheckIn: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      workloadData: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      deploymentData: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    riskHistory30D: [
      { date: '12 Aug', level: 'LOW' },
      { date: '28 Aug', level: 'MODERATE' }
    ],
    timeline: [],
    followUp: { status: 'SCHEDULED', type: 'GENERAL_CHECK_IN', date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Routine check-in' }
  },
  'case-004': {
    id: 'case-004',
    personnel: { id: 'u-104', displayId: 'P-1045', name: 'Sanjay Dutt', unitId: 'Unit 7', status: 'Active' },
    status: 'RESOLVED',
    risk: {
      level: 'LOW',
      trend: 'IMPROVING',
      confidence: 90,
      summary: 'No significant welfare-risk signals currently identified.',
      generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    contributingFactors: [],
    recentChanges: [],
    dataFreshness: {
      riskUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      lastWellnessCheckIn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      workloadData: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      deploymentData: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    riskHistory30D: [
      { date: '12 Aug', level: 'MODERATE' },
      { date: '28 Aug', level: 'LOW' }
    ],
    timeline: []
  },
  'case-005': {
    id: 'case-005',
    personnel: { id: 'u-105', displayId: 'P-1046', name: 'Meera Nair', unitId: 'Unit 9', status: 'Active' },
    status: 'NEW',
    risk: {
      level: 'INSUFFICIENT_DATA',
      trend: 'INSUFFICIENT_DATA',
      summary: 'There is not enough recent information to establish a reliable risk assessment.',
      generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    contributingFactors: [],
    recentChanges: [],
    dataFreshness: {
      riskUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastWellnessCheckIn: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      workloadData: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      deploymentData: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    riskHistory30D: [],
    timeline: []
  }
};

let mockAlerts: WelfareAlert[] = [
  {
    id: 'alt-001',
    caseId: 'case-001',
    type: 'RISK_INCREASE',
    title: 'Increasing Welfare Risk',
    description: 'Personnel P-1042 risk status changed from Moderate to Elevated. Primary factor: Increased Workload.',
    createdAt: new Date().toISOString(),
    status: 'NEW',
  },
  {
    id: 'alt-002',
    caseId: 'case-002',
    type: 'FOLLOW_UP_DUE',
    title: 'Follow-Up Overdue',
    description: 'Personnel P-1043 follow-up review was scheduled for yesterday and is now overdue.',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: 'NEW',
  }
];

const logAuditEvent = (action: string, metadata: any) => {
  console.log(`[AUDIT_LOG] ${new Date().toISOString()} - Action: ${action} - Context:`, metadata);
};

export const caseService = {
  async getCases(params: {
    search?: string;
    riskLevel?: string;
    trend?: string;
    followUpStatus?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<WelfareCase[]>> {
    let filtered = [...mockLogsCaseAdapter()];
    const { search, riskLevel, trend, followUpStatus, page = 1, pageSize = 10 } = params;

    if (search) {
      const searchKey = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.personnelDisplayId.toLowerCase().includes(searchKey) ||
          c.unitId.toLowerCase().includes(searchKey)
      );
    }

    if (riskLevel && riskLevel !== 'ALL') {
      filtered = filtered.filter((c) => c.riskLevel === riskLevel);
    }

    if (trend && trend !== 'ALL') {
      filtered = filtered.filter((c) => c.trend === trend);
    }

    if (followUpStatus && followUpStatus !== 'ALL') {
      filtered = filtered.filter((c) => c.followUpStatus === followUpStatus);
    }

    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return mockResolve({
      data: paginated,
      meta: {
        page,
        pageSize,
        total: filtered.length,
      },
    });
  },

  async getCaseById(id: string): Promise<ApiResponse<WelfareCase>> {
    const found = mockLogsCaseAdapter().find((c) => c.id === id);
    if (!found) {
      throw new Error('Case not found');
    }
    
    logAuditEvent('CASE_VIEWED', { caseId: id, personnelId: found.personnelId });
    return mockResolve({ data: found });
  },

  async acknowledgeCase(caseId: string): Promise<ApiResponse<{ success: boolean; updatedAt: string }>> {
    const found = mockCases.find((c) => c.id === caseId);
    if (found) {
      found.status = 'ACKNOWLEDGED';
      if (found.followUpStatus === 'REQUIRED') {
        found.followUpStatus = 'IN_PROGRESS';
      }
    }
    
    // Also sync the detailed profile map status
    if (mockProfiles[caseId]) {
      mockProfiles[caseId].status = 'ACKNOWLEDGED';
      mockProfiles[caseId].timeline.unshift({
        date: new Date().toISOString(),
        label: 'Case acknowledged',
        description: 'Officer acknowledged and queued case.'
      });
    }

    logAuditEvent('CASE_ACKNOWLEDGED', { caseId });
    return mockResolve({
      data: {
        success: true,
        updatedAt: new Date().toISOString(),
      },
    });
  },

  async createFollowUp(
    caseId: string,
    request: { type: string; scheduledFor?: string; notes?: string }
  ): Promise<ApiResponse<{ success: boolean; updatedAt: string }>> {
    const found = mockCases.find((c) => c.id === caseId);
    if (found) {
      found.followUpStatus = 'DUE';
      found.status = 'FOLLOW_UP_REQUIRED';
      found.nextFollowUpDate = request.scheduledFor || new Date().toISOString();
      found.notes = request.notes;
    }

    if (mockProfiles[caseId]) {
      mockProfiles[caseId].status = 'FOLLOW_UP_REQUIRED';
      mockProfiles[caseId].followUp = {
        status: 'SCHEDULED',
        type: request.type,
        date: request.scheduledFor || new Date().toISOString(),
        notes: request.notes
      };
      mockProfiles[caseId].timeline.unshift({
        date: new Date().toISOString(),
        label: 'Follow-up Scheduled',
        description: `Type: ${request.type.replace(/_/g, ' ')}`
      });
    }

    logAuditEvent('FOLLOW_UP_CREATED', { caseId, type: request.type, scheduledFor: request.scheduledFor });
    return mockResolve({
      data: {
        success: true,
        updatedAt: new Date().toISOString(),
      },
    });
  },

  async getAlerts(): Promise<ApiResponse<WelfareAlert[]>> {
    return mockResolve({ data: mockAlerts });
  },

  // PRD 5 Profile Getter (FR-40)
  async getCaseProfile(caseId: string): Promise<ApiResponse<WelfareCaseProfile>> {
    const profile = mockProfiles[caseId];
    if (!profile) {
      throw new Error(`Profile not found for case ${caseId}`);
    }
    
    logAuditEvent('PROFILE_VIEWED', { caseId });
    return mockResolve({ data: profile });
  },

  // PRD 5 Mark Monitoring (FR-31)
  async markCaseMonitoring(caseId: string): Promise<ApiResponse<{ success: boolean; status: string }>> {
    const found = mockCases.find((c) => c.id === caseId);
    if (found) {
      found.status = 'MONITORING';
    }
    if (mockProfiles[caseId]) {
      mockProfiles[caseId].status = 'MONITORING';
      mockProfiles[caseId].timeline.unshift({
        date: new Date().toISOString(),
        label: 'Marked Monitoring',
        description: 'Officer placed member under welfare active monitoring.'
      });
    }
    
    logAuditEvent('CASE_MONITORING_MARKED', { caseId });
    return mockResolve({ data: { success: true, status: 'MONITORING' } });
  },

  // PRD 5 Case Trends Mock API (FR-44)
  async getCaseTrends(caseId: string, metric: string, period: string): Promise<ApiResponse<WelfareTrend>> {
    const pointsCount = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    
    // Generate synthetic stable points with slight variations
    const points: TrendPoint[] = [];
    let baseValue = metric === 'sleep' ? 7.2 : metric === 'workload' ? 45 : 3.5;
    
    for (let i = pointsCount - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const noise = (Math.random() - 0.5) * (metric === 'workload' ? 10 : 1.2);
      
      // Seed a downward trend for sleep fatigue in case-001 (P-1042)
      let trendAdjustment = 0;
      if (caseId === 'case-001' && metric === 'sleep' && i < 15) {
        trendAdjustment = -0.1 * (15 - i); // Sleep steadily decreases
      }
      if (caseId === 'case-001' && metric === 'workload' && i < 15) {
        trendAdjustment = 1.8 * (15 - i); // Workload steadily increases
      }

      points.push({
        date: date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
        value: Number(Math.max(0, baseValue + noise + trendAdjustment).toFixed(1))
      });
    }

    return mockResolve({
      data: {
        metric,
        points,
        direction: caseId === 'case-001' && metric === 'sleep' ? 'DECLINING' : 'STABLE',
        summary: metric === 'sleep' ? 'Sleep quality has declined over the assessment window.' : 'Workload index is stable.'
      }
    });
  }
};

const mockLogsCaseAdapter = (): WelfareCase[] => {
  return mockCases;
};

export default caseService;
