import {
  type AppErrorCode,
  HttpStatusCode,
  type ApiResponse,
  type ApiErrorResponse,
} from '@memoro/shared';

export interface RequestOptions extends Omit<RequestInit, 'body' | 'method' | 'headers'> {
  readonly headers?: Record<string, string>;
}

export interface HttpTransport {
  get<T = unknown>(url: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  post<T = unknown>(url: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>>;
  patch<T = unknown>(
    url: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>>;
  delete<T = unknown>(url: string, options?: RequestOptions): Promise<ApiResponse<T>>;
}

interface SendPayload {
  readonly method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  readonly url: string;
  readonly data?: unknown;
  readonly options?: RequestOptions;
}

function toErrorResponse(
  message = '',
  code: AppErrorCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
): ApiErrorResponse {
  return {
    success: false,
    code,
    message,
    timestamp: Date.now(),
  };
}

async function handleFetchResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (response.status === 204) {
    return { success: true, data: null as T, timestamp: Date.now() };
  }
  const result = (await response.json()) as ApiResponse<T>;
  if (!result.success) return result;
  return result;
}

async function sendRequest<T>(baseUrl: string, payload: SendPayload): Promise<ApiResponse<T>> {
  const { url, data, method, options = {} } = payload;
  const fullPath = `${baseUrl}${url}`;
  try {
    const headers: Record<string, string> = { ...options.headers };

    if (data) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(fullPath, {
      ...options,
      method,
      credentials: 'include',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    return await handleFetchResponse<T>(response);
  } catch {
    return toErrorResponse();
  }
}

export const createTransport = (baseUrl: string): HttpTransport => ({
  get: <T = unknown>(url: string, options?: RequestOptions) =>
    sendRequest<T>(baseUrl, { method: 'GET', url, options }),

  post: <T = unknown>(url: string, data?: unknown, options?: RequestOptions) =>
    sendRequest<T>(baseUrl, { method: 'POST', url, data, options }),

  patch: <T = unknown>(url: string, data?: unknown, options?: RequestOptions) =>
    sendRequest<T>(baseUrl, { method: 'PATCH', url, data, options }),

  delete: <T = unknown>(url: string, options?: RequestOptions) =>
    sendRequest<T>(baseUrl, { method: 'DELETE', url, options }),
});
