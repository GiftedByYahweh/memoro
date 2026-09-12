import { computed, ref } from 'vue';
import { apiClient } from '@/api';
import type { ApiResponse, AuthUserDto, LoginDto, RegisterDto } from '@memoro/shared';

const user = ref<AuthUserDto | null>(null);
const isLoading = ref(false);
const isHydrated = ref(false);

const isAuthenticated = computed(() => user.value !== null);

async function login(dto: LoginDto): Promise<ApiResponse<AuthUserDto>> {
  isLoading.value = true;
  try {
    const response = await apiClient.auth.login(dto);
    if (response.success) user.value = response.data;
    return response;
  } finally {
    isLoading.value = false;
  }
}

async function register(dto: RegisterDto): Promise<ApiResponse<AuthUserDto>> {
  isLoading.value = true;
  try {
    return await apiClient.auth.register(dto);
  } finally {
    isLoading.value = false;
  }
}

async function logout(): Promise<ApiResponse<null>> {
  isLoading.value = true;
  try {
    const response = await apiClient.auth.logout();
    if (response.success) user.value = null;
    return response;
  } finally {
    isLoading.value = false;
  }
}

async function ensureHydrated(): Promise<void> {
  if (isHydrated.value) return;
  try {
    const response = await apiClient.auth.session();
    user.value = response.success ? response.data : null;
  } catch {
    user.value = null;
  } finally {
    isHydrated.value = true;
  }
}

export function useAuth() {
  return {
    user: computed(() => user.value),
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    isHydrated: computed(() => isHydrated.value),
    login,
    register,
    logout,
    ensureHydrated,
  };
}
