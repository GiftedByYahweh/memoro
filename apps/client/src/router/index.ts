import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import ComponentsPage from '../pages/ComponentsPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/components',
  },
  {
    path: '/components',
    name: 'components',
    component: ComponentsPage,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
