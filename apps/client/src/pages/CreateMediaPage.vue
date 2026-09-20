<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppBackButton from '@/components/shared/AppBackButton.vue';
import AppPageHeader from '@/components/shared/AppPageHeader.vue';
import MediaCreateForm from '@/components/features/media/MediaCreateForm.vue';
import { RoutePaths } from '@/router/routes';

const router = useRouter();
const { t } = useI18n();

function handleBack(): void {
  router.back();
}

function handleSuccess(): void {
  void router.push(RoutePaths.feed.path);
}
</script>

<template>
  <main class="page-container">
    <div class="top-nav-bar">
      <AppBackButton @click="handleBack" />
      <AppPageHeader :title="t('media.createTitle')" />
    </div>
    <MediaCreateForm @success="handleSuccess" @cancel="handleBack" />
  </main>
</template>

<style scoped>
.top-nav-bar {
  position: relative;
  display: flex;
  align-items: center;
  padding-left: var(--space-2xl);
  margin-bottom: var(--space-lg);
}

.top-nav-bar :deep(.page-header) {
  margin-bottom: 0;
}
</style>
