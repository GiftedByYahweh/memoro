<script setup lang="ts">
import AppPageHeader from '@/components/shared/AppPageHeader.vue';
import AppEmptyState from '@/components/shared/AppEmptyState.vue';
</script>

<template>
  <main class="page-container">
    <AppPageHeader title="Feed" />
    <AppEmptyState
      icon="book"
      title="No memories yet"
      description="Capture moments on the map to see your timeline here."
    />
  </main>
</template>
