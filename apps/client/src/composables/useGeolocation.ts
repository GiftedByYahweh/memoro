import { ref } from 'vue';
import { GEOLOCATION_TIMEOUT_MS, GEO_ERROR_CODE, GEO_ERROR_NAMES } from '@/constants/map.constants';

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

export function useGeolocation() {
  const coordinates = ref<GeoCoordinates | null>(null);
  const isLocating = ref(false);
  const error = ref<string | null>(null);

  function getCurrentPosition(): Promise<GeoCoordinates> {
    const supportError = checkGeolocationSupport();
    if (supportError) {
      error.value = supportError.stack ?? supportError.message;
      return Promise.reject(supportError);
    }
    isLocating.value = true;
    error.value = null;

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          isLocating.value = false;
          const coords: GeoCoordinates = {
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          };
          coordinates.value = coords;
          resolve(coords);
        },
        (err) => {
          isLocating.value = false;
          const geoError = formatGeolocationError(err);
          error.value = geoError.stack ?? geoError.message;
          reject(geoError);
        },
        {
          enableHighAccuracy: true,
          timeout: GEOLOCATION_TIMEOUT_MS,
        },
      );
    });
  }

  return {
    coordinates,
    isLocating,
    error,
    getCurrentPosition,
  };
}
