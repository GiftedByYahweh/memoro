<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { Map, Marker, type MapMouseEvent, type MapOptions } from 'maplibre-gl';
import { icons } from '@/assets/icons';
import AppButton from '@/components/shared/AppButton.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import AppIconButton from '@/components/shared/AppIconButton.vue';
import AppPageHeader from '@/components/shared/AppPageHeader.vue';
import { useGeolocation } from '@/composables/useGeolocation';
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_STYLE,
  DEFAULT_MAP_ZOOM,
  FLY_TO_DURATION_MS,
  MAX_MAP_ZOOM,
  MIN_MAP_ZOOM,
  USER_LOCATION_ZOOM,
} from '@/constants/map.constants';
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
  badge.innerHTML = icons.mapPin;
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
  <div class="location-picker" role="dialog" aria-modal="true">
    <div class="picker-header">
      <AppPageHeader :title="t('media.selectLocationTitle')" show-back @back="emit('close')" />
    </div>

    <div class="map-viewport">
      <div ref="containerRef" class="map-surface" />
      <AppIconButton
        variant="floating"
        size="lg"
        icon="target"
        class="locate-btn"
        :label="t('media.detectGps')"
        :active="isLocating"
        :disabled="isLocating"
        @click="handleFlyToCurrentLocation"
      />
    </div>

    <div class="picker-footer">
      <div class="address-row">
        <AppIcon name="mapPin" :size="20" :color="currentLat === null ? 'secondary' : 'accent'" />
        <span class="address-text">{{
          isResolving
            ? t('media.resolvingAddress')
            : resolvedAddress || t('media.clickToSelectLocation')
        }}</span>
      </div>
      <AppButton
        size="lg"
        block
        :disabled="currentLat === null || currentLng === null"
        @click="handleConfirm"
      >
        {{ t('media.confirmLocation') }}
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.location-picker {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
}

.picker-header {
  padding: calc(var(--safe-top) + var(--space-xs)) var(--space-md) 0;
  border-bottom: 1px solid var(--color-border);
}

.picker-header :deep(.page-header) {
  margin-bottom: var(--space-xs);
}

.map-viewport {
  position: relative;
  flex: 1;
  overflow: hidden;
}

.map-surface {
  position: absolute;
  inset: 0;
}

.locate-btn {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  z-index: 10;
}

.picker-footer {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-md) calc(var(--safe-bottom) + var(--space-md));
  border-top: 1px solid var(--color-border);
}

.address-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  min-height: 24px;
}

.address-text {
  min-width: 0;
  overflow: hidden;
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.map-picker-pin) {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: grab;
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
  border: 2px solid var(--color-white);
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  color: var(--color-white);
  box-shadow: var(--shadow-2);
}

:deep(.pin-badge svg) {
  width: 20px;
  height: 20px;
}

:deep(.pin-tip) {
  width: 0;
  height: 0;
  margin-top: -1px;
  border-top: 8px solid var(--color-primary);
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
}
</style>
