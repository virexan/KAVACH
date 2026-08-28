export type Role = 'PERSONNEL' | 'WELFARE_OFFICER' | 'COMMANDER' | 'ADMIN';

export interface AuthUser {
  id: string;
  displayName: string;
  serviceId: string;
  role: Role;
  unitId?: string;
  permissions: string[];
  avatarInitials: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
