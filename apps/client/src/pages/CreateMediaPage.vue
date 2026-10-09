<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
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
    <AppPageHeader :title="t('media.createTitle')" show-back @back="handleBack" />
    <MediaCreateForm @success="handleSuccess" />
  </main>
</template>
