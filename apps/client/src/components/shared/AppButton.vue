<script setup lang="ts">
import AppSpinner from './AppSpinner.vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  pill?: boolean;
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  pill: true,
  block: false,
  disabled: false,
  loading: false,
  type: 'button',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

function handleClick(event: MouseEvent): void {
  if (props.disabled || props.loading) {
    event.preventDefault();
    return;
  }
  emit('click', event);
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'app-btn',
      `btn-${variant}`,
      `btn-${size}`,
      { 'is-pill': pill, 'is-block': block, 'is-loading': loading },
    ]"
    @click="handleClick"
  >
    <AppSpinner v-if="loading" :size="16" />
    <span v-if="$slots['icon-left'] && !loading" class="btn-adornment">
      <slot name="icon-left" />
    </span>
    <span class="btn-label">
      <slot />
    </span>
    <span v-if="$slots['icon-right'] && !loading" class="btn-adornment">
      <slot name="icon-right" />
    </span>
  </button>
</template>

<style scoped>
.app-btn {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-sans);
  font-weight: 500;
  letter-spacing: 0.01em;
  text-align: center;
  white-space: nowrap;
  user-select: none;
  border: 1px solid transparent;
  outline: none;
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    color var(--transition-fast);
}

.app-btn:focus-visible {
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}

.app-btn:disabled {
  opacity: 0.38;
  cursor: not-allowed;
  box-shadow: none;
}

.is-block {
  display: flex;
  width: 100%;
}

.btn-sm {
  height: 32px;
  padding: 0 var(--space-sm);
  font-size: var(--text-sm);
  border-radius: var(--radius-md);
}

.btn-md {
  height: 40px;
  padding: 0 var(--space-xl);
  font-size: var(--text-sm);
  border-radius: var(--radius-md);
}

.btn-lg {
  height: 48px;
  padding: 0 var(--space-xl);
  font-size: var(--text-md);
  border-radius: var(--radius-lg);
}

.is-pill {
  border-radius: var(--radius-full);
}

.btn-adornment {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  box-shadow: var(--shadow-1);
}

.btn-primary:active:not(:disabled) {
  background-color: var(--color-primary-pressed);
}

.btn-secondary {
  background-color: var(--color-surface);
  color: var(--color-primary);
  border-color: var(--color-border);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-primary-container);
}

.btn-ghost {
  background-color: transparent;
  color: var(--color-primary);
}

.btn-ghost:hover:not(:disabled) {
  background-color: var(--color-primary-container);
}

.btn-danger {
  background-color: var(--color-error-container);
  color: var(--color-error);
}

.btn-danger:hover:not(:disabled) {
  background-color: var(--color-error-container-hover);
}
</style>
