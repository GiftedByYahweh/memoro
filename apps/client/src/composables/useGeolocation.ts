import { ref } from 'vue';
import {
  DEFAULT_GEO_ERROR_NAME,
  GEOLOCATION_HIGH_ACCURACY_TIMEOUT_MS,
  GEOLOCATION_LOW_ACCURACY_TIMEOUT_MS,
  GEOLOCATION_MAX_AGE_MS,
  GEOLOCATION_TIMEOUT_MS,
  GEO_ERROR_CODE,
  GEO_ERROR_ENTRIES,
} from '@/constants/map.constants';

export interface GeoCoordinates {
  lng: number;
  lat: number;
}

export interface GeoError extends Error {
  code: number;
}

function getGeoCodeName(code: number): string {
  const match = GEO_ERROR_ENTRIES.find(([errorCode]) => errorCode === code);
  return match ? match[1] : DEFAULT_GEO_ERROR_NAME;
}

function toGeoError(code: number, message?: string): GeoError {
  const codeName = getGeoCodeName(code);
  const detail = message && message.length > 0 ? message : codeName;
  const err = new Error(detail) as GeoError;
  err.code = code;
  return err;
}

function normalizeError(err: unknown): Error {
  return err instanceof Error ? err : new Error(String(err));
}

function checkGeolocationSupport(): Error | null {
  if (typeof window !== 'undefined' && !window.isSecureContext) {
    return new Error(
      'Geolocation requires a secure context (HTTPS). Current origin is not secure.',
    );
  }
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    return new Error('Geolocation is not supported by your browser or environment.');
  }
  return null;
}

function queryPosition(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    let watchId: number | null = null;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const cleanup = () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
      if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
      }
    };

    try {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          cleanup();
          resolve(position);
        },
        (error) => {
          cleanup();
          reject(toGeoError(error.code, error.message));
        },
        options,
      );
    } catch (err: unknown) {
      cleanup();
      reject(normalizeError(err));
    }

    const timeoutMs = options.timeout ?? GEOLOCATION_TIMEOUT_MS;
    if (timeoutMs > 0 && timeoutMs !== Infinity) {
      timerId = setTimeout(() => {
        cleanup();
        reject(toGeoError(GEO_ERROR_CODE.TIMEOUT));
      }, timeoutMs);
    }
  });
}

function isPermissionDenied(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    err.code === GEO_ERROR_CODE.PERMISSION_DENIED
  );
}

async function requestPosition(): Promise<GeolocationPosition> {
  try {
    return await queryPosition({
      enableHighAccuracy: true,
      timeout: GEOLOCATION_HIGH_ACCURACY_TIMEOUT_MS,
      maximumAge: GEOLOCATION_MAX_AGE_MS,
    });
  } catch (err: unknown) {
    if (isPermissionDenied(err)) throw err;
    return await queryPosition({
      enableHighAccuracy: false,
      timeout: GEOLOCATION_LOW_ACCURACY_TIMEOUT_MS,
      maximumAge: GEOLOCATION_MAX_AGE_MS,
    });
  }
}

async function queryPermissionStatus(): Promise<PermissionStatus | null> {
  if (!('permissions' in navigator)) {
    return null;
  }
  try {
    return await navigator.permissions.query({ name: 'geolocation' });
  } catch {
    return null;
  }
}

function assertGeolocationAllowed(state: PermissionState | null): void {
  if (state === 'denied') throw toGeoError(GEO_ERROR_CODE.PERMISSION_DENIED);
}

function resolveGeoError(err: unknown): GeoError {
  if (typeof err === 'object' && err !== null && 'code' in err) {
    return err as GeoError;
  }
  return toGeoError(GEO_ERROR_CODE.POSITION_UNAVAILABLE);
}

async function fetchCoordinates(): Promise<GeoCoordinates> {
  const position = await requestPosition();
  return {
    lng: position.coords.longitude,
    lat: position.coords.latitude,
  };
}

export function useGeolocation() {
  const coordinates = ref<GeoCoordinates | null>(null);
  const isLocating = ref(false);
  const error = ref<GeoError | null>(null);
  const permissionState = ref<PermissionState | null>(null);

  async function checkPermission(): Promise<PermissionState | null> {
    const status = await queryPermissionStatus();
    if (!status) {
      return null;
    }
    permissionState.value = status.state;
    status.onchange = () => {
      permissionState.value = status.state;
    };
    return status.state;
  }

  async function getCurrentPosition(): Promise<GeoCoordinates> {
    const supportError = checkGeolocationSupport();
    if (supportError) {
      throw supportError;
    }
    const permState = await checkPermission();
    assertGeolocationAllowed(permState);
    isLocating.value = true;
    error.value = null;

    try {
      const coords = await fetchCoordinates();
      coordinates.value = coords;
      return coords;
    } catch (err: unknown) {
      const geoError = resolveGeoError(err);
      error.value = geoError;
      throw geoError;
    } finally {
      isLocating.value = false;
    }
  }

  return {
    coordinates,
    isLocating,
    error,
    permissionState,
    checkPermission,
    getCurrentPosition,
  };
}
