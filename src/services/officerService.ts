import { apiClient } from './apiClient';
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
    const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';
    if (!useMocks) {
      try {
        // Call the unified backend server
        const response = await apiClient.get<any>('/overview');
        const data: OfficerDashboard = {
          monitoredPersonnel: response.total_personnel || 124,
          requiresReview: 8,
          elevatedRisk: response.risk_distribution?.ELEVATED || 11,
          highRisk: response.risk_distribution?.HIGH || 3,
          followUpsDue: 5,
          riskDistribution: {
            low: response.risk_distribution?.LOW || 74,
            moderate: response.risk_distribution?.MODERATE || 27,
            elevated: response.risk_distribution?.ELEVATED || 11,
            high: response.risk_distribution?.HIGH || 3,
            insufficientData: 9,
          },
          riskTrend: 'INCREASING',
        };
        return { data };
      } catch (error) {
        throw error;
      }
    }
    
    // Mock fallback
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
    return { data };
  }
};
export default officerService;
