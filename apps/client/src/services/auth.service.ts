import { apiClient } from '@/api';
import type {
  ApiResponse,
  AuthUserDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  SendVerificationCodeDto,
  VerifyCodeDto,
} from '@memoro/shared';

export const authService = {
  login: (data: LoginDto): Promise<ApiResponse<AuthUserDto>> => {
    return apiClient.auth.login(data);
  },
  register: (data: RegisterDto): Promise<ApiResponse<AuthUserDto>> => {
    return apiClient.auth.register(data);
  },
  logout: (): Promise<ApiResponse<Record<string, never>>> => {
    return apiClient.auth.logout();
  },
  session: (): Promise<ApiResponse<AuthUserDto>> => {
    return apiClient.auth.session();
  },
  sendCode: (data: SendVerificationCodeDto): Promise<ApiResponse<{ sent: boolean }>> => {
    return apiClient.auth.sendCode(data);
  },
  verifyCode: (data: VerifyCodeDto): Promise<ApiResponse<{ verified: boolean }>> => {
    return apiClient.auth.verifyCode(data);
  },
  resetPassword: (data: ResetPasswordDto): Promise<ApiResponse<{ success: boolean }>> => {
    return apiClient.auth.resetPassword(data);
  },
};
