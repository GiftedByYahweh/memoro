import { createRouter, createWebHistory } from 'vue-router';
import { RoutePaths } from '@memoro/shared';
import { useAuth } from '@/composables/useAuth';
import { routes } from './routes';

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const { isAuthenticated, ensureHydrated } = useAuth();
  await ensureHydrated();

  const isAuthPage = to.name === RoutePaths.auth.name;

  if (!isAuthenticated.value && to.meta.requiresAuth) {
    return { name: RoutePaths.auth.name };
  }

  if (isAuthenticated.value && isAuthPage) {
    return { name: RoutePaths.map.name };
  }

  return true;
});

export default router;

