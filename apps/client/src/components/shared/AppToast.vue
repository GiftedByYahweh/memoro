<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppIcon from '@/components/shared/AppIcon.vue';
import AppIconButton from '@/components/shared/AppIconButton.vue';
import type { IconName } from '@/assets/icons';
import { TOAST_TYPE, useToast, type ToastType } from '@/composables/useToast';

const SWIPE_THRESHOLD_Y = 35;
const SWIPE_THRESHOLD_X = 75;
const RESISTANCE_FACTOR = 0.25;
const MIN_DRAG_OPACITY = 0.2;
const OPACITY_DIVISOR_Y = 100;
const OPACITY_DIVISOR_X = 200;

const TOAST_ICONS = {
  [TOAST_TYPE.ERROR]: 'alertCircle',
  [TOAST_TYPE.SUCCESS]: 'checkCircle',
  [TOAST_TYPE.INFO]: 'info',
} as const satisfies Record<ToastType, IconName>;

const { t } = useI18n();
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
        <span class="toast-icon" aria-hidden="true">
          <AppIcon :name="TOAST_ICONS[toast.type]" :size="20" />
        </span>
        <div class="toast-content">
          <p class="toast-message">{{ toast.message }}</p>
        </div>
        <AppIconButton
          size="sm"
          icon="close"
          :label="t('common.close')"
          @pointerdown.stop
          @click.stop="dismissToast(toast.id)"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: calc(var(--safe-top) + var(--space-md));
  left: 50%;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  width: calc(100% - var(--space-2xl));
  max-width: 440px;
  transform: translateX(-50%);
  pointer-events: none;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-sm) var(--space-xs) var(--space-sm) var(--space-md);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-2);
  touch-action: none;
  user-select: text;
  cursor: grab;
  pointer-events: auto;
}

.toast-item:active {
  cursor: grabbing;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-container);
  color: var(--color-primary);
}

.type-success .toast-icon {
  background-color: var(--color-success-container);
  color: var(--color-success);
}

.type-error .toast-icon {
  background-color: var(--color-error-container);
  color: var(--color-error);
}

.type-error {
  border-color: var(--color-error-container-hover);
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-message {
  margin: 0;
  font-size: var(--text-sm);
  line-height: 1.45;
  white-space: pre-wrap;
  overflow-wrap: break-word;
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
