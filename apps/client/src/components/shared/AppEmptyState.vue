<script setup lang="ts">
import type { IconName } from '@/assets/icons';
import AppIcon from './AppIcon.vue';

interface Props {
  icon: IconName;
  title: string;
  description?: string;
}

withDefaults(defineProps<Props>(), {
  description: undefined,
});
</script>

<template>
  <div class="empty-state">
    <span class="empty-icon">
      <AppIcon :name="icon" :size="32" />
    </span>
    <h2 class="empty-title">{{ title }}</h2>
    <p v-if="description" class="empty-description">{{ description }}</p>
    <div v-if="$slots.default" class="empty-actions">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  text-align: center;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  margin-bottom: var(--space-xs);
  border-radius: var(--radius-full);
  background-color: var(--color-primary-container);
  color: var(--color-on-primary-container);
}

.empty-title {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: 500;
  color: var(--color-text-primary);
}

.empty-description {
  max-width: 280px;
  margin: 0;
  font-size: var(--text-sm);
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.empty-actions {
  margin-top: var(--space-md);
}
</style>
