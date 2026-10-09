<script setup lang="ts">
import { RouterLink } from 'vue-router';
import AppIcon from '@/components/shared/AppIcon.vue';
import type { IconName } from '@/assets/icons';

interface Props {
  to: string;
  icon: IconName;
  label: string;
}

defineProps<Props>();
</script>

<template>
  <RouterLink :to="to" class="nav-item" active-class="is-active">
    <AppIcon :name="icon" :size="22" />
    <span class="nav-label">{{ label }}</span>
  </RouterLink>
</template>

<style scoped>
.nav-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2xs);
  min-width: 0;
  height: 56px;
  margin: 0 var(--space-2xs);
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  text-decoration: none;
  outline: none;
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast);
}

.nav-item:hover {
  background-color: var(--color-state-hover);
}

.nav-item:focus-visible {
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}

.nav-item.is-active {
  background-color: var(--color-primary-container);
  color: var(--color-on-primary-container);
}

.nav-label {
  font-size: var(--text-xs);
  font-weight: 500;
  line-height: 1;
}
</style>
