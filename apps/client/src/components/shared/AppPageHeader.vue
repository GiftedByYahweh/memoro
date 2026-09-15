<script setup lang="ts">
interface Props {
  title: string;
}

defineProps<Props>();
</script>

<template>
  <header class="page-header">
    <h1 class="page-title">{{ title }}</h1>
  </header>
</template>

<style scoped>
.page-header {
  margin-bottom: var(--space-2xl);
}

.page-title {
  font-family: var(--font-sans);
  font-size: var(--space-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}
</style>
