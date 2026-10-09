<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppButton from '@/components/shared/AppButton.vue';
import AppEmptyState from '@/components/shared/AppEmptyState.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import AppPageHeader from '@/components/shared/AppPageHeader.vue';
import { RoutePaths } from '@/router/routes';

const router = useRouter();
const { t } = useI18n();
</script>

<template>
  <main class="page-container">
    <AppPageHeader :title="t('feed.title')" />
    <AppEmptyState
      icon="book"
      :title="t('feed.emptyTitle')"
      :description="t('feed.emptyDescription')"
    >
      <AppButton @click="router.push(RoutePaths.createMedia.path)">
        <template #icon-left>
          <AppIcon name="plus" :size="20" />
        </template>
        {{ t('nav.addMemory') }}
      </AppButton>
    </AppEmptyState>
  </main>
</template>
