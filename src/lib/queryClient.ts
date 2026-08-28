import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { useUIStore } from '@/store/uiStore';
import type { ApiError } from '@/types/api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      retry: 1,         // avoid hammering endpoints
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: async (error, query) => {
      const apiError = error as unknown as ApiError;
      
      // Global 401 Interceptor (FR-15)
      if (apiError.status === 401) {
        try {
          const { useAuthStore } = await import('@/store/authStore');
          const refreshed = await useAuthStore.getState().refresh();
          if (refreshed) {
            queryClient.refetchQueries({ queryKey: query.queryKey });
            return;
          } else {
            await useAuthStore.getState().logout();
            window.location.href = '/session-expired';
            return;
          }
        } catch {
          window.location.href = '/session-expired';
          return;
        }
      }

      useUIStore.getState().addToast({
        type: 'error',
        title: 'Query Failed',
        message: apiError.message || 'An unexpected error occurred while fetching data.',
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: async (error) => {
      const apiError = error as unknown as ApiError;
      
      // Global 401 Interceptor (FR-15)
      if (apiError.status === 401) {
        try {
          const { useAuthStore } = await import('@/store/authStore');
          const refreshed = await useAuthStore.getState().refresh();
          if (!refreshed) {
            await useAuthStore.getState().logout();
            window.location.href = '/session-expired';
            return;
          }
          return;
        } catch {
          window.location.href = '/session-expired';
          return;
        }
      }

      useUIStore.getState().addToast({
        type: 'error',
        title: 'Action Failed',
        message: apiError.message || 'An unexpected error occurred during submission.',
      });
    },
  }),
});
export default queryClient;
