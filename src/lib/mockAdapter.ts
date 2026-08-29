/**
 * Helper to simulate network latency for demos and testing components.
 */
export const mockResolve = <T>(payload: T, delayMs?: number): Promise<T> => {
  if (import.meta.env.VITE_USE_MOCKS !== 'true') {
    return Promise.reject({
      status: 501,
      code: 'MOCK_DATA_DISABLED',
      message: 'This capability is not connected to the production API.',
    });
  }
  const latency = delayMs ?? Math.floor(Math.random() * (600 - 200 + 1) + 200);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(payload);
    }, latency);
  });
};

/**
 * Helper to simulate API failure conditions.
 */
export const mockReject = (
  message: string,
  code = 'MOCK_ERROR',
  status = 400,
  delayMs?: number
): Promise<never> => {
  const latency = delayMs ?? Math.floor(Math.random() * (600 - 200 + 1) + 200);
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject({
        status,
        code,
        message,
      });
    }, latency);
  });
};
