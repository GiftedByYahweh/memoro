<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { Map, Marker, type MapMouseEvent, type MapOptions } from 'maplibre-gl';
import { icons } from '@/assets/icons';
import AppButton from '@/components/shared/AppButton.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import { useGeolocation } from '@/composables/useGeolocation';
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_STYLE,
  DEFAULT_MAP_ZOOM,
  FLY_TO_DURATION_MS,
  MAP_CONTROL_ICON_SIZE,
  MAX_MAP_ZOOM,
  MIN_MAP_ZOOM,
  USER_LOCATION_ZOOM,
} from '@/constants/map.constants';
import { MEDIA_UI_CONSTANTS } from '@/constants/media.constants';
import { geocodingService } from '@/services/geocoding.service';

const props = defineProps<{
  initialLat?: number | null;
  initialLng?: number | null;
}>();

const emit = defineEmits<{
  select: [coords: { lat: number; lng: number }];
  close: [];
}>();

const { t } = useI18n();
const { isLocating, getCurrentPosition } = useGeolocation();

const containerRef = ref<HTMLDivElement | null>(null);
const mapInstance = shallowRef<Map | null>(null);
const markerInstance = shallowRef<Marker | null>(null);

const initialCenterLat = props.initialLat ?? DEFAULT_MAP_CENTER.lat;
const initialCenterLng = props.initialLng ?? DEFAULT_MAP_CENTER.lng;
const initialZoom =
  props.initialLat !== null && props.initialLat !== undefined
    ? USER_LOCATION_ZOOM
    : DEFAULT_MAP_ZOOM;

const currentLat = ref<number | null>(props.initialLat ?? null);
const currentLng = ref<number | null>(props.initialLng ?? null);
const resolvedAddress = ref('');
const isResolving = ref(false);

async function updateAddress(lat: number, lng: number): Promise<void> {
  isResolving.value = true;
  try {
    const address = await geocodingService.reverseGeocode(lat, lng);
    resolvedAddress.value = address;
  } finally {
    isResolving.value = false;
  }
}

function createMarkerPin(): HTMLElement {
  const pin = document.createElement('div');
  pin.className = 'map-picker-pin';
  const badge = document.createElement('div');
  badge.className = 'pin-badge';
  badge.innerHTML = icons.target;
  const tip = document.createElement('div');
  tip.className = 'pin-tip';
  pin.appendChild(badge);
  pin.appendChild(tip);
  return pin;
}

function initMarker(map: Map, lat: number, lng: number): Marker {
  const marker = new Marker({
    element: createMarkerPin(),
    anchor: 'bottom',
    draggable: true,
  });
  marker.on('dragend', () => {
    const pos = marker.getLngLat();
    setPoint(pos.lat, pos.lng);
  });
  marker.setLngLat([lng, lat]).addTo(map);
  return marker;
}

function setPoint(lat: number, lng: number): void {
  currentLat.value = lat;
  currentLng.value = lng;
  const map = mapInstance.value;
  if (!map) return;

  if (!markerInstance.value) {
    markerInstance.value = initMarker(map, lat, lng);
  } else {
    markerInstance.value.setLngLat([lng, lat]);
  }
  void updateAddress(lat, lng);
}

function handleMapClick(event: MapMouseEvent): void {
  setPoint(event.lngLat.lat, event.lngLat.lng);
}

async function handleFlyToCurrentLocation(): Promise<void> {
  try {
    const coords = await getCurrentPosition();
    setPoint(coords.lat, coords.lng);
    mapInstance.value?.flyTo({
      center: [coords.lng, coords.lat],
      zoom: USER_LOCATION_ZOOM,
      duration: FLY_TO_DURATION_MS,
    });
  } catch {
    return;
  }
}

function handleConfirm(): void {
  if (currentLat.value === null || currentLng.value === null) return;
  emit('select', { lat: currentLat.value, lng: currentLng.value });
}

onMounted(() => {
  if (!containerRef.value) return;

  const options: MapOptions = {
    container: containerRef.value,
    style: DEFAULT_MAP_STYLE,
    center: [initialCenterLng, initialCenterLat],
    zoom: initialZoom,
    minZoom: MIN_MAP_ZOOM,
    maxZoom: MAX_MAP_ZOOM,
    trackResize: true,
  };

  const map = new Map(options);
  mapInstance.value = map;
  map.on('click', handleMapClick);
  map.getCanvas().style.cursor = 'crosshair';

  if (
    props.initialLat !== null &&
    props.initialLat !== undefined &&
    props.initialLng !== null &&
    props.initialLng !== undefined
  ) {
    setPoint(props.initialLat, props.initialLng);
  }
});

onUnmounted(() => {
  markerInstance.value?.remove();
  markerInstance.value = null;
  mapInstance.value?.remove();
  mapInstance.value = null;
});
</script>

<template>
  <div class="location-picker-modal" role="dialog" aria-modal="true">
    <div class="modal-header">
      <button
        type="button"
        class="header-back-btn"
        :aria-label="t('common.cancel')"
        @click="emit('close')"
      >
        <AppIcon name="arrowLeft" :size="MAP_CONTROL_ICON_SIZE.NAVIGATION" color="inherit" />
      </button>
      <h2 class="header-title">{{ t('media.selectLocationTitle') }}</h2>
      <div class="header-spacer" />
    </div>

    <div class="map-viewport">
      <div ref="containerRef" class="map-surface" />
      <button
        type="button"
        class="locate-fab"
        :disabled="isLocating"
        :aria-label="t('media.detectGps')"
        @click="handleFlyToCurrentLocation"
      >
        <AppIcon name="navigation" :size="MAP_CONTROL_ICON_SIZE.NAVIGATION" color="inherit" />
      </button>
    </div>

    <div class="modal-footer">
      <div class="address-preview">
        <AppIcon name="navigation" :size="MEDIA_UI_CONSTANTS.PREVIEW_ICON_SIZE" color="primary" />
        <span class="address-text">{{
          isResolving
            ? t('media.resolvingAddress')
            : resolvedAddress || t('media.clickToSelectLocation')
        }}</span>
      </div>
      <div class="footer-actions">
        <AppButton variant="ghost" size="md" @click="emit('close')">
          {{ t('common.cancel') }}
        </AppButton>
        <AppButton
          variant="primary"
          size="md"
          :disabled="currentLat === null || currentLng === null"
          @click="handleConfirm"
        >
          {{ t('media.confirmLocation') }}
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.location-picker-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background-color: var(--color-oled-black);
}

.modal-header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-md);
  background-color: var(--color-surface-card);
  border-bottom: 1px solid var(--border-subtle);
}

.header-back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
}

.header-title {
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.header-spacer {
  width: 36px;
}

.map-viewport {
  position: relative;
  flex: 1;
  width: 100%;
  overflow: hidden;
}

.map-surface {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

:deep(.map-picker-pin) {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: grab;
  filter: drop-shadow(0 4px 10px rgb(0 0 0 / 60%));
}

:deep(.map-picker-pin:active) {
  cursor: grabbing;
}

:deep(.pin-badge) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  color: var(--color-white);
  border: 2px solid var(--color-surface-card);
  transition: transform var(--transition-fast);
}

:deep(.pin-badge svg) {
  width: 20px;
  height: 20px;
}

:deep(.map-picker-pin:hover .pin-badge) {
  transform: scale(1.1);
}

:deep(.pin-tip) {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid var(--color-primary);
  margin-top: -1px;
}

.locate-fab {
  position: absolute;
  right: var(--space-md);
  bottom: var(--space-md);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  background-color: var(--color-surface-card);
  color: var(--color-text-primary);
  cursor: pointer;
  box-shadow: 0 4px 12px rgb(0 0 0 / 40%);
}

.modal-footer {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md);
  background-color: var(--color-surface-card);
  border-top: 1px solid var(--border-subtle);
}

.address-preview {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  min-height: 24px;
}

.address-text {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.footer-actions {
  display: flex;
  gap: var(--space-sm);
  justify-content: flex-end;
}
</style>
