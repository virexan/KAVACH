import { mockResolve } from '@/lib/mockAdapter';
import type { ApiResponse } from '@/types/api';
import type { RiskLevel } from '@/theme/tokens';

export interface PersonalRiskFactor {
  factor: string;
  description: string;
}

export interface PersonalRisk {
  level: RiskLevel;
  trend: 'IMPROVING' | 'STABLE' | 'INCREASING' | 'INSUFFICIENT_DATA';
  confidence?: number;
  summary?: string;
  contributingFactors?: PersonalRiskFactor[];
  generatedAt?: string;
}

export const riskService = {
  async getPersonalRisk(): Promise<ApiResponse<PersonalRisk>> {
    const risk: PersonalRisk = {
      level: 'MODERATE',
      trend: 'IMPROVING',
      confidence: 84,
      summary: 'Your wellbeing status shows moderate stress levels, influenced by recent workload signals.',
      contributingFactors: [
        { factor: 'Sleep Interruption', description: 'Sleep scores have logged in the "Poor" range over the past 7 days.' },
        { factor: 'Accumulated Physical Fatigue', description: 'Consecutive field duty logs indicate higher fatigue levels than baseline.' },
        { factor: 'Increased Workload', description: 'Duty charts show elevated active hours compared to standard limits.' }
      ],
      generatedAt: new Date().toISOString(),
    };
    return mockResolve({ data: risk });
  }
};
export default riskService;
