import type { RouteRecordRaw } from 'vue-router';
import { checkIsStandalone } from '@/composables/usePwaInstall';

export const RoutePaths = {
  landing: {
    name: 'landing',
    path: '/download-app',
  },
  login: {
    name: 'login',
    path: '/login',
    guest: true,
  },
  registration: {
    name: 'registration',
    path: '/registration',
    guest: true,
  },
  restore: {
    name: 'restore',
    path: '/restore',
    guest: true,
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
  createMedia: {
    name: 'create-media',
    path: '/media/new',
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

export type RoutePathKey = keyof typeof RoutePaths;

export const appLayouts = {
  auth: 'AuthLayout',
  main: 'MainLayout',
} as const;

export type AppLayout = (typeof appLayouts)[keyof typeof appLayouts];

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: () => {
      if (checkIsStandalone()) {
        return RoutePaths.map.path;
      }
      return RoutePaths.landing.path;
    },
  },
  {
    path: RoutePaths.landing.path,
    name: RoutePaths.landing.name,
    component: () => import('../pages/LandingPage.vue'),
    meta: { layout: appLayouts.auth },
  },
  {
    path: RoutePaths.login.path,
    name: RoutePaths.login.name,
    component: () => import('../pages/LoginPage.vue'),
    meta: { layout: appLayouts.auth, guestOnly: RoutePaths.login.guest },
  },
  {
    path: RoutePaths.registration.path,
    name: RoutePaths.registration.name,
    component: () => import('../pages/RegistrationPage.vue'),
    meta: { layout: appLayouts.auth, guestOnly: RoutePaths.registration.guest },
  },
  {
    path: RoutePaths.restore.path,
    name: RoutePaths.restore.name,
    component: () => import('../pages/RestorePasswordPage.vue'),
    meta: { layout: appLayouts.auth, guestOnly: RoutePaths.restore.guest },
  },
  {
    path: RoutePaths.map.path,
    name: RoutePaths.map.name,
    component: () => import('../pages/MapPage.vue'),
    meta: { layout: appLayouts.main, requiresAuth: RoutePaths.map.auth },
  },
  {
    path: RoutePaths.feed.path,
    name: RoutePaths.feed.name,
    component: () => import('../pages/FeedPage.vue'),
    meta: { layout: appLayouts.main, requiresAuth: RoutePaths.feed.auth },
  },
  {
    path: RoutePaths.createMedia.path,
    name: RoutePaths.createMedia.name,
    component: () => import('../pages/CreateMediaPage.vue'),
    meta: { layout: appLayouts.main, requiresAuth: RoutePaths.createMedia.auth },
  },
  {
    path: RoutePaths.albums.path,
    name: RoutePaths.albums.name,
    component: () => import('../pages/AlbumsPage.vue'),
    meta: { layout: appLayouts.main, requiresAuth: RoutePaths.albums.auth },
  },
  {
    path: RoutePaths.profile.path,
    name: RoutePaths.profile.name,
    component: () => import('../pages/ProfilePage.vue'),
    meta: { layout: appLayouts.main, requiresAuth: RoutePaths.profile.auth },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: RoutePaths.map.path,
  },
];
