import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { RoutePaths, routes } from './routes';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
