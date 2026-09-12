import { ref } from 'vue';
import { GEOLOCATION_TIMEOUT_MS } from '@/constants/map.constants';

export interface GeoCoordinates {
  lng: number;
  lat: number;
}

export function useGeolocation() {
  const coordinates = ref<GeoCoordinates | null>(null);
  const isLocating = ref(false);
  const error = ref<string | null>(null);

  function getCurrentPosition(): Promise<GeoCoordinates> {
    if (!('geolocation' in navigator)) {
      const message = 'Geolocation is not supported by your browser';
      error.value = message;
      return Promise.reject(new Error(message));
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
          error.value = err.message;
          reject(new Error(err.message));
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
