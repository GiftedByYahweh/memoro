import { apiClient } from '@/api';
import type { ApiResponse, AuthUserDto, LoginDto, RegisterDto } from '@memoro/shared';

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
};
