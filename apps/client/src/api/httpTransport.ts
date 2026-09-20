import {
  type AppErrorCode,
  HttpStatusCode,
  type ApiResponse,
  type ApiErrorResponse,
} from '@memoro/shared';

export interface RequestOptions extends Omit<RequestInit, 'body' | 'method' | 'headers'> {
  readonly headers?: Record<string, string>;
  readonly credentials?: RequestCredentials;
}

export interface HttpTransport {
  get<T = unknown>(url: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  post<T = unknown>(url: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>>;
  put<T = unknown>(url: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>>;
  patch<T = unknown>(
    url: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>>;
  delete<T = unknown>(url: string, options?: RequestOptions): Promise<ApiResponse<T>>;
}

interface SendPayload {
  readonly method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
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
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return (await response.json()) as ApiResponse<T>;
  }

  if (response.ok) {
    return { success: true, data: null as T, timestamp: Date.now() };
  }

  return toErrorResponse(response.statusText);
}

function isBinaryData(data: unknown): data is Blob | ArrayBuffer | FormData {
  return data instanceof Blob || data instanceof ArrayBuffer || data instanceof FormData;
}

function prepareBody(data: unknown, headers: Record<string, string>): BodyInit | undefined {
  if (data === undefined || data === null) return undefined;
  if (isBinaryData(data)) return data;

  headers['Content-Type'] ??= 'application/json';
  return JSON.stringify(data);
}

async function sendRequest<T>(baseUrl: string, payload: SendPayload): Promise<ApiResponse<T>> {
  const { url, data, method, options = {} } = payload;
  const fullPath = `${baseUrl}${url}`;
  try {
    const headers: Record<string, string> = { ...options.headers };
    const body = prepareBody(data, headers);

    const response = await fetch(fullPath, {
      method,
      credentials: 'include',
      ...options,
      headers,
      body,
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

  put: <T = unknown>(url: string, data?: unknown, options?: RequestOptions) =>
    sendRequest<T>(baseUrl, { method: 'PUT', url, data, options }),

  patch: <T = unknown>(url: string, data?: unknown, options?: RequestOptions) =>
    sendRequest<T>(baseUrl, { method: 'PATCH', url, data, options }),

  delete: <T = unknown>(url: string, options?: RequestOptions) =>
    sendRequest<T>(baseUrl, { method: 'DELETE', url, options }),
});
