import { ref } from 'vue';
import {
  GEOLOCATION_HIGH_ACCURACY_TIMEOUT_MS,
  GEOLOCATION_LOW_ACCURACY_TIMEOUT_MS,
  GEOLOCATION_MAX_AGE_MS,
  GEO_ERROR_CODE,
  GEO_ERROR_NAMES,
} from '@/constants/map.constants';

export interface GeoCoordinates {
  lng: number;
  lat: number;
}

function getGeoCodeName(code: number): string {
  if (code === GEO_ERROR_CODE.PERMISSION_DENIED) {
    return GEO_ERROR_NAMES[GEO_ERROR_CODE.PERMISSION_DENIED];
  }
  if (code === GEO_ERROR_CODE.POSITION_UNAVAILABLE) {
    return GEO_ERROR_NAMES[GEO_ERROR_CODE.POSITION_UNAVAILABLE];
  }
  if (code === GEO_ERROR_CODE.TIMEOUT) {
    return GEO_ERROR_NAMES[GEO_ERROR_CODE.TIMEOUT];
  }
  return 'UNKNOWN_ERROR';
}

function formatGeolocationError(err: GeolocationPositionError): Error {
  const codeName = getGeoCodeName(err.code);
  const detail = err.message.length > 0 ? err.message : 'No message provided by browser';
  return new Error(`GeolocationPositionError [${codeName} (code ${String(err.code)})]: ${detail}`);
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
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function isTimeoutError(err: unknown): boolean {
  return (
    typeof err === 'object' && err !== null && 'code' in err && err.code === GEO_ERROR_CODE.TIMEOUT
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
    if (!isTimeoutError(err)) {
      throw formatGeolocationError(err as GeolocationPositionError);
    }
    try {
      return await queryPosition({
        enableHighAccuracy: false,
        timeout: GEOLOCATION_LOW_ACCURACY_TIMEOUT_MS,
        maximumAge: GEOLOCATION_MAX_AGE_MS,
      });
    } catch (fallbackErr: unknown) {
      throw formatGeolocationError(fallbackErr as GeolocationPositionError);
    }
  }
}

function extractCoordinates(position: GeolocationPosition): GeoCoordinates {
  return {
    lng: position.coords.longitude,
    lat: position.coords.latitude,
  };
}

function normalizeError(err: unknown): Error {
  return err instanceof Error ? err : new Error(String(err));
}

export function useGeolocation() {
  const coordinates = ref<GeoCoordinates | null>(null);
  const isLocating = ref(false);
  const error = ref<string | null>(null);

  async function getCurrentPosition(): Promise<GeoCoordinates> {
    const supportError = checkGeolocationSupport();
    if (supportError) {
      error.value = supportError.stack ?? supportError.message;
      throw supportError;
    }
    isLocating.value = true;
    error.value = null;

    try {
      const position = await requestPosition();
      const coords = extractCoordinates(position);
      coordinates.value = coords;
      return coords;
    } catch (err: unknown) {
      const geoError = normalizeError(err);
      error.value = geoError.stack ?? geoError.message;
      throw geoError;
    } finally {
      isLocating.value = false;
    }
  }

  return {
    coordinates,
    isLocating,
    error,
    getCurrentPosition,
  };
}
