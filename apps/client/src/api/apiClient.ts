import { ApiRoutes, type AuthUserDto, type LoginDto, type RegisterDto } from '@memoro/shared';
import type { HttpTransport } from './httpTransport';

const authApi = (transport: HttpTransport) => ({
  register: (data: RegisterDto) =>
    transport.post<AuthUserDto>(`${ApiRoutes.auth.prefix}${ApiRoutes.auth.register}`, data),
  login: (data: LoginDto) =>
    transport.post<AuthUserDto>(`${ApiRoutes.auth.prefix}${ApiRoutes.auth.login}`, data),
  logout: () => transport.post<null>(`${ApiRoutes.auth.prefix}${ApiRoutes.auth.logout}`),
  session: () => transport.get<AuthUserDto>(`${ApiRoutes.auth.prefix}${ApiRoutes.auth.session}`),
});

export { authApi };
