import type { RouteRecordRaw } from 'vue-router';
import { RoutePaths } from '@memoro/shared';

export const appLayouts = {
  auth: 'AuthLayout',
  main: 'MainLayout',
} as const;

export type AppLayout = (typeof appLayouts)[keyof typeof appLayouts];

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: RoutePaths.map.path,
  },
  {
    path: RoutePaths.auth.path,
    name: RoutePaths.auth.name,
    component: () => import('../pages/AuthPage.vue'),
    meta: { layout: appLayouts.auth },
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
