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

export const RoutePaths = {
  auth: {
    name: 'auth',
    path: '/auth',
  },
  map: {
    name: 'map',
    path: '/map',
    auth: true,
  },
  feed: {
    name: 'feed',
    path: '/feed',
    auth: true,
  },
  albums: {
    name: 'albums',
    path: '/albums',
    auth: true,
  },
  profile: {
    name: 'profile',
    path: '/profile',
    auth: true,
  },
} as const;
