// Standard success envelope
export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
}

// Standard error envelope
export interface ApiError {
  status: number;
  code: string;        // e.g. "VALIDATION_ERROR", "NOT_FOUND"
  message: string;      // human-readable, safe to display
  details?: Record<string, unknown>;
}
