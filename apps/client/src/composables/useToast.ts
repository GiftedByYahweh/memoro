import { ref } from 'vue';

export const TOAST_DURATION_MS = 4000;

export const TOAST_TYPE = {
  ERROR: 'error',
  SUCCESS: 'success',
  INFO: 'info',
} as const;

export type ToastType = (typeof TOAST_TYPE)[keyof typeof TOAST_TYPE];

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

const toasts = ref<ToastItem[]>([]);
const timers = new Map<string, number>();

export function useToast() {
  function dismissToast(id: string): void {
    const timer = timers.get(id);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timers.delete(id);
    }
    toasts.value = toasts.value.filter((item) => item.id !== id);
  }

  function showToast(
    message: string,
    type: ToastType = TOAST_TYPE.INFO,
    duration: number = TOAST_DURATION_MS,
  ): string {
    const id = `${String(Date.now())}-${String(Math.random())}`;
    const item: ToastItem = { id, message, type };
    toasts.value = [...toasts.value, item];

    const timer = window.setTimeout(() => {
      dismissToast(id);
    }, duration);
    timers.set(id, timer);

    return id;
  }

  function showError(message: string, duration?: number): string {
    return showToast(message, TOAST_TYPE.ERROR, duration);
  }

  function showSuccess(message: string, duration?: number): string {
    return showToast(message, TOAST_TYPE.SUCCESS, duration);
  }

  return {
    toasts,
    showToast,
    showError,
    showSuccess,
    dismissToast,
  };
}
