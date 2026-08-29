import { mockResolve, mockReject } from '@/lib/mockAdapter';
import type { AuthUser, AuthTokens } from '@/types/auth';
import type { ApiResponse } from '@/types/api';
import { apiClient } from '@/services/apiClient';

export const MOCK_USERS: AuthUser[] = [
  { 
    id: 'u-001', 
    displayName: 'Demo Personnel A', 
    serviceId: 'PERS001', 
    role: 'PERSONNEL', 
    unitId: 'UNIT-7', 
    permissions: ['view:own-wellness', 'edit:own-checkin'], 
    avatarInitials: 'DP' 
  },
  { 
    id: 'u-002', 
    displayName: 'Demo Officer A', 
    serviceId: 'OFF001', 
    role: 'WELFARE_OFFICER', 
    unitId: 'UNIT-7', 
    permissions: ['view:cases', 'edit:interventions'], 
    avatarInitials: 'DO' 
  },
  { 
    id: 'u-003', 
    displayName: 'Demo Commander A', 
    serviceId: 'CMD001', 
    role: 'COMMANDER', 
    unitId: 'UNIT-7', 
    permissions: ['view:aggregate'], 
    avatarInitials: 'DC' 
  },
  { 
    id: 'u-004', 
    displayName: 'Demo Admin A', 
    serviceId: 'ADM001', 
    role: 'ADMIN', 
    permissions: ['manage:users', 'manage:config'], 
    avatarInitials: 'DA' 
  },
];

// Helper to base64url encode JSON objects
const encodeBase64Url = (obj: any): string => {
  const jsonStr = JSON.stringify(obj);
  return btoa(unescape(encodeURIComponent(jsonStr)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

// Helper to base64url decode
export const decodeBase64Url = (str: string): any => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const jsonStr = decodeURIComponent(escape(atob(base64)));
  return JSON.parse(jsonStr);
};

// Generator for mock decodable JWTs (not cryptographically real, but decodable)
const generateMockJwt = (payload: any): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  return `${encodeBase64Url(header)}.${encodeBase64Url(payload)}.mock_signature_signature`;
};

// Expose token decoder
export const decodeJwtPayload = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return decodeBase64Url(parts[1]);
  } catch {
    return null;
  }
};

export const authService = {
  async login(serviceId: string, password: string): Promise<ApiResponse<{ tokens: AuthTokens; user: AuthUser }>> {
    const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

    if (!useMocks) {
      try {
        const response = await apiClient.post<any>('/auth/login', { username: serviceId, password });

        const accessToken = response.access_token;
        const refreshToken = response.access_token;

        sessionStorage.setItem('kavach_at', accessToken);
        sessionStorage.setItem('kavach_rt', refreshToken);

        const realUser: AuthUser = {
            id: response.user.id,
            displayName: response.user.id,
            serviceId: response.user.id,
            role: response.user.role as AuthUser['role'],
            unitId: 'UNIT-REAL',
            permissions: [],
            avatarInitials: response.user.id.substring(0, 2).toUpperCase()
        };

        return {
          data: {
            tokens: { accessToken, refreshToken },
            user: realUser,
          }
        };
      } catch (err) {
        return mockReject('Invalid credentials.', 'UNAUTHORIZED', 401) as any;
      }
    }

    // Mock Implementation
    const foundUser = MOCK_USERS.find((u) => u.serviceId === serviceId);
    
    if (!foundUser || password !== 'demo1234') {
      return mockReject('Invalid Service ID or password. Use the demo password: "demo1234"', 'UNAUTHORIZED', 401) as any;
    }

    const iat = Math.floor(Date.now() / 1000);
    const expAccess = iat + 15 * 60; // 15 mins expiry
    const expRefresh = iat + 7 * 24 * 60 * 60; // 7 days expiry

    const accessToken = generateMockJwt({
      sub: foundUser.id,
      role: foundUser.role,
      permissions: foundUser.permissions,
      serviceId: foundUser.serviceId,
      displayName: foundUser.displayName,
      exp: expAccess,
      iat,
    });

    const refreshToken = generateMockJwt({
      sub: foundUser.id,
      exp: expRefresh,
      iat,
    });

    sessionStorage.setItem('kavach_at', accessToken);
    sessionStorage.setItem('kavach_rt', refreshToken);

    return mockResolve({
      data: {
        tokens: { accessToken, refreshToken },
        user: foundUser,
      },
    });
  },

  async logout(): Promise<ApiResponse<void>> {
    sessionStorage.removeItem('kavach_at');
    sessionStorage.removeItem('kavach_rt');
    return mockResolve({
      data: undefined as any,
    });
  },

  async refresh(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';
    if (!useMocks) {
      const response = await apiClient.post<{ access_token: string }>('/auth/refresh', undefined);
      const accessToken = response.access_token;
      sessionStorage.setItem('kavach_at', accessToken);
      sessionStorage.setItem('kavach_rt', accessToken);
      return { data: { accessToken, refreshToken: accessToken } };
    }
    try {
      const payload = decodeJwtPayload(refreshToken);
      if (!payload || payload.exp < Date.now() / 1000) {
        return mockReject('Refresh token expired or invalid.', 'UNAUTHORIZED', 401) as any;
      }

      const foundUser = MOCK_USERS.find((u) => u.id === payload.sub);
      if (!foundUser) {
        return mockReject('User record not found.', 'NOT_FOUND', 404) as any;
      }

      const iat = Math.floor(Date.now() / 1000);
      const expAccess = iat + 15 * 60;
      const expRefresh = iat + 7 * 24 * 60 * 60;

      const accessToken = generateMockJwt({
        sub: foundUser.id,
        role: foundUser.role,
        permissions: foundUser.permissions,
        serviceId: foundUser.serviceId,
        displayName: foundUser.displayName,
        exp: expAccess,
        iat,
      });

      const newRefreshToken = generateMockJwt({
        sub: foundUser.id,
        exp: expRefresh,
        iat,
      });

      sessionStorage.setItem('kavach_rt', newRefreshToken);

      return mockResolve({
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch {
      return mockReject('Failed to parse refresh token.', 'UNAUTHORIZED', 401) as any;
    }
  },

  async me(accessToken: string): Promise<ApiResponse<AuthUser>> {
    const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';
    if (!useMocks) {
      const response = await apiClient.get<{ id: string; role: AuthUser['role'] }>('/auth/me');
      return {
        data: {
          id: response.id,
          displayName: response.id,
          serviceId: response.id,
          role: response.role,
          unitId: 'UNIT-REAL',
          permissions: [],
          avatarInitials: response.id.substring(0, 2).toUpperCase(),
        },
      };
    }
    try {
      const payload = decodeJwtPayload(accessToken);
      if (!payload || payload.exp < Date.now() / 1000) {
        return mockReject('Access token expired.', 'UNAUTHORIZED', 401) as any;
      }

      const foundUser = MOCK_USERS.find((u) => u.id === payload.sub);
      if (!foundUser) {
        return mockReject('User not found.', 'NOT_FOUND', 404) as any;
      }

      return mockResolve({
        data: foundUser,
      });
    } catch {
      return mockReject('Invalid access token.', 'UNAUTHORIZED', 401) as any;
    }
  },
};
export default authService;
