<script setup lang="ts">
import { useRouter } from 'vue-router';
import { RoutePaths } from '@/router/routes';
import AppButton from '@/components/shared/AppButton.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { user, logout, isLoading } = useAuth();

async function handleLogout(): Promise<void> {
  await logout();
  await router.push(RoutePaths.auth.path);
}
</script>

<template>
  <main class="profile-page">
    <header class="page-header">
      <h1 class="page-title">Profile</h1>
    </header>
    <div class="profile-card">
      <div class="avatar-wrap">
        <AppIcon name="user" :size="36" color="primary" />
      </div>
      <div class="user-info">
        <p class="user-email">{{ user?.email ?? 'User' }}</p>
        <p class="user-role">Free Plan</p>
      </div>
    </div>
    <div class="profile-actions">
      <AppButton variant="danger" size="md" :loading="isLoading" block @click="handleLogout">
        Sign Out
      </AppButton>
    </div>
  </main>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: var(--color-oled-black);
  padding: var(--space-xl) var(--space-md)
    calc(var(--bottom-nav-height) + var(--safe-bottom) + var(--space-xl));
  box-sizing: border-box;
}

.page-header {
  margin-bottom: var(--space-xl);
}

.page-title {
  font-family: var(--font-sans);
  font-size: var(--space-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface-card);
  border: 1px solid var(--border-subtle);
  margin-bottom: var(--space-2xl);
}

.avatar-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background-color: var(--color-surface-elevated);
  border: 1px solid var(--border-subtle);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.user-email {
  font-family: var(--font-sans);
  font-size: var(--space-md);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.user-role {
  font-family: var(--font-sans);
  font-size: var(--space-sm);
  color: var(--color-text-tertiary);
  margin: 0;
}

.profile-actions {
  margin-top: auto;
}
</style>
