<script setup lang="ts">
import type { IconName } from '@/assets/icons';
import AppIcon from './AppIcon.vue';

interface Props {
  label: string;
  icon?: IconName;
  variant?: 'plain' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  icon: undefined,
  variant: 'plain',
  size: 'md',
  active: false,
  disabled: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const ICON_SIZES = { sm: 18, md: 20, lg: 22 } as const;
</script>

<template>
  <button
    type="button"
    :class="['icon-btn', `icon-btn-${variant}`, `icon-btn-${size}`, { 'is-active': active }]"
    :aria-label="label"
    :title="label"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <slot>
      <AppIcon v-if="icon" :name="icon" :size="ICON_SIZES[size]" />
    </slot>
  </button>
</template>

<style scoped>
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  background-color: transparent;
  color: var(--color-text-secondary);
  outline: none;
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.icon-btn:hover:not(:disabled) {
  background-color: var(--color-state-hover);
  color: var(--color-text-primary);
}

.icon-btn:focus-visible {
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}

.icon-btn:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

.icon-btn-sm {
  width: 32px;
  height: 32px;
}

.icon-btn-md {
  width: 40px;
  height: 40px;
}

.icon-btn-lg {
  width: 44px;
  height: 44px;
}

.icon-btn-floating {
  border-color: var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-1);
}

.icon-btn-floating:hover:not(:disabled) {
  background-color: var(--color-bg-subtle);
}

.icon-btn.is-active,
.icon-btn.is-active:hover:not(:disabled) {
  border-color: transparent;
  background-color: var(--color-primary-container);
  color: var(--color-on-primary-container);
}
</style>
