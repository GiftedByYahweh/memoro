<script setup lang="ts">
import AppIcon from '@/components/shared/AppIcon.vue';
import AppText from '@/components/shared/AppText.vue';
import { useToast } from '@/composables/useToast';

const SWIPE_THRESHOLD_Y = 35;
const SWIPE_THRESHOLD_X = 75;
const RESISTANCE_FACTOR = 0.25;
const MIN_DRAG_OPACITY = 0.2;
const OPACITY_DIVISOR_Y = 100;
const OPACITY_DIVISOR_X = 200;
const CLOSE_ICON_SIZE = 16;

const { toasts, dismissToast } = useToast();

interface DragState {
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
  target: HTMLElement;
}

const activeDrags = new Map<string, DragState>();

function handlePointerDown(event: PointerEvent, id: string): void {
  const target = event.currentTarget as HTMLElement | null;
  if (!target) {
    return;
  }
  target.setPointerCapture(event.pointerId);
  activeDrags.set(id, {
    startX: event.clientX,
    startY: event.clientY,
    deltaX: 0,
    deltaY: 0,
    target,
  });
}

function handlePointerMove(event: PointerEvent, id: string): void {
  const state = activeDrags.get(id);
  if (!state) {
    return;
  }

  const rawDeltaX = event.clientX - state.startX;
  const rawDeltaY = event.clientY - state.startY;

  state.deltaX = rawDeltaX;
  state.deltaY = rawDeltaY > 0 ? rawDeltaY * RESISTANCE_FACTOR : rawDeltaY;

  const opacityRatio =
    1 - Math.abs(state.deltaY) / OPACITY_DIVISOR_Y - Math.abs(state.deltaX) / OPACITY_DIVISOR_X;
  const clampedOpacity = Math.max(MIN_DRAG_OPACITY, opacityRatio);

  state.target.style.transition = 'none';
  state.target.style.transform = `translate3d(${String(state.deltaX)}px, ${String(state.deltaY)}px, 0)`;
  state.target.style.opacity = String(clampedOpacity);
}

function handlePointerUp(event: PointerEvent, id: string): void {
  const state = activeDrags.get(id);
  if (!state) {
    return;
  }

  if (state.target.hasPointerCapture(event.pointerId)) {
    state.target.releasePointerCapture(event.pointerId);
  }

  const shouldDismiss =
    state.deltaY < -SWIPE_THRESHOLD_Y || Math.abs(state.deltaX) > SWIPE_THRESHOLD_X;

  if (shouldDismiss) {
    activeDrags.delete(id);
    dismissToast(id);
    return;
  }

  state.target.style.transition =
    'transform var(--transition-fast), opacity var(--transition-fast)';
  state.target.style.transform = '';
  state.target.style.opacity = '';
  activeDrags.delete(id);
}

function handlePointerCancel(event: PointerEvent, id: string): void {
  handlePointerUp(event, id);
}
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
        @pointerdown="handlePointerDown($event, toast.id)"
        @pointermove="handlePointerMove($event, toast.id)"
        @pointerup="handlePointerUp($event, toast.id)"
        @pointercancel="handlePointerCancel($event, toast.id)"
      >
        <div class="toast-indicator" />
        <div class="toast-content">
          <AppText variant="body-sm" color="primary" weight="medium" class="toast-message">
            {{ toast.message }}
          </AppText>
        </div>
        <button
          type="button"
          class="toast-close"
          aria-label="Close"
          @pointerdown.stop
          @click.stop="dismissToast(toast.id)"
        >
          <AppIcon name="close" :size="CLOSE_ICON_SIZE" color="secondary" />
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
  align-items: flex-start;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  background-color: var(--color-surface-floating);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-elevated);
  backdrop-filter: blur(16px);
  touch-action: none;
  user-select: text;
  cursor: grab;
}

.toast-item:active {
  cursor: grabbing;
}

.type-error {
  border-color: var(--border-danger);
}

.toast-indicator {
  width: 3px;
  height: 18px;
  margin-top: 2px;
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

.toast-message {
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -2px;
  padding: var(--space-2xs);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: opacity var(--transition-fast);
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
