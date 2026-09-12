import { ApiRoutes } from '@memoro/shared';
import type { HttpTransport } from './httpTransport';

const authApi = (transport: HttpTransport) => ({
  login: <T = unknown>(data: unknown) =>
    transport.post<T>(`${ApiRoutes.auth.prefix}${ApiRoutes.auth.login}`, data),
  logout: <T = unknown>() => transport.post<T>(`${ApiRoutes.auth.prefix}${ApiRoutes.auth.logout}`),
  session: <T = unknown>() => transport.get<T>(`${ApiRoutes.auth.prefix}${ApiRoutes.auth.session}`),
});

export { authApi };
