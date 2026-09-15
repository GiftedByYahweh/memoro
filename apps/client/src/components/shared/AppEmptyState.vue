<script setup lang="ts">
import type { IconName } from '@/assets/icons';
import AppIcon from './AppIcon.vue';

interface Props {
  icon: IconName;
  title: string;
  description: string;
}

defineProps<Props>();
</script>

<template>
  <div class="empty-state">
    <div class="empty-icon-wrap">
      <AppIcon :name="icon" :size="32" color="tertiary" />
    </div>
    <p class="empty-title">{{ title }}</p>
    <p class="empty-description">{{ description }}</p>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  gap: var(--space-xs);
}

.empty-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background-color: var(--color-surface-card);
  border: 1px solid var(--border-subtle);
  margin-bottom: var(--space-xs);
}

.empty-title {
  font-family: var(--font-sans);
  font-size: var(--space-md);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.empty-description {
  font-family: var(--font-sans);
  font-size: var(--space-sm);
  color: var(--color-text-tertiary);
  margin: 0;
  max-width: 280px;
}
</style>
