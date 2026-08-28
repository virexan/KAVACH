import { mockResolve } from '@/lib/mockAdapter';
import type { ApiResponse } from '@/types/api';

export interface ConsentRecord {
  id: string;
  dataType: 'WELLNESS' | 'BIOMETRIC';
  consent: boolean;
  version: string;
  timestamp: string;
}

let mockConsents: ConsentRecord[] = [
  { id: 'c-01', dataType: 'WELLNESS', consent: true, version: 'v1.2', timestamp: new Date().toISOString() },
  { id: 'c-02', dataType: 'BIOMETRIC', consent: false, version: 'v1.0', timestamp: new Date().toISOString() }
];

export const consentService = {
  async getConsentStatus(): Promise<ApiResponse<ConsentRecord[]>> {
    return mockResolve({ data: mockConsents });
  },

  async updateConsent(dataType: 'WELLNESS' | 'BIOMETRIC', consent: boolean): Promise<ApiResponse<ConsentRecord>> {
    const record = mockConsents.find((c) => c.dataType === dataType);
    if (record) {
      record.consent = consent;
      record.timestamp = new Date().toISOString();
      return mockResolve({ data: record });
    }
    const newRecord: ConsentRecord = {
      id: `c-0${mockConsents.length + 1}`,
      dataType,
      consent,
      version: 'v1.0',
      timestamp: new Date().toISOString(),
    };
    mockConsents = [...mockConsents, newRecord];
    return mockResolve({ data: newRecord });
  }
};
export default consentService;
