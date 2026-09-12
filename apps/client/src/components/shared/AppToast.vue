<script setup lang="ts">
import AppIcon from '@/components/shared/AppIcon.vue';
import AppText from '@/components/shared/AppText.vue';
import { useToast } from '@/composables/useToast';

const { toasts, dismissToast } = useToast();
</script>

<template>
  <div class="toast-container" aria-live="polite" aria-atomic="true">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item"
        :class="`type-${toast.type}`"
        role="alert"
      >
        <div class="toast-indicator" />
        <div class="toast-content">
          <AppText variant="body-sm" color="primary" weight="medium">
            {{ toast.message }}
          </AppText>
        </div>
        <button
          type="button"
          class="toast-close"
          aria-label="Close"
          @click="dismissToast(toast.id)"
        >
          <AppIcon name="close" :size="16" color="secondary" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: max(var(--space-md), var(--safe-top));
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  width: calc(100% - var(--space-xl));
  max-width: 440px;
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  background-color: var(--color-surface-floating);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-elevated);
  backdrop-filter: blur(16px);
}

.type-error {
  border-color: rgb(255 69 58 / 30%);
}

.toast-indicator {
  width: 3px;
  height: 18px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  flex-shrink: 0;
}

.type-error .toast-indicator {
  background-color: var(--color-error);
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xs);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.toast-close:hover {
  opacity: 0.8;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-16px) scale(0.96);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
