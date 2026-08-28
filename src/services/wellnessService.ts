import { mockResolve } from '@/lib/mockAdapter';
import type { ApiResponse } from '@/types/api';

export interface WellnessCheckIn {
  id: string;
  submittedAt: string;
  moodScore: number;
  energyScore: number;
  stressScore: number;
  fatigueScore: number;
  sleepScore: number;
  notes?: string;
  status: 'SUBMITTED';
}

export interface WellnessSummary {
  latestCheckIn?: WellnessCheckIn;
  currentTrend: 'Improving' | 'Stable' | 'Needs attention' | 'Declining' | 'Insufficient data';
  metrics: {
    mood: string;
    energy: string;
    sleep: string;
    stress: string;
    fatigue: string;
  };
  dataSufficiency: 'SUFFICIENT' | 'INSUFFICIENT';
}

export interface WellnessCheckInRequest {
  moodScore: number;
  energyScore: number;
  stressScore: number;
  fatigueScore: number;
  sleepScore: number;
  notes?: string;
  consentVersion: string;
}

// Generate 30 days of realistic history
const generateMockHistory = (): WellnessCheckIn[] => {
  const history: WellnessCheckIn[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    // Introduce missing check-in gaps (e.g. 15 days ago and 22 days ago are missing)
    if (i === 15 || i === 22) continue;

    const date = new Date(today);
    date.setDate(today.getDate() - i);

    let mood = 4;
    let energy = 4;
    let stress = 2;
    let fatigue = 2;
    let sleep = 4;
    let notes = '';

    // Stable Cycle: Days 29 to 20
    if (i >= 20) {
      mood = 4;
      energy = 4;
      stress = 2;
      fatigue = 2;
      sleep = 4;
    }
    // Workload Deterioration: Days 19 to 10
    else if (i >= 10) {
      mood = i % 2 === 0 ? 2 : 3;
      energy = 2;
      stress = 4;
      fatigue = 5;
      sleep = i % 3 === 0 ? 1 : 2;
      notes = i === 12 ? 'Heavy squad exercises. Extremely fatigued.' : '';
    }
    // Gradual Recovery Cycle: Days 9 to 0
    else {
      mood = i <= 3 ? 4 : 3;
      energy = i <= 2 ? 4 : 3;
      stress = i <= 4 ? 2 : 3;
      fatigue = i <= 3 ? 2 : 3;
      sleep = i <= 2 ? 4 : 3;
    }

    history.push({
      id: `w-log-${i}`,
      submittedAt: date.toISOString(),
      moodScore: mood,
      energyScore: energy,
      stressScore: stress,
      fatigueScore: fatigue,
      sleepScore: sleep,
      notes: notes || undefined,
      status: 'SUBMITTED',
    });
  }

  return history;
};

// Retrieve in-memory state so submissions persist in active session
let mockLogs = generateMockHistory();

export const wellnessService = {
  async getSummary(): Promise<ApiResponse<WellnessSummary>> {
    const sorted = [...mockLogs].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    const latest = sorted[0];

    const getScoreLabel = (score: number, inverse = false) => {
      if (inverse) {
        // Higher is worse (e.g. stress, fatigue)
        if (score <= 2) return 'Low';
        if (score <= 3) return 'Moderate';
        return 'Needs attention';
      } else {
        // Higher is better (e.g. mood, energy, sleep)
        if (score >= 4) return 'Good';
        if (score >= 3) return 'Moderate';
        return 'Needs attention';
      }
    };

    const summary: WellnessSummary = {
      latestCheckIn: latest,
      currentTrend: 'Improving', // Based on transition out of the deterioration cycle
      metrics: latest
        ? {
            mood: getScoreLabel(latest.moodScore),
            energy: getScoreLabel(latest.energyScore),
            sleep: getScoreLabel(latest.sleepScore),
            stress: getScoreLabel(latest.stressScore, true),
            fatigue: getScoreLabel(latest.fatigueScore, true),
          }
        : {
            mood: 'Moderate',
            energy: 'Moderate',
            sleep: 'Moderate',
            stress: 'Moderate',
            fatigue: 'Moderate',
          },
      dataSufficiency: mockLogs.length >= 5 ? 'SUFFICIENT' : 'INSUFFICIENT',
    };

    return mockResolve({ data: summary });
  },

  async getHistory(page = 1, pageSize = 10): Promise<ApiResponse<WellnessCheckIn[]>> {
    const sorted = [...mockLogs].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    const start = (page - 1) * pageSize;
    const paginated = sorted.slice(start, start + pageSize);

    return mockResolve({
      data: paginated,
      meta: {
        page,
        pageSize,
        total: mockLogs.length,
      },
    });
  },

  async getTrends(period: '7d' | '30d' | '90d'): Promise<ApiResponse<WellnessCheckIn[]>> {
    const daysLimit = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const sorted = [...mockLogs].sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
    const filtered = sorted.slice(-daysLimit);

    return mockResolve({ data: filtered });
  },

  async submitCheckIn(request: WellnessCheckInRequest): Promise<ApiResponse<WellnessCheckIn>> {
    const newEntry: WellnessCheckIn = {
      id: `w-log-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      moodScore: request.moodScore,
      energyScore: request.energyScore,
      stressScore: request.stressScore,
      fatigueScore: request.fatigueScore,
      sleepScore: request.sleepScore,
      notes: request.notes,
      status: 'SUBMITTED',
    };

    // Prepend to simulate instant refresh
    mockLogs = [...mockLogs, newEntry];

    return mockResolve({ data: newEntry });
  },

  // Developer helper to empty logs for QA
  clearMockLogsForQA() {
    mockLogs = [];
  },
  
  // Developer helper to restore logs for QA
  restoreMockLogsForQA() {
    mockLogs = generateMockHistory();
  }
};
export default wellnessService;
