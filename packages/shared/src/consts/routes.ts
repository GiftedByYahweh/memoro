const API_PREFIX = '/api';

export const ApiRoutes = {
  health: `${API_PREFIX}/health`,
  auth: {
    prefix: `${API_PREFIX}/auth`,
    register: '/register',
    login: '/login',
    logout: '/logout',
    session: '/session',
    sendCode: '/send-code',
    verifyCode: '/verify-code',
    resetPassword: '/reset-password',
  },
  media: {
    prefix: `${API_PREFIX}/media`,
    root: '/',
    byId: '/:id',
    complete: '/:id/complete',
    abort: '/:id/abort',
  },
} as const;
