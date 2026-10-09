<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router';

interface Props {
  linkPrompt: string;
  linkText: string;
  linkTo: RouteLocationRaw;
}

defineProps<Props>();
</script>

<template>
  <main class="auth-card surface-card">
    <slot />
    <p class="auth-link">
      {{ linkPrompt }}
      <RouterLink :to="linkTo" class="text-link">{{ linkText }}</RouterLink>
    </p>
  </main>
</template>

<style scoped>
.auth-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.auth-link {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  text-align: center;
}
</style>
