<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppPageHeader from '@/components/shared/AppPageHeader.vue';
import AppEmptyState from '@/components/shared/AppEmptyState.vue';

const { t } = useI18n();
</script>

<template>
  <main class="page-container">
    <AppPageHeader :title="t('albums.title')" />
    <AppEmptyState
      icon="photos"
      :title="t('albums.emptyTitle')"
      :description="t('albums.emptyDescription')"
    />
  </main>
</template>
