/// <reference types="vite/client" />
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = {
  getHeaders() {
    const tokenStr = sessionStorage.getItem('kavach_at');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (tokenStr) {
      headers['Authorization'] = `Bearer ${tokenStr}`;
    }
    return headers;
  },

  async get<T>(url: string): Promise<T> {
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    const response = await fetch(fullUrl, { headers: this.getHeaders() });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  
  async post<T>(url: string, body: any): Promise<T> {
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};
