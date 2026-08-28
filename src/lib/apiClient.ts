import type { ApiResponse, ApiError } from '@/types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const IS_PROD = import.meta.env.PROD;

export interface RequestConfig extends RequestInit {
  url: string;
  params?: Record<string, string>;
}

export const apiClient = {
  useMocks: () => USE_MOCKS,

  async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const { url, params, headers, ...rest } = config;

    // Construct URL with query parameters
    let requestUrl = `${BASE_URL}${url}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      requestUrl += `?${searchParams.toString()}`;
    }

    // Default headers
    const requestHeaders = new Headers(headers);
    if (!requestHeaders.has('Content-Type') && !(rest.body instanceof FormData)) {
      requestHeaders.set('Content-Type', 'application/json');
    }

    // Log request parameters if not in production (protecting privacy)
    if (!IS_PROD) {
      console.log(`[API Request] ${rest.method || 'GET'} ${requestUrl}`);
    }

    try {
      const response = await fetch(requestUrl, {
        ...rest,
        headers: requestHeaders,
      });

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          // Response is not JSON
        }
        
        const apiError: ApiError = {
          status: response.status,
          code: errorData.code || 'HTTP_ERROR',
          message: errorData.message || `Request failed with status ${response.status}`,
          details: errorData.details || undefined,
        };

        if (!IS_PROD) {
          console.error('[API Error]', apiError);
        }
        throw apiError;
      }

      const responseData: ApiResponse<T> = await response.json();
      return responseData;
    } catch (error: any) {
      if (error.status && error.code) {
        // Already normalized
        throw error;
      }

      // Local network/fetch crash
      const normalizedError: ApiError = {
        status: 500,
        code: 'NETWORK_ERROR',
        message: error.message || 'Network request failed or server is unreachable',
      };
      
      if (!IS_PROD) {
        console.error('[API Connection Error]', normalizedError);
      }
      throw normalizedError;
    }
  },

  get<T>(url: string, params?: Record<string, string>, config?: Omit<RequestConfig, 'url' | 'params'>) {
    return this.request<T>({ ...config, url, params, method: 'GET' });
  },

  post<T>(url: string, body?: any, config?: Omit<RequestConfig, 'url' | 'body'>) {
    return this.request<T>({
      ...config,
      url,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(url: string, body?: any, config?: Omit<RequestConfig, 'url' | 'body'>) {
    return this.request<T>({
      ...config,
      url,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(url: string, config?: Omit<RequestConfig, 'url'>) {
    return this.request<T>({ ...config, url, method: 'DELETE' });
  },
};
export default apiClient;
