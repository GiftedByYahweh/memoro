import {
  ApiRoutes,
  type AbortMediaUploadDto,
  type AuthUserDto,
  type CompleteMediaUploadDto,
  type CreateMediaDto,
  type CreateMediaResponseDto,
  type LoginDto,
  type MediaDto,
  type RegisterDto,
  type ResetPasswordDto,
  type SendVerificationCodeDto,
  type VerifyCodeDto,
} from '@memoro/shared';
import type { HttpTransport } from './httpTransport';

const authApi = (transport: HttpTransport) => ({
  register: (data: RegisterDto) =>
    transport.post<AuthUserDto>(`${ApiRoutes.auth.prefix}${ApiRoutes.auth.register}`, data),
  login: (data: LoginDto) =>
    transport.post<AuthUserDto>(`${ApiRoutes.auth.prefix}${ApiRoutes.auth.login}`, data),
  logout: () =>
    transport.post<Record<string, never>>(`${ApiRoutes.auth.prefix}${ApiRoutes.auth.logout}`),
  session: () => transport.get<AuthUserDto>(`${ApiRoutes.auth.prefix}${ApiRoutes.auth.session}`),
  sendCode: (data: SendVerificationCodeDto) =>
    transport.post<{ sent: boolean }>(`${ApiRoutes.auth.prefix}${ApiRoutes.auth.sendCode}`, data),
  verifyCode: (data: VerifyCodeDto) =>
    transport.post<{ verified: boolean }>(
      `${ApiRoutes.auth.prefix}${ApiRoutes.auth.verifyCode}`,
      data,
    ),
  resetPassword: (data: ResetPasswordDto) =>
    transport.post<{ success: boolean }>(
      `${ApiRoutes.auth.prefix}${ApiRoutes.auth.resetPassword}`,
      data,
    ),
});

const mediaApi = (transport: HttpTransport) => ({
  create: (data: CreateMediaDto) =>
    transport.post<CreateMediaResponseDto>(
      `${ApiRoutes.media.prefix}${ApiRoutes.media.root}`,
      data,
    ),
  complete: (id: string, data: CompleteMediaUploadDto) =>
    transport.post<MediaDto>(`${ApiRoutes.media.prefix}/${id}/complete`, data),
  abort: (id: string, data: AbortMediaUploadDto) =>
    transport.post<Record<string, never>>(`${ApiRoutes.media.prefix}/${id}/abort`, data),
  uploadToUrl: (url: string, file: Blob, contentType: string) =>
    transport.put<{ etag?: string }>(url, file, {
      headers: { 'Content-Type': contentType },
      credentials: 'omit',
    }),
});

export { authApi, mediaApi };
