import { mockResolve } from '@/lib/mockAdapter';
import type { ApiResponse } from '@/types/api';

export interface RiskDistribution {
  low: number;
  moderate: number;
  elevated: number;
  high: number;
  insufficientData: number;
}

export interface OfficerDashboard {
  monitoredPersonnel: number;
  requiresReview: number;
  elevatedRisk: number;
  highRisk: number;
  followUpsDue: number;
  riskDistribution: RiskDistribution;
  riskTrend: 'IMPROVING' | 'STABLE' | 'INCREASING';
}

export const officerService = {
  async getDashboard(): Promise<ApiResponse<OfficerDashboard>> {
    const data: OfficerDashboard = {
      monitoredPersonnel: 124,
      requiresReview: 8,
      elevatedRisk: 11,
      highRisk: 3,
      followUpsDue: 5,
      riskDistribution: {
        low: 74,
        moderate: 27,
        elevated: 11,
        high: 3,
        insufficientData: 9,
      },
      riskTrend: 'INCREASING',
    };
    return mockResolve({ data });
  }
};
export default officerService;
