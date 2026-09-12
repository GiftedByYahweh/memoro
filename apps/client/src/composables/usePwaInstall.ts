import { computed, ref } from 'vue';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWA_EVENTS = {
  beforeInstallPrompt: 'beforeinstallprompt',
  appInstalled: 'appinstalled',
} as const;

const MEDIA_QUERIES = {
  standalone: '(display-mode: standalone)',
} as const;

export function checkIsStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const isDisplayStandalone = window.matchMedia(MEDIA_QUERIES.standalone).matches;
  const isNavStandalone =
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  return isDisplayStandalone || isNavStandalone;
}

function checkIsIos(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

const isStandalone = ref(checkIsStandalone());
const isIos = ref(checkIsIos());
const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
const isIosGuideOpen = ref(false);

const isInstallable = computed(() => {
  return !isStandalone.value && (deferredPrompt.value !== null || isIos.value);
});

let isInitialized = false;

function initPwaListeners(): void {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  window.addEventListener(PWA_EVENTS.beforeInstallPrompt, (event) => {
    event.preventDefault();
    deferredPrompt.value = event as BeforeInstallPromptEvent;
  });

  window.addEventListener(PWA_EVENTS.appInstalled, () => {
    isStandalone.value = true;
    deferredPrompt.value = null;
    isIosGuideOpen.value = false;
  });

  const mediaQuery = window.matchMedia(MEDIA_QUERIES.standalone);
  mediaQuery.addEventListener('change', (event) => {
    isStandalone.value = event.matches;
  });
}

async function promptInstall(): Promise<boolean> {
  if (isIos.value) {
    isIosGuideOpen.value = true;
    return false;
  }

  if (!deferredPrompt.value) return false;

  await deferredPrompt.value.prompt();
  const { outcome } = await deferredPrompt.value.userChoice;
  deferredPrompt.value = null;
  return outcome === 'accepted';
}

function closeIosGuide(): void {
  isIosGuideOpen.value = false;
}

export function usePwaInstall() {
  initPwaListeners();

  return {
    isStandalone: computed(() => isStandalone.value),
    isIos: computed(() => isIos.value),
    isInstallable,
    isIosGuideOpen: computed(() => isIosGuideOpen.value),
    promptInstall,
    closeIosGuide,
    checkIsStandalone,
  };
}
