const API_PREFIX = '/api';

export const ApiRoutes = {
  health: `${API_PREFIX}/health`,
  auth: {
    prefix: `${API_PREFIX}/auth`,
    register: '/register',
    login: '/login',
    logout: '/logout',
    session: '/session',
  },
} as const;
