<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { RoutePaths } from '@/router/routes';
import AppButton from '@/components/shared/AppButton.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import AppPageHeader from '@/components/shared/AppPageHeader.vue';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { t } = useI18n();
const { user, logout, isLoading } = useAuth();

async function handleLogout(): Promise<void> {
  await logout();
  await router.push(RoutePaths.auth.path);
}
</script>

<template>
  <main class="page-container">
    <AppPageHeader :title="t('profile.title')" />
    <div class="profile-card">
      <div class="avatar-wrap">
        <AppIcon name="user" :size="36" color="primary" />
      </div>
      <div class="user-info">
        <p class="user-email">{{ user?.email ?? t('profile.defaultUser') }}</p>
        <p class="user-role">{{ t('profile.freePlan') }}</p>
      </div>
    </div>
    <div class="profile-actions">
      <AppButton variant="danger" size="md" :loading="isLoading" block @click="handleLogout">
        {{ t('profile.signOut') }}
      </AppButton>
    </div>
  </main>
</template>

<style scoped>
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
