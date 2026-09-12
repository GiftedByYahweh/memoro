import { onMounted, onUnmounted, ref, shallowRef, type Ref, type ShallowRef } from 'vue';
import { Map, Marker, type MapOptions } from 'maplibre-gl';
import {
  BEARING_NORTH_DEGREES,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_STYLE,
  DEFAULT_MAP_ZOOM,
  FLY_TO_DURATION_MS,
  MAP_STYLES,
  MAX_MAP_ZOOM,
  MIN_MAP_ZOOM,
  PITCH_2D_DEGREES,
  PITCH_3D_DEGREES,
  USER_LOCATION_ZOOM,
  type MapStyleKey,
} from '@/constants/map.constants';

const DEFAULT_MAP_CONFIG: Omit<MapOptions, 'container'> = {
  style: DEFAULT_MAP_STYLE,
  center: [DEFAULT_MAP_CENTER.lng, DEFAULT_MAP_CENTER.lat],
  zoom: DEFAULT_MAP_ZOOM,
  minZoom: MIN_MAP_ZOOM,
  maxZoom: MAX_MAP_ZOOM,
  trackResize: true,
};

function handleMapError(event: unknown) {
  console.error('MapLibre error', event);
}

function buildMap(container: HTMLElement, options?: Partial<MapOptions>): Map {
  return new Map({
    ...DEFAULT_MAP_CONFIG,
    ...options,
    container,
  });
}

function setupObserver(target: HTMLElement, map: ShallowRef<Map | null>): ResizeObserver {
  const observer = new ResizeObserver(() => {
    map.value?.resize();
  });
  observer.observe(target);
  return observer;
}

function teardownMap(
  instance: Map,
  observer: ResizeObserver | null,
  onLoad: () => void,
  onCamera: () => void,
) {
  observer?.disconnect();
  instance.off('load', onLoad);
  instance.off('rotate', onCamera);
  instance.off('pitch', onCamera);
  instance.off('error', handleMapError);
  instance.remove();
}

function buildLocationPuck(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'user-location-puck';

  const pulse = document.createElement('div');
  pulse.className = 'user-location-pulse';

  const dot = document.createElement('div');
  dot.className = 'user-location-dot';

  container.appendChild(pulse);
  container.appendChild(dot);
  return container;
}

function renderUserMarker(
  mapInstance: Map,
  existingMarker: Marker | null,
  lng: number,
  lat: number,
): Marker {
  if (existingMarker) {
    existingMarker.setLngLat([lng, lat]);
    return existingMarker;
  }
  const element = buildLocationPuck();
  const marker = new Marker({ element });
  marker.setLngLat([lng, lat]);
  marker.addTo(mapInstance);
  return marker;
}

function buildCameraActions(map: ShallowRef<Map | null>) {
  return {
    flyTo: (lng: number, lat: number, zoom?: number) => {
      if (!map.value) return;
      map.value.flyTo({
        center: [lng, lat],
        zoom: zoom ?? map.value.getZoom(),
        duration: FLY_TO_DURATION_MS,
      });
    },
    recenter: (lng = DEFAULT_MAP_CENTER.lng, lat = DEFAULT_MAP_CENTER.lat) => {
      if (!map.value) return;
      map.value.flyTo({
        center: [lng, lat],
        zoom: DEFAULT_MAP_ZOOM,
        duration: FLY_TO_DURATION_MS,
      });
    },
    togglePitch: () => {
      if (!map.value) return;
      const current = map.value.getPitch();
      const target = current > PITCH_2D_DEGREES ? PITCH_2D_DEGREES : PITCH_3D_DEGREES;
      map.value.easeTo({ pitch: target, duration: FLY_TO_DURATION_MS });
    },
    resetNorth: () => {
      map.value?.easeTo({ bearing: BEARING_NORTH_DEGREES, duration: FLY_TO_DURATION_MS });
    },
    setStyle: (styleKey: MapStyleKey) => {
      map.value?.setStyle(MAP_STYLES[styleKey]);
    },
  };
}

function useCameraMetrics() {
  const bearing = ref(0);
  const pitch = ref(0);
  return { bearing, pitch };
}

function useUserMarker(map: ShallowRef<Map | null>) {
  let marker: Marker | null = null;

  function show(lng: number, lat: number) {
    if (!map.value) return;
    map.value.flyTo({
      center: [lng, lat],
      zoom: USER_LOCATION_ZOOM,
      duration: FLY_TO_DURATION_MS,
    });
    marker = renderUserMarker(map.value, marker, lng, lat);
  }

  function destroy() {
    marker?.remove();
    marker = null;
  }

  return { show, destroy };
}

export function useMap(targetContainer?: Ref<HTMLElement | null>) {
  const container = targetContainer ?? ref<HTMLElement | null>(null);
  const map = shallowRef<Map | null>(null);
  const isLoaded = ref(false);
  const { bearing, pitch } = useCameraMetrics();
  const userMarker = useUserMarker(map);
  const actions = buildCameraActions(map);
  let resizeObserver: ResizeObserver | null = null;

  function handleCameraChange() {
    if (!map.value) return;
    bearing.value = Math.round(map.value.getBearing());
    pitch.value = Math.round(map.value.getPitch());
  }

  function handleMapLoad() {
    isLoaded.value = true;
    map.value?.resize();
  }

  function triggerResize(): void {
    map.value?.resize();
  }

  function initMap(options?: Partial<MapOptions>) {
    if (!container.value || map.value) return;
    const instance = buildMap(container.value, options);
    instance.on('load', handleMapLoad);
    instance.on('rotate', handleCameraChange);
    instance.on('pitch', handleCameraChange);
    instance.on('error', handleMapError);
    map.value = instance;
    resizeObserver = setupObserver(container.value, map);

    requestAnimationFrame(triggerResize);
    setTimeout(triggerResize, 150);
    setTimeout(triggerResize, 350);
    setTimeout(triggerResize, 700);

    window.addEventListener('resize', triggerResize);
    window.addEventListener('orientationchange', triggerResize);
  }

  function destroyMap() {
    window.removeEventListener('resize', triggerResize);
    window.removeEventListener('orientationchange', triggerResize);
    userMarker.destroy();
    if (!map.value) return;
    teardownMap(map.value, resizeObserver, handleMapLoad, handleCameraChange);
    resizeObserver = null;
    map.value = null;
    isLoaded.value = false;
  }

  onMounted(initMap);
  onUnmounted(destroyMap);

  return {
    container,
    map,
    isLoaded,
    bearing,
    pitch,
    initMap,
    destroyMap,
    showUserLocation: userMarker.show,
    ...actions,
  };
}
