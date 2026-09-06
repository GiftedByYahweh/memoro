import { ERROR_MESSAGES } from '@/utils/error-messages';
import { type DomainErrorCode, type ApiResponse, type ApiErrorResponse } from '@memoro/shared';

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
  errorCode: DomainErrorCode | null = null,
  message?: string,
): ApiErrorResponse {
  return {
    success: false,
    errorCode,
    message: message ?? ERROR_MESSAGES.SOMETHING_WENT_WRONG,
    data: null,
    timestamp: Date.now(),
  };
}

async function handleFetchResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (response.status === 204) return { success: true, data: null as T };
  const result = (await response.json()) as ApiResponse<T>;
  if (!result.success) return toErrorResponse(result.errorCode, result.message);
  return result;
}

async function sendRequest<T>(baseUrl: string, payload: SendPayload): Promise<ApiResponse<T>> {
  const { url, data, method, options = {} } = payload;
  const fullPath = `${baseUrl}${url}`;
  try {
    const response = await fetch(fullPath, {
      ...options,
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
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
