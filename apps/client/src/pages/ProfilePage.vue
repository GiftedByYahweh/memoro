<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppButton from '@/components/shared/AppButton.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import AppPageHeader from '@/components/shared/AppPageHeader.vue';
import { useAuth } from '@/composables/useAuth';
import { RoutePaths } from '@/router/routes';

const router = useRouter();
const { t } = useI18n();
const { user, logout, isLoading } = useAuth();

const email = computed(() => user.value?.email ?? '');
const initial = computed(() => email.value.charAt(0).toUpperCase());

async function handleLogout(): Promise<void> {
  await logout();
  await router.push(RoutePaths.login.path);
}
</script>

<template>
  <main class="page-container">
    <AppPageHeader :title="t('profile.title')" />

    <section class="profile-card">
      <span class="avatar" aria-hidden="true">{{ initial }}</span>
      <p class="profile-email">{{ email }}</p>
    </section>

    <AppButton variant="danger" block :loading="isLoading" class="logout-btn" @click="handleLogout">
      <template #icon-left>
        <AppIcon name="logout" :size="20" />
      </template>
      {{ t('profile.signOut') }}
    </AppButton>
  </main>
</template>

<style scoped>
.profile-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  font-size: var(--text-xl);
  font-weight: 500;
}

.profile-email {
  min-width: 0;
  margin: 0;
  overflow: hidden;
  font-size: var(--text-md);
  font-weight: 500;
  color: var(--color-text-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logout-btn {
  margin-top: var(--space-md);
}
</style>
