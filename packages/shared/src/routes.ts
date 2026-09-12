export const ApiRoutes = {
  health: '/health',
  auth: {
    prefix: '/auth',
    register: '/register',
    login: '/login',
    logout: '/logout',
    session: '/session',
  },
} as const;
