import { nextTick, onMounted, onUnmounted, ref, shallowRef, type Ref, type ShallowRef } from 'vue';
import { Map, Marker, setWorkerUrl, type MapOptions } from 'maplibre-gl';
import {
  BEARING_NORTH_DEGREES,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_STYLE,
  DEFAULT_MAP_ZOOM,
  FLY_TO_DURATION_MS,
  MAP_STYLES,
  MAPLIBRE_WORKER_URL,
  MAX_MAP_ZOOM,
  MIN_MAP_ZOOM,
  PITCH_2D_DEGREES,
  PITCH_3D_DEGREES,
  RESIZE_DELAY_FINAL_MS,
  RESIZE_DELAY_INITIAL_MS,
  RESIZE_DELAY_SECONDARY_MS,
  USER_LOCATION_ZOOM,
  type MapStyleKey,
} from '@/constants/map.constants';

setWorkerUrl(MAPLIBRE_WORKER_URL);

const DEFAULT_MAP_CONFIG: Omit<MapOptions, 'container'> = {
  style: DEFAULT_MAP_STYLE,
  center: [DEFAULT_MAP_CENTER.lng, DEFAULT_MAP_CENTER.lat],
  zoom: DEFAULT_MAP_ZOOM,
  minZoom: MIN_MAP_ZOOM,
  maxZoom: MAX_MAP_ZOOM,
  trackResize: true,
};

function buildMap(container: HTMLElement, options?: Partial<MapOptions>): Map {
  return new Map({
    ...DEFAULT_MAP_CONFIG,
    ...options,
    container,
  });
}

function scheduleResizeSequence(onResize: () => void): void {
  requestAnimationFrame(onResize);
  setTimeout(onResize, RESIZE_DELAY_INITIAL_MS);
  setTimeout(onResize, RESIZE_DELAY_SECONDARY_MS);
  setTimeout(onResize, RESIZE_DELAY_FINAL_MS);
}

function attachWindowResize(handler: () => void): () => void {
  window.addEventListener('resize', handler);
  window.addEventListener('orientationchange', handler);
  return () => {
    window.removeEventListener('resize', handler);
    window.removeEventListener('orientationchange', handler);
  };
}

interface MapEventHandlers {
  onLoad: () => void;
  onCamera: () => void;
  onError: (event: unknown) => void;
}

interface MapLifecycleBindings {
  resizeObserver: ResizeObserver | null;
  detachResize: (() => void) | null;
}

function attachMapEvents(instance: Map, handlers: MapEventHandlers): void {
  instance.on('load', handlers.onLoad);
  instance.on('rotate', handlers.onCamera);
  instance.on('pitch', handlers.onCamera);
  instance.on('error', handlers.onError);
}

function bindMapInstance(
  container: HTMLElement,
  options: Partial<MapOptions> | undefined,
  handlers: MapEventHandlers,
): { instance: Map; bindings: MapLifecycleBindings } {
  const instance = buildMap(container, options);
  attachMapEvents(instance, handlers);
  const resizeObserver = new ResizeObserver(() => {
    instance.resize();
  });
  resizeObserver.observe(container);
  const detachResize = attachWindowResize(() => {
    instance.resize();
  });
  scheduleResizeSequence(() => {
    instance.resize();
  });
  return { instance, bindings: { resizeObserver, detachResize } };
}

function teardownMap(instance: Map, observer: ResizeObserver | null): void {
  observer?.disconnect();
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

function useCameraMetrics(map: ShallowRef<Map | null>) {
  const bearing = ref(0);
  const pitch = ref(0);
  function updateCamera(): void {
    if (!map.value) return;
    bearing.value = Math.round(map.value.getBearing());
    pitch.value = Math.round(map.value.getPitch());
  }
  return { bearing, pitch, updateCamera };
}

interface UserCoordinates {
  lng: number;
  lat: number;
}

function useUserMarker(map: ShallowRef<Map | null>) {
  let marker: Marker | null = null;
  let pendingCoords: UserCoordinates | null = null;

  function show(lng: number, lat: number): void {
    if (!map.value) {
      pendingCoords = { lng, lat };
      return;
    }
    map.value.flyTo({
      center: [lng, lat],
      zoom: USER_LOCATION_ZOOM,
      duration: FLY_TO_DURATION_MS,
    });
    marker = renderUserMarker(map.value, marker, lng, lat);
  }

  function applyPending(): void {
    if (pendingCoords && map.value) {
      const target = pendingCoords;
      pendingCoords = null;
      show(target.lng, target.lat);
    }
  }

  function destroy(): void {
    marker?.remove();
    marker = null;
    pendingCoords = null;
  }

  return { show, applyPending, destroy };
}

function extractErrorMessage(event: unknown): string {
  if (event && typeof event === 'object' && 'error' in event && event.error instanceof Error) {
    return event.error.message;
  }
  return 'Map error';
}

export function useMap(targetContainer?: Ref<HTMLElement | null>) {
  const container = targetContainer ?? ref<HTMLElement | null>(null);
  const map = shallowRef<Map | null>(null);
  const isLoaded = ref(false);
  const mapError = ref<string | null>(null);
  const { bearing, pitch, updateCamera } = useCameraMetrics(map);
  const userMarker = useUserMarker(map);
  const actions = buildCameraActions(map);
  let bindings: MapLifecycleBindings = { resizeObserver: null, detachResize: null };

  async function initMap(options?: Partial<MapOptions>) {
    await nextTick();
    if (!container.value || map.value) return;
    try {
      const bound = bindMapInstance(container.value, options, {
        onLoad: () => {
          isLoaded.value = true;
          map.value?.resize();
          userMarker.applyPending();
        },
        onCamera: updateCamera,
        onError: (e) => {
          mapError.value = extractErrorMessage(e);
        },
      });
      map.value = bound.instance;
      bindings = bound.bindings;
    } catch (error) {
      console.error('Failed to initialize map', error);
      mapError.value = error instanceof Error ? error.message : 'Map initialization failed';
    }
  }

  function destroyMap() {
    bindings.detachResize?.();
    userMarker.destroy();
    if (!map.value) return;
    teardownMap(map.value, bindings.resizeObserver);
    bindings = { resizeObserver: null, detachResize: null };
    map.value = null;
    isLoaded.value = false;
  }

  onMounted(() => {
    void initMap();
  });
  onUnmounted(destroyMap);

  return {
    container,
    map,
    isLoaded,
    mapError,
    bearing,
    pitch,
    initMap,
    destroyMap,
    showUserLocation: userMarker.show,
    ...actions,
  };
}
