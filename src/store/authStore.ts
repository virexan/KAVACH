import { create } from 'zustand';
import { authService } from '@/services/authService';
import { queryClient } from '@/lib/queryClient';
import type { AuthUser } from '@/types/auth';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (serviceId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,

  login: async (serviceId, password) => {
    try {
      const response = await authService.login(serviceId, password);
      const { tokens, user } = response.data;
      set({
        user,
        accessToken: tokens.accessToken,
        isAuthenticated: true,
      });
      // Set non-sensitive session flag in sessionStorage
      sessionStorage.setItem('kavach_has_session', 'true');
    } catch (error) {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
      sessionStorage.removeItem('kavach_has_session');
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors in mock context
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isInitializing: false,
      });
      sessionStorage.removeItem('kavach_has_session');
      sessionStorage.removeItem('kavach_rt');
      // Clear TanStack query caches to protect user privacy on logout
      queryClient.clear();
    }
  },

  refresh: async () => {
    const rt = sessionStorage.getItem('kavach_rt');
    if (!rt) {
      set({ isAuthenticated: false, user: null, accessToken: null });
      return false;
    }

    try {
      const refreshResponse = await authService.refresh(rt);
      const { accessToken } = refreshResponse.data;
      
      const meResponse = await authService.me(accessToken);
      set({
        accessToken,
        user: meResponse.data,
        isAuthenticated: true,
      });
      sessionStorage.setItem('kavach_has_session', 'true');
      return true;
    } catch {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
      sessionStorage.removeItem('kavach_has_session');
      sessionStorage.removeItem('kavach_rt');
      return false;
    }
  },

  initialize: async () => {
    const hasSession = sessionStorage.getItem('kavach_has_session') === 'true';
    if (hasSession) {
      await get().refresh();
    }
    set({ isInitializing: false });
  },
}));
export default useAuthStore;
