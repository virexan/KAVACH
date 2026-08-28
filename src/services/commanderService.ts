import { mockResolve } from '@/lib/mockAdapter';
import type { ApiResponse } from '@/types/api';

export interface RiskDistribution {
  low: number;
  moderate: number;
  elevated: number;
  high: number;
  insufficient: number;
}

export interface AggregateRiskPoint {
  date: string;
  low: number;
  moderate: number;
  elevated: number;
  high: number;
  insufficientData?: number;
}

export interface AggregateRiskTrend {
  direction: 'IMPROVING' | 'STABLE' | 'INCREASING' | 'INSUFFICIENT_DATA';
  points: AggregateRiskPoint[];
  summary?: string;
}

export interface AggregateMetric {
  current?: number;
  previous?: number;
  changePercent?: number;
  direction: 'INCREASING' | 'STABLE' | 'DECREASING' | 'INSUFFICIENT_DATA';
  unit?: string;
}

export interface AggregateWorkloadSummary {
  dutyHours?: AggregateMetric;
  deployment?: AggregateMetric;
  trainingLoad?: AggregateMetric;
  leaveUtilization?: AggregateMetric;
}

export interface PressurePoint {
  id: string;
  category: 'WORKLOAD' | 'DEPLOYMENT' | 'LEAVE' | 'TRAINING' | 'REST_AND_RECOVERY';
  title: string;
  description: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH';
  trend: 'INCREASING' | 'STABLE' | 'DECREASING';
}

export interface CommanderRecommendation {
  id: string;
  title: string;
  category: 'WORKLOAD' | 'DEPLOYMENT' | 'LEAVE' | 'TRAINING' | 'RESOURCE_ALLOCATION' | 'REST_AND_RECOVERY' | 'GENERAL_WELFARE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  rationale?: string;
  status: 'NEW' | 'REVIEWED' | 'CONSIDERED' | 'DISMISSED';
  generatedAt: string;
}

export interface CommanderAlert {
  id: string;
  category: 'RISK_TREND' | 'WORKLOAD_CHANGE' | 'DEPLOYMENT_PRESSURE' | 'LEAVE_PATTERN' | 'TRAINING_LOAD' | 'RECOMMENDATION';
  title: string;
  description: string;
  generatedAt: string;
}

export interface CommanderDashboard {
  unitId: string;
  unitName: string;
  personnelInScope: number;
  isSuppressed: boolean;
  riskDistribution: RiskDistribution;
  riskTrend: AggregateRiskTrend;
  workloadSummary: AggregateWorkloadSummary;
  pressurePoints: PressurePoint[];
  recommendations: CommanderRecommendation[];
  alerts: CommanderAlert[];
  dataUpdatedAt: string;
}

// Mock Units Database (FR-53)
const mockUnitsData: Record<string, CommanderDashboard> = {
  'ALL': {
    unitId: 'ALL',
    unitName: 'All Authorized Units',
    personnelInScope: 320,
    isSuppressed: false,
    riskDistribution: { low: 210, moderate: 70, elevated: 28, high: 6, insufficient: 6 },
    riskTrend: {
      direction: 'STABLE',
      points: [
        { date: 'Aug 07', low: 220, moderate: 65, elevated: 20, high: 5, insufficientData: 10 },
        { date: 'Aug 14', low: 215, moderate: 68, elevated: 25, high: 7, insufficientData: 5 },
        { date: 'Aug 21', low: 212, moderate: 69, elevated: 26, high: 8, insufficientData: 5 },
        { date: 'Aug 28', low: 210, moderate: 70, elevated: 28, high: 6, insufficientData: 6 }
      ],
      summary: 'Welfare risks are stable overall across the full scope of authorized forces.'
    },
    workloadSummary: {
      dutyHours: { current: 43, previous: 42.5, changePercent: 1.17, direction: 'STABLE', unit: 'hrs/wk' },
      deployment: { current: 180, previous: 175, changePercent: 2.85, direction: 'STABLE', unit: 'days/yr' },
      trainingLoad: { current: 15, previous: 15, changePercent: 0, direction: 'STABLE', unit: 'hrs/wk' },
      leaveUtilization: { current: 75, previous: 76, changePercent: -1.3, direction: 'STABLE', unit: '%' }
    },
    pressurePoints: [
      { id: 'pp-01', category: 'WORKLOAD', title: 'Marginal workload index increase', description: 'Average weekly duty hours rose slightly across training schedules.', severity: 'LOW', trend: 'INCREASING' }
    ],
    recommendations: [
      { id: 'crec-01', title: 'Review Active Shift Rotations', category: 'WORKLOAD', priority: 'MEDIUM', rationale: 'Marginal workload shifts logged in Unit 4.', status: 'NEW', generatedAt: new Date().toISOString() }
    ],
    alerts: [
      { id: 'ca-01', category: 'WORKLOAD_CHANGE', title: 'Minor workload shift detected', description: 'Average workload metrics rose slightly in training schedules.', generatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  'UNIT-1': {
    unitId: 'UNIT-1',
    unitName: 'Unit 1 (Active Duty Support)',
    personnelInScope: 90,
    isSuppressed: false,
    riskDistribution: { low: 70, moderate: 15, elevated: 3, high: 0, insufficient: 2 },
    riskTrend: {
      direction: 'IMPROVING',
      points: [
        { date: 'Aug 07', low: 60, moderate: 22, elevated: 5, high: 1, insufficientData: 2 },
        { date: 'Aug 14', low: 65, moderate: 18, elevated: 5, high: 0, insufficientData: 2 },
        { date: 'Aug 21', low: 68, moderate: 17, elevated: 3, high: 0, insufficientData: 2 },
        { date: 'Aug 28', low: 70, moderate: 15, elevated: 3, high: 0, insufficientData: 2 }
      ],
      summary: 'Favorable risk reduction patterns detected since leave cycle enforcement.'
    },
    workloadSummary: {
      dutyHours: { current: 39, previous: 44, changePercent: -11.36, direction: 'DECREASING', unit: 'hrs/wk' },
      deployment: { current: 150, previous: 165, changePercent: -9.09, direction: 'DECREASING', unit: 'days/yr' },
      trainingLoad: { current: 12, previous: 12, changePercent: 0, direction: 'STABLE', unit: 'hrs/wk' },
      leaveUtilization: { current: 85, previous: 70, changePercent: 21.4, direction: 'INCREASING', unit: '%' }
    },
    pressurePoints: [],
    recommendations: [],
    alerts: [],
    dataUpdatedAt: new Date().toISOString()
  },
  'UNIT-2': {
    unitId: 'UNIT-2',
    unitName: 'Unit 2 (Tactical Logistics)',
    personnelInScope: 85,
    isSuppressed: false,
    riskDistribution: { low: 45, moderate: 25, elevated: 10, high: 3, insufficient: 2 },
    riskTrend: {
      direction: 'INCREASING',
      points: [
        { date: 'Aug 07', low: 55, moderate: 20, elevated: 6, high: 2, insufficientData: 2 },
        { date: 'Aug 14', low: 50, moderate: 22, elevated: 8, high: 3, insufficientData: 2 },
        { date: 'Aug 21', low: 48, moderate: 24, elevated: 9, high: 3, insufficientData: 2 },
        { date: 'Aug 28', low: 45, moderate: 25, elevated: 10, high: 3, insufficientData: 2 }
      ],
      summary: 'Elevated and high-risk signals have increased compared with the previous period.'
    },
    workloadSummary: {
      dutyHours: { current: 48, previous: 44, changePercent: 9.09, direction: 'INCREASING', unit: 'hrs/wk' },
      deployment: { current: 210, previous: 190, changePercent: 10.53, direction: 'INCREASING', unit: 'days/yr' },
      trainingLoad: { current: 18, previous: 15, changePercent: 20, direction: 'INCREASING', unit: 'hrs/wk' },
      leaveUtilization: { current: 60, previous: 72, changePercent: -16.6, direction: 'DECREASING', unit: '%' }
    },
    pressurePoints: [
      { id: 'pp-02', category: 'WORKLOAD', title: 'Increased active duty hours', description: 'Weekly shift metrics rose to 48 hours average.', severity: 'HIGH', trend: 'INCREASING' },
      { id: 'pp-03', category: 'LEAVE', title: 'Reduced leave utilization', description: 'Leave consumption fell by 16.6% compared to the baseline.', severity: 'MODERATE', trend: 'DECREASING' }
    ],
    recommendations: [
      { id: 'crec-02', title: 'Coordinate Leave Rebalancing', category: 'LEAVE', priority: 'HIGH', rationale: 'Tactical logistics leaves fell below critical thresholds.', status: 'NEW', generatedAt: new Date().toISOString() }
    ],
    alerts: [
      { id: 'ca-02', category: 'RISK_TREND', title: 'Unit Risk Increasing', description: 'The proportion of elevated-risk signals has increased over the previous 14 days.', generatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  'UNIT-3': {
    unitId: 'UNIT-3',
    unitName: 'Unit 3 (Small Guard Section)',
    personnelInScope: 3, // Below privacy group threshold (FR-39)
    isSuppressed: true,
    riskDistribution: { low: 0, moderate: 0, elevated: 0, high: 0, insufficient: 0 },
    riskTrend: { direction: 'INSUFFICIENT_DATA', points: [] },
    workloadSummary: {},
    pressurePoints: [],
    recommendations: [],
    alerts: [],
    dataUpdatedAt: new Date().toISOString()
  },
  'UNIT-4': {
    unitId: 'UNIT-4',
    unitName: 'Unit 4 (Engineering Base)',
    personnelInScope: 70,
    isSuppressed: false,
    riskDistribution: { low: 48, moderate: 15, elevated: 4, high: 1, insufficient: 2 },
    riskTrend: {
      direction: 'STABLE',
      points: [
        { date: 'Aug 07', low: 50, moderate: 14, elevated: 3, high: 1, insufficientData: 2 },
        { date: 'Aug 28', low: 48, moderate: 15, elevated: 4, high: 1, insufficientData: 2 }
      ]
    },
    workloadSummary: {
      dutyHours: { current: 44, previous: 40, changePercent: 10, direction: 'INCREASING', unit: 'hrs/wk' },
      deployment: { current: 160, previous: 160, changePercent: 0, direction: 'STABLE', unit: 'days/yr' },
      trainingLoad: { current: 15, previous: 15, changePercent: 0, direction: 'STABLE', unit: 'hrs/wk' },
      leaveUtilization: { current: 70, previous: 70, changePercent: 0, direction: 'STABLE', unit: '%' }
    },
    pressurePoints: [
      { id: 'pp-04', category: 'WORKLOAD', title: 'Increasing training schedules', description: 'Increased fatigue logs during training cycles.', severity: 'MODERATE', trend: 'INCREASING' }
    ],
    recommendations: [],
    alerts: [],
    dataUpdatedAt: new Date().toISOString()
  },
  // UNIT 7 - Primary SIH Demo Scenario (FR-54)
  'UNIT-7': {
    unitId: 'UNIT-7',
    unitName: 'Unit 7 (Tactical Operations Group)',
    personnelInScope: 124,
    isSuppressed: false,
    riskDistribution: { low: 71, moderate: 30, elevated: 11, high: 3, insufficient: 9 },
    riskTrend: {
      direction: 'INCREASING',
      points: [
        { date: 'Aug 07', low: 80, moderate: 28, elevated: 8, high: 2, insufficientData: 6 },
        { date: 'Aug 14', low: 78, moderate: 28, elevated: 9, high: 2, insufficientData: 7 },
        { date: 'Aug 21', low: 75, moderate: 29, elevated: 10, high: 3, insufficientData: 7 },
        { date: 'Aug 28', low: 71, moderate: 30, elevated: 11, high: 3, insufficientData: 9 }
      ],
      summary: 'Elevated and high-risk signals have increased compared with the previous period.'
    },
    workloadSummary: {
      dutyHours: { current: 45, previous: 40.2, changePercent: 12, direction: 'INCREASING', unit: 'hrs/wk' },
      deployment: { current: 198, previous: 183.3, changePercent: 8, direction: 'INCREASING', unit: 'days/yr' },
      trainingLoad: { current: 16, previous: 16, changePercent: 0, direction: 'STABLE', unit: 'hrs/wk' },
      leaveUtilization: { current: 64, previous: 68.1, changePercent: -6, direction: 'DECREASING', unit: '%' }
    },
    pressurePoints: [
      { id: 'pp-701', category: 'WORKLOAD', title: 'Increased duty hours', description: 'Average weekly duty hours rose by 12% across tactical taskings.', severity: 'HIGH', trend: 'INCREASING' },
      { id: 'pp-702', category: 'DEPLOYMENT', title: 'Extended deployment periods', description: 'Deployment roster days increased by 8% over the baseline.', severity: 'HIGH', trend: 'INCREASING' },
      { id: 'pp-703', category: 'LEAVE', title: 'Reduced leave utilization', description: 'Leave consumption fell by 6% due to roster overlaps.', severity: 'MODERATE', trend: 'DECREASING' }
    ],
    recommendations: [
      {
        id: 'crec-701',
        title: 'Review Duty Workload Allocation',
        category: 'WORKLOAD',
        priority: 'HIGH',
        rationale: 'Duty hours indicators rose by 12% while welfare-risk signals also increased.',
        status: 'NEW',
        generatedAt: new Date().toISOString()
      },
      {
        id: 'crec-702',
        title: 'Optimize Leave Rotation schedules',
        category: 'LEAVE',
        priority: 'MEDIUM',
        rationale: 'Leave utilization has declined by 6% compared with the previous period.',
        status: 'NEW',
        generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    alerts: [
      { id: 'ca-701', category: 'RISK_TREND', title: 'Unit Risk Increasing', description: 'The proportion of elevated-risk signals has increased over the previous 14 days.', generatedAt: new Date().toISOString() },
      { id: 'ca-702', category: 'WORKLOAD_CHANGE', title: 'Workload Pressure Increasing', description: 'Average duty hours have increased by 12% across tactical schedules.', generatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  }
};

export const commanderService = {
  async getDashboard(unitId: string = 'ALL'): Promise<ApiResponse<CommanderDashboard>> {
    const found = mockUnitsData[unitId] || mockUnitsData['ALL'];
    return mockResolve({ data: found });
  },

  async getUnitAnalytics(unitId: string): Promise<ApiResponse<CommanderDashboard>> {
    const found = mockUnitsData[unitId];
    if (!found) throw new Error('Unit not found');
    return mockResolve({ data: found });
  },

  async getWorkloadAnalytics(unitId: string = 'ALL'): Promise<ApiResponse<AggregateWorkloadSummary>> {
    const found = mockUnitsData[unitId] || mockUnitsData['ALL'];
    return mockResolve({ data: found.workloadSummary });
  },

  async getRecommendations(params: {
    unitId?: string;
    status?: string;
    priority?: string;
  } = {}): Promise<ApiResponse<CommanderRecommendation[]>> {
    const unitId = params.unitId || 'ALL';
    const found = mockUnitsData[unitId] || mockUnitsData['ALL'];
    let list = [...found.recommendations];

    if (params.status && params.status !== 'ALL') {
      list = list.filter((r) => r.status === params.status);
    }
    if (params.priority && params.priority !== 'ALL') {
      list = list.filter((r) => r.priority === params.priority);
    }

    return mockResolve({ data: list });
  },

  async acknowledgeRecommendation(
    unitId: string,
    recId: string,
    action: 'REVIEWED' | 'CONSIDERED' | 'DISMISSED'
  ): Promise<ApiResponse<{ success: boolean; status: string }>> {
    const unit = mockUnitsData[unitId] || mockUnitsData['ALL'];
    const rec = unit.recommendations.find((r) => r.id === recId);
    if (rec) {
      rec.status = action;
    }
    console.log(`[AUDIT_LOG] COMMANDER_RECOMMENDATION_STATUS - Unit: ${unitId} - Rec: ${recId} - Status: ${action}`);
    return mockResolve({
      data: {
        success: true,
        status: action
      }
    });
  },

  async getAlerts(unitId: string = 'ALL'): Promise<ApiResponse<CommanderAlert[]>> {
    const found = mockUnitsData[unitId] || mockUnitsData['ALL'];
    return mockResolve({ data: found.alerts });
  },

  async getReport(unitId: string = 'UNIT-7', _period: string = '30d'): Promise<ApiResponse<{
    reportingPeriod: string;
    unitName: string;
    personnelInScope: number;
    riskTrend: string;
    workloadMetrics: string[];
    pressurePoints: string[];
    recommendations: string[];
  }>> {
    const found = mockUnitsData[unitId] || mockUnitsData['UNIT-7'];
    return mockResolve({
      data: {
        reportingPeriod: `01 Aug — ${new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}`,
        unitName: found.unitName,
        personnelInScope: found.personnelInScope,
        riskTrend: found.riskTrend.direction,
        workloadMetrics: [
          `Duty Hours: ${found.workloadSummary.dutyHours?.current || 0} hrs/wk (${found.workloadSummary.dutyHours?.changePercent || 0}% change)`,
          `Deployment Load: ${found.workloadSummary.deployment?.current || 0} days/yr (${found.workloadSummary.deployment?.changePercent || 0}% change)`,
          `Leave Utilization: ${found.workloadSummary.leaveUtilization?.current || 0}% (${found.workloadSummary.leaveUtilization?.changePercent || 0}% change)`
        ],
        pressurePoints: found.pressurePoints.map((pp) => `${pp.title}: ${pp.description}`),
        recommendations: found.recommendations.map((r) => `${r.title} (${r.priority} Priority)`)
      }
    });
  }
};

export default commanderService;
