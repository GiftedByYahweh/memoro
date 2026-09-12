<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import MapControls from '@/components/features/map/MapControls.vue';
import { type GeoError, useGeolocation } from '@/composables/useGeolocation';
import { useMap } from '@/composables/useMap';
import { useToast } from '@/composables/useToast';
import {
  DEFAULT_MAP_STYLE_KEY,
  GEO_ERROR_CODE,
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

function handleStyleChange(styleKey: MapStyleKey): void {
  activeStyle.value = styleKey;
  setStyle(styleKey);
}

function resolveGeoErrorMessage(err: unknown): string {
  if (typeof err === 'object' && err !== null && 'code' in err) {
    const geoErr = err as GeoError;
    if (geoErr.code === GEO_ERROR_CODE.PERMISSION_DENIED) {
      return t('map.locationPermissionDenied');
    }
    if (geoErr.code === GEO_ERROR_CODE.POSITION_UNAVAILABLE) {
      return t('map.locationUnavailable');
    }
    if (geoErr.code === GEO_ERROR_CODE.TIMEOUT) {
      return t('map.locationTimeout');
    }
  }
  return t('map.locationError');
}

async function handleLocate(): Promise<void> {
  try {
    const coords = await getCurrentPosition();
    showUserLocation(coords.lng, coords.lat);
  } catch (err: unknown) {
    const message = resolveGeoErrorMessage(err);
    toast.showError(message, GEOLOCATION_ERROR_TOAST_DURATION_MS);
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
