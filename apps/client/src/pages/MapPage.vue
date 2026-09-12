<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import MapControls from '@/components/features/map/MapControls.vue';
import { useGeolocation } from '@/composables/useGeolocation';
import { useMap } from '@/composables/useMap';
import { useToast } from '@/composables/useToast';
import { DEFAULT_MAP_STYLE_KEY, type MapStyleKey } from '@/constants/map.constants';

const { t } = useI18n();
const toast = useToast();
const { isLocating, getCurrentPosition } = useGeolocation();
const { container, bearing, pitch, setStyle, showUserLocation, togglePitch, resetNorth } =
  useMap();
const activeStyle = ref<MapStyleKey>(DEFAULT_MAP_STYLE_KEY);

function handleStyleChange(styleKey: MapStyleKey): void {
  activeStyle.value = styleKey;
  setStyle(styleKey);
}

async function handleLocate(): Promise<void> {
  try {
    const coords = await getCurrentPosition();
    showUserLocation(coords.lng, coords.lat);
  } catch {
    toast.showError(t('map.locationError'));
  }
}
</script>

<template>
  <main class="map-page">
    <div ref="container" class="map-container" />
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
  display: flex;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  background-color: var(--color-oled-black);
}

.map-container {
  position: relative;
  flex: 1;
  width: 100%;
  height: 100%;
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
