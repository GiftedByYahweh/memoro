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
  <main class="auth-card">
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
  width: 100%;
  max-width: 448px;
}

.auth-link {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  text-align: center;
}

@media (width >= 600px) {
  .auth-card {
    padding: var(--space-2xl);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-2xl);
    background-color: var(--color-surface);
  }
}
</style>
