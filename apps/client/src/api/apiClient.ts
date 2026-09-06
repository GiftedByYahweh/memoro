import type { HttpTransport } from './httpTransport';

const authApi = (transport: HttpTransport) => ({
  login: <T = unknown>(data: unknown) => transport.post<T>('/auth/login', data),
  logout: <T = unknown>() => transport.post<T>('/auth/logout'),
  session: <T = unknown>() => transport.get<T>('/auth/session'),
});

export { authApi }
