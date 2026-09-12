import { computed, ref } from 'vue';
import type { ApiResponse, AuthUserDto, LoginDto, RegisterDto } from '@memoro/shared';

const MOCK_STORAGE_KEY = 'memoro_mock_user';
const MOCK_USER_ID = 'mock-user-demo-id';
const DEFAULT_DEMO_EMAIL = 'demo@memoro.app';
const MOCK_TIMESTAMP = '2026-01-01T00:00:00.000Z';

const DEFAULT_MOCK_USER: AuthUserDto = {
  id: MOCK_USER_ID,
  email: DEFAULT_DEMO_EMAIL,
  createdAt: MOCK_TIMESTAMP,
};

function createMockUser(email: string): AuthUserDto {
  return {
    id: MOCK_USER_ID,
    email,
    createdAt: MOCK_TIMESTAMP,
  };
}

const user = ref<AuthUserDto | null>(null);
const isLoading = ref(false);
const isHydrated = ref(false);

const isAuthenticated = computed(() => user.value !== null);

async function login(dto: LoginDto): Promise<ApiResponse<AuthUserDto>> {
  isLoading.value = true;
  try {
    await Promise.resolve();
    const mockUser = createMockUser(dto.email);
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockUser));
    user.value = mockUser;
    return {
      success: true,
      data: mockUser,
      timestamp: Date.now(),
    };
  } finally {
    isLoading.value = false;
  }
}

async function register(dto: RegisterDto): Promise<ApiResponse<AuthUserDto>> {
  isLoading.value = true;
  try {
    await Promise.resolve();
    const mockUser = createMockUser(dto.email);
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockUser));
    return {
      success: true,
      data: mockUser,
      timestamp: Date.now(),
    };
  } finally {
    isLoading.value = false;
  }
}

async function logout(): Promise<ApiResponse<null>> {
  isLoading.value = true;
  try {
    await Promise.resolve();
    localStorage.removeItem(MOCK_STORAGE_KEY);
    user.value = null;
    return {
      success: true,
      data: null,
      timestamp: Date.now(),
    };
  } finally {
    isLoading.value = false;
  }
}

async function ensureHydrated(): Promise<void> {
  if (isHydrated.value) {
    return;
  }
  try {
    await Promise.resolve();
    const stored = localStorage.getItem(MOCK_STORAGE_KEY);
    if (stored) {
      user.value = JSON.parse(stored) as AuthUserDto;
    } else {
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(DEFAULT_MOCK_USER));
      user.value = DEFAULT_MOCK_USER;
    }
  } catch {
    user.value = DEFAULT_MOCK_USER;
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
