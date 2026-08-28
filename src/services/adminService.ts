import { mockResolve } from '@/lib/mockAdapter';
import type { ApiResponse } from '@/types/api';

export type UserRole = 'PERSONNEL' | 'WELFARE_OFFICER' | 'COMMANDER' | 'ADMIN';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';

export interface AdminUser {
  id: string;
  displayName: string;
  role: UserRole;
  unitId?: string;
  status: AccountStatus;
  createdAt: string;
  lastActiveAt?: string;
}

export interface OrganizationUnit {
  id: string;
  name: string;
  parentId?: string;
  status: 'ACTIVE' | 'INACTIVE';
  personnelCount: number;
  officerCount: number;
}

export interface ConsentPolicy {
  id: string;
  name: string;
  dataCategory: 'WELLNESS' | 'BIOMETRIC';
  version: string;
  purpose: string;
  status: 'DRAFT' | 'ACTIVE' | 'RETIRED';
  createdAt: string;
  effectiveFrom?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorId: string;
  actorDisplayName: string;
  action: string;
  category: 'AUTH' | 'USER' | 'ROLE' | 'CASE' | 'CONSENT' | 'RECOMMENDATION' | 'INTERVENTION' | 'MODEL' | 'SYSTEM';
  resourceType?: string;
  resourceId?: string;
  result: 'SUCCESS' | 'FAILURE';
  summary?: string;
}

export interface ModelVersion {
  id: string;
  name: string;
  version: string;
  type: 'RISK_ENGINE' | 'RECOMMENDATION_ENGINE';
  status: 'DRAFT' | 'ACTIVE' | 'RETIRED';
  createdAt: string;
  activatedAt?: string;
}

export interface ServiceHealth {
  id: string;
  name: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'UNAVAILABLE' | 'UNKNOWN';
  lastCheckedAt: string;
  responseTimeMs?: number;
  version?: string;
}

export interface SystemSettings {
  platformName: string;
  environment: string;
  timezone: string;
  sessionTimeoutMinutes: number;
  loginProtectionAttempts: number;
  auditRetentionDays: number;
}

// Seed Users (FR-65)
let mockUsers: AdminUser[] = [
  { id: 'usr-001', displayName: 'Deblina Admin', role: 'ADMIN', status: 'ACTIVE', createdAt: '2026-08-01T10:00:00Z', lastActiveAt: new Date().toISOString() },
  { id: 'usr-002', displayName: 'Officer A (Welfare)', role: 'WELFARE_OFFICER', status: 'ACTIVE', createdAt: '2026-08-01T10:15:00Z', lastActiveAt: new Date().toISOString() },
  { id: 'usr-003', displayName: 'Commander B (Tactical)', role: 'COMMANDER', status: 'ACTIVE', createdAt: '2026-08-01T10:30:00Z', lastActiveAt: new Date().toISOString() },
  ...Array.from({ length: 20 }, (_, idx) => ({
    id: `usr-10${idx}`,
    displayName: `Personnel ${idx + 1}`,
    role: 'PERSONNEL' as UserRole,
    unitId: idx % 2 === 0 ? 'UNIT-7' : 'UNIT-2',
    status: idx === 10 ? 'SUSPENDED' : idx === 15 ? 'PENDING' : 'ACTIVE' as AccountStatus,
    createdAt: '2026-08-05T09:00:00Z',
    lastActiveAt: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString()
  }))
];

// Seed Units
let mockUnits: OrganizationUnit[] = [
  { id: 'UNIT-1', name: 'Unit 1 (Active Support)', parentId: 'HQ-FORCE', status: 'ACTIVE', personnelCount: 90, officerCount: 3 },
  { id: 'UNIT-2', name: 'Unit 2 (Tactical Logistics)', parentId: 'HQ-FORCE', status: 'ACTIVE', personnelCount: 85, officerCount: 4 },
  { id: 'UNIT-3', name: 'Unit 3 (Small Guard Section)', parentId: 'HQ-FORCE', status: 'ACTIVE', personnelCount: 3, officerCount: 1 },
  { id: 'UNIT-4', name: 'Unit 4 (Engineering Base)', parentId: 'HQ-FORCE', status: 'ACTIVE', personnelCount: 70, officerCount: 2 },
  { id: 'UNIT-7', name: 'Unit 7 (Tactical Operations Group)', parentId: 'HQ-FORCE', status: 'ACTIVE', personnelCount: 124, officerCount: 5 }
];

// Seed Consent Policies (FR-65)
let mockConsentPolicies: ConsentPolicy[] = [
  { id: 'pol-01', name: 'Wellness Data Sharing Policy', dataCategory: 'WELLNESS', version: 'v1.2', purpose: 'Enables voluntary check-ins to calibrate fatigue indexes.', status: 'ACTIVE', createdAt: '2026-08-20T10:00:00Z', effectiveFrom: '2026-08-28T00:00:00Z' },
  { id: 'pol-02', name: 'Optional Biometric Integration Policy', dataCategory: 'BIOMETRIC', version: 'v1.0', purpose: 'Governs optional sync of sleep trackers and wearables.', status: 'ACTIVE', createdAt: '2026-08-20T10:00:00Z', effectiveFrom: '2026-08-28T00:00:00Z' },
  { id: 'pol-03', name: 'Draft Wellness Upgrades Policy', dataCategory: 'WELLNESS', version: 'v1.3-draft', purpose: 'Upgrades retention parameters.', status: 'DRAFT', createdAt: new Date().toISOString() }
];

// Seed Model Versions (FR-65)
let mockModelVersions: ModelVersion[] = [
  { id: 'mod-01', name: 'Welfare Risk Engine', version: 'v0.1', type: 'RISK_ENGINE', status: 'ACTIVE', createdAt: '2026-08-15T00:00:00Z', activatedAt: '2026-08-20T00:00:00Z' },
  { id: 'mod-02', name: 'Welfare Risk Engine Upgrade', version: 'v0.2', type: 'RISK_ENGINE', status: 'DRAFT', createdAt: new Date().toISOString() },
  { id: 'mod-03', name: 'Legacy Risk Estimator', version: 'v0.0', type: 'RISK_ENGINE', status: 'RETIRED', createdAt: '2026-08-01T00:00:00Z' }
];

// Seed Service Health (FR-65)
let mockServiceHealths: ServiceHealth[] = [
  { id: 'auth', name: 'Authentication Gate', status: 'OPERATIONAL', lastCheckedAt: new Date().toISOString(), responseTimeMs: 42, version: '1.0.0' },
  { id: 'db', name: 'Core Database Connection', status: 'OPERATIONAL', lastCheckedAt: new Date().toISOString(), responseTimeMs: 12, version: 'PostgreSQL 15' },
  { id: 'risk', name: 'Welfare Risk assessment Engine', status: 'OPERATIONAL', lastCheckedAt: new Date().toISOString(), responseTimeMs: 142, version: '0.1' },
  { id: 'rec', name: 'Recommendation mapping Engine', status: 'OPERATIONAL', lastCheckedAt: new Date().toISOString(), responseTimeMs: 85, version: '0.1' },
  { id: 'notify', name: 'Notification Service Dispatcher', status: 'OPERATIONAL', lastCheckedAt: new Date().toISOString(), responseTimeMs: 65, version: '1.2' },
  { id: 'rag', name: 'Welfare AI RAG Assistant', status: 'DEGRADED', lastCheckedAt: new Date().toISOString(), responseTimeMs: 450, version: 'v0.1-beta' }
];

// Seed Settings
let mockSystemSettings: SystemSettings = {
  platformName: 'KAVACH Welfare Platform',
  environment: 'DEMO-PROD-SIM',
  timezone: 'Asia/Kolkata',
  sessionTimeoutMinutes: 30,
  loginProtectionAttempts: 5,
  auditRetentionDays: 365
};

// Seed Audit events (FR-65)
let mockAuditLogs: AuditEvent[] = Array.from({ length: 50 }, (_, idx) => ({
  id: `aud-${500 - idx}`,
  timestamp: new Date(Date.now() - idx * 30 * 60 * 1000).toISOString(),
  actorId: idx % 4 === 0 ? 'usr-001' : 'usr-002',
  actorDisplayName: idx % 4 === 0 ? 'Deblina Admin' : 'Officer A (Welfare)',
  action: idx % 5 === 0 ? 'USER_ROLE_UPDATED' : idx % 3 === 0 ? 'CASE_ACKNOWLEDGED' : 'CONSENT_POLICY_VIEWED',
  category: idx % 5 === 0 ? 'USER' : idx % 3 === 0 ? 'CASE' : 'CONSENT' as any,
  resourceId: `res-${1000 + idx}`,
  result: 'SUCCESS' as const,
  summary: idx % 5 === 0 ? 'User Personnel 3 changed to Officer.' : idx % 3 === 0 ? 'Acknowledged Case P-1042.' : 'Viewed Wellness Consent policy.'
}));

export const adminService = {
  async getUsers(params: {
    search?: string;
    role?: string;
    status?: string;
  } = {}): Promise<ApiResponse<AdminUser[]>> {
    let list = [...mockUsers];
    const { search, role, status } = params;

    if (search) {
      list = list.filter((u) => u.displayName.toLowerCase().includes(search.toLowerCase()));
    }
    if (role && role !== 'ALL') {
      list = list.filter((u) => u.role === role);
    }
    if (status && status !== 'ALL') {
      list = list.filter((u) => u.status === status);
    }

    return mockResolve({ data: list });
  },

  async getUserById(id: string): Promise<ApiResponse<AdminUser>> {
    const found = mockUsers.find((u) => u.id === id);
    if (!found) throw new Error('User not found');
    return mockResolve({ data: found });
  },

  async updateUserRole(id: string, role: UserRole): Promise<ApiResponse<{ success: boolean }>> {
    const found = mockUsers.find((u) => u.id === id);
    if (found) {
      found.role = role;
    }
    console.log(`[AUDIT_LOG] USER_ROLE_CHANGED - Id: ${id} - Role: ${role}`);
    return mockResolve({ data: { success: true } });
  },

  async updateUserStatus(id: string, status: AccountStatus): Promise<ApiResponse<{ success: boolean }>> {
    const found = mockUsers.find((u) => u.id === id);
    if (found) {
      found.status = status;
    }
    console.log(`[AUDIT_LOG] USER_STATUS_CHANGED - Id: ${id} - Status: ${status}`);
    return mockResolve({ data: { success: true } });
  },

  async getUnits(): Promise<ApiResponse<OrganizationUnit[]>> {
    return mockResolve({ data: mockUnits });
  },

  async getUnitById(id: string): Promise<ApiResponse<OrganizationUnit>> {
    const found = mockUnits.find((u) => u.id === id);
    if (!found) throw new Error('Unit not found');
    return mockResolve({ data: found });
  },

  async createUnit(unit: Omit<OrganizationUnit, 'personnelCount' | 'officerCount'>): Promise<ApiResponse<OrganizationUnit>> {
    const newUnit: OrganizationUnit = {
      ...unit,
      personnelCount: 0,
      officerCount: 0
    };
    mockUnits.push(newUnit);
    console.log(`[AUDIT_LOG] UNIT_CREATED - Id: ${unit.id}`);
    return mockResolve({ data: newUnit });
  },

  async getConsentPolicies(): Promise<ApiResponse<ConsentPolicy[]>> {
    return mockResolve({ data: mockConsentPolicies });
  },

  async publishConsentPolicy(id: string): Promise<ApiResponse<{ success: boolean }>> {
    const found = mockConsentPolicies.find((p) => p.id === id);
    if (found) {
      found.status = 'ACTIVE';
      found.effectiveFrom = new Date().toISOString();
    }
    console.log(`[AUDIT_LOG] CONSENT_POLICY_PUBLISHED - Id: ${id}`);
    return mockResolve({ data: { success: true } });
  },

  async getAuditLogs(params: {
    category?: string;
    result?: string;
  } = {}): Promise<ApiResponse<AuditEvent[]>> {
    let list = [...mockAuditLogs];
    if (params.category && params.category !== 'ALL') {
      list = list.filter((l) => l.category === params.category);
    }
    if (params.result && params.result !== 'ALL') {
      list = list.filter((l) => l.result === params.result);
    }
    return mockResolve({ data: list });
  },

  async getModels(): Promise<ApiResponse<ModelVersion[]>> {
    return mockResolve({ data: mockModelVersions });
  },

  async activateModel(id: string): Promise<ApiResponse<{ success: boolean }>> {
    mockModelVersions.forEach((m) => {
      if (m.id === id) {
        m.status = 'ACTIVE';
        m.activatedAt = new Date().toISOString();
      } else if (m.status === 'ACTIVE') {
        m.status = 'RETIRED';
      }
    });
    console.log(`[AUDIT_LOG] MODEL_VERSION_ACTIVATED - Id: ${id}`);
    return mockResolve({ data: { success: true } });
  },

  async getSystemHealth(): Promise<ApiResponse<ServiceHealth[]>> {
    return mockResolve({ data: mockServiceHealths });
  },

  async getSettings(): Promise<ApiResponse<SystemSettings>> {
    return mockResolve({ data: mockSystemSettings });
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<ApiResponse<{ success: boolean }>> {
    mockSystemSettings = {
      ...mockSystemSettings,
      ...settings
    };
    console.log(`[AUDIT_LOG] SYSTEM_SETTINGS_UPDATED`);
    return mockResolve({ data: { success: true } });
  }
};

export default adminService;
