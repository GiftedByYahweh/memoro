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
    path: '/:pathMatch(.*)*',
    redirect: RoutePaths.map.path,
  },
];
