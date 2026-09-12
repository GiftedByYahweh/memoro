<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
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
    <span v-if="loading" class="spinner" aria-hidden="true" />
    <span v-if="$slots['icon-left'] && !loading" class="btn-icon">
      <slot name="icon-left" />
    </span>
    <span class="btn-label">
      <slot />
    </span>
    <span v-if="$slots['icon-right'] && !loading" class="btn-icon">
      <slot name="icon-right" />
    </span>
  </button>
</template>

<style scoped>
.app-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-sans);
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  user-select: none;
  transition:
    transform 0.15s ease,
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    opacity 0.15s ease;
  position: relative;
  outline: none;
}

.app-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

.app-btn:active:not(:disabled) {
  transform: scale(0.96);
}

.is-block {
  display: flex;
  width: 100%;
}

.is-pill {
  border-radius: var(--radius-full);
}

.btn-sm {
  height: 34px;
  padding: 0 var(--space-md);
  font-size: 0.8125rem;
  border-radius: var(--radius-md);
}

.btn-md {
  height: 44px;
  padding: 0 var(--space-lg);
  font-size: 0.9375rem;
  border-radius: var(--radius-lg);
}

.btn-lg {
  height: 52px;
  padding: 0 var(--space-xl);
  font-size: 1rem;
  border-radius: var(--radius-xl);
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-icon.btn-sm {
  width: 34px;
  padding: 0;
}

.btn-icon.btn-md {
  width: 44px;
  padding: 0;
}

.btn-icon.btn-lg {
  width: 52px;
  padding: 0;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: 1px solid transparent;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.btn-secondary {
  background-color: var(--color-surface-elevated);
  color: var(--color-text-primary);
  border: 1px solid var(--border-subtle);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-surface-floating);
  border-color: var(--border-subtle-hover);
}

.btn-ghost {
  background-color: transparent;
  color: var(--color-text-secondary);
  border: 1px solid transparent;
}

.btn-ghost:hover:not(:disabled) {
  background-color: var(--color-surface-elevated);
  color: var(--color-text-primary);
}

.btn-danger {
  background-color: var(--color-danger-subtle);
  color: var(--color-error);
  border: 1px solid var(--border-danger);
}

.btn-danger:hover:not(:disabled) {
  background-color: var(--color-danger-subtle-hover);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--spinner-track);
  border-top-color: var(--color-white);
  border-radius: var(--radius-full);
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
