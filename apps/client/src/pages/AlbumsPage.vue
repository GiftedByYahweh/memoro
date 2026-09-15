<script setup lang="ts">
import AppPageHeader from '@/components/shared/AppPageHeader.vue';
import AppEmptyState from '@/components/shared/AppEmptyState.vue';
</script>

<template>
  <main class="page-container">
    <AppPageHeader title="Albums" />
    <AppEmptyState
      icon="photos"
      title="No collections created"
      description="Organize your trips and moments into dedicated photo albums."
    />
  </main>
</template>
