<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import MapControls from '@/components/features/map/MapControls.vue';
import { useGeolocation } from '@/composables/useGeolocation';
import { useMap } from '@/composables/useMap';
import { useToast } from '@/composables/useToast';
import {
  DEFAULT_MAP_STYLE_KEY,
  GEOLOCATION_ERROR_TOAST_DURATION_MS,
  type MapStyleKey,
} from '@/constants/map.constants';

const { t } = useI18n();
const toast = useToast();
const { isLocating, getCurrentPosition } = useGeolocation();
const {
  container,
  isLoaded,
  mapError,
  bearing,
  pitch,
  setStyle,
  showUserLocation,
  togglePitch,
  resetNorth,
} = useMap();
const activeStyle = ref<MapStyleKey>(DEFAULT_MAP_STYLE_KEY);
const geoErrorText = ref<string | null>(null);

function handleStyleChange(styleKey: MapStyleKey): void {
  activeStyle.value = styleKey;
  setStyle(styleKey);
}

function dismissGeoError(): void {
  geoErrorText.value = null;
}

async function handleLocate(): Promise<void> {
  try {
    geoErrorText.value = null;
    const coords = await getCurrentPosition();
    showUserLocation(coords.lng, coords.lat);
  } catch (err: unknown) {
    const errorTrace = err instanceof Error ? (err.stack ?? err.message) : String(err);
    const fullMessage = `${t('map.locationError')}\n\n${errorTrace}`;
    geoErrorText.value = fullMessage;
    toast.showError(fullMessage, GEOLOCATION_ERROR_TOAST_DURATION_MS);
  }
}
</script>

<template>
  <main class="map-page">
    <div ref="container" class="map-container" />
    <Transition name="fade">
      <div v-if="!isLoaded && !mapError" class="map-loading-overlay">
        <div class="map-spinner" />
      </div>
    </Transition>
    <div v-if="mapError" class="map-error-overlay">
      <p class="map-error-text">{{ mapError }}</p>
    </div>
    <div v-if="geoErrorText" class="geo-error-overlay">
      <div class="geo-error-header">
        <span class="geo-error-title">Geolocation Error</span>
        <button type="button" class="geo-error-close" aria-label="Close" @click="dismissGeoError">
          ✕
        </button>
      </div>
      <pre class="geo-error-content">{{ geoErrorText }}</pre>
    </div>
    <MapControls
      :active-style="activeStyle"
      :bearing="bearing"
      :pitch="pitch"
      :is-locating="isLocating"
      @update:active-style="handleStyleChange"
      @locate="handleLocate"
      @toggle-pitch="togglePitch"
      @reset-north="resetNorth"
    />
  </main>
</template>

<style scoped>
.map-page {
  position: relative;
  width: 100%;
  height: 100dvh;
  min-height: 100dvh;
  overflow: hidden;
  background-color: var(--color-oled-black);
}

.map-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.map-loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  background-color: var(--color-oled-black);
  pointer-events: none;
}

.map-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border-subtle);
  border-top-color: var(--color-primary);
  border-radius: var(--radius-full);
  animation: map-spin 0.8s linear infinite;
}

.map-error-overlay {
  position: absolute;
  top: var(--space-xl);
  left: var(--space-md);
  right: var(--space-md);
  z-index: 20;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-md);
  background-color: var(--scrim-overlay);
  backdrop-filter: blur(12px);
}

.map-error-text {
  color: var(--color-error);
  font-family: var(--font-sans);
  font-size: 13px;
  text-align: center;
}

.geo-error-overlay {
  position: absolute;
  top: max(var(--space-md), var(--safe-top));
  left: var(--space-md);
  right: var(--space-md);
  max-height: 50vh;
  z-index: 30;
  display: flex;
  flex-direction: column;
  padding: var(--space-sm) var(--space-md);
  background-color: var(--color-surface-floating);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-elevated);
  backdrop-filter: blur(16px);
}

.geo-error-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-2xs);
  border-bottom: 1px solid var(--border-subtle);
}

.geo-error-title {
  color: var(--color-error);
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.geo-error-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.geo-error-close:hover {
  color: var(--color-text-primary);
}

.geo-error-content {
  margin: var(--space-xs) 0 0;
  padding: 0;
  overflow-y: auto;
  color: var(--color-text-primary);
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  line-height: 1.45;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  user-select: text;
}

.fade-leave-active {
  transition: opacity var(--transition-normal);
}

.fade-leave-to {
  opacity: 0;
}

@keyframes map-spin {
  to {
    transform: rotate(360deg);
  }
}

:deep(.user-location-puck) {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  pointer-events: none;
}

:deep(.user-location-pulse) {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  opacity: 0.4;
  animation: location-pulse 2s ease-out infinite;
}

:deep(.user-location-dot) {
  position: relative;
  width: 12px;
  height: 12px;
  border: 2px solid var(--color-white);
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  box-shadow: 0 0 10px var(--color-primary);
}

@keyframes location-pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }

  70% {
    transform: scale(2.8);
    opacity: 0;
  }

  100% {
    transform: scale(2.8);
    opacity: 0;
  }
}
</style>
