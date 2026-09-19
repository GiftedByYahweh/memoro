<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppPageHeader from '@/components/shared/AppPageHeader.vue';
import AppEmptyState from '@/components/shared/AppEmptyState.vue';

const { t } = useI18n();
</script>

<template>
  <main class="page-container">
    <AppPageHeader :title="t('feed.title')" />
    <AppEmptyState
      icon="book"
      :title="t('feed.emptyTitle')"
      :description="t('feed.emptyDescription')"
    />
  </main>
</template>
