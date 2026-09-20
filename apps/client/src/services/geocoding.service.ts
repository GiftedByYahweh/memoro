import { GEOCODING_CONSTANTS } from '@/constants/geocoding.constants';

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  road?: string;
  house_number?: string;
  suburb?: string;
  neighbourhood?: string;
  state?: string;
  country?: string;
}

interface NominatimResponse {
  display_name?: string;
  address?: NominatimAddress;
}

const geocodingCache = new Map<string, string>();

function buildCacheKey(lat: number, lng: number): string {
  const roundedLat = lat.toFixed(GEOCODING_CONSTANTS.COORDINATE_PRECISION);
  const roundedLng = lng.toFixed(GEOCODING_CONSTANTS.COORDINATE_PRECISION);
  return `${roundedLat},${roundedLng}`;
}

function extractLocality(addr: NominatimAddress): string {
  return addr.city ?? addr.town ?? addr.village ?? addr.suburb ?? '';
}

function extractStreet(addr: NominatimAddress): string {
  if (!addr.road) return '';
  return addr.house_number ? `${addr.road}, ${addr.house_number}` : addr.road;
}

function buildLocalityString(locality: string, country?: string): string {
  return country ? `${locality}, ${country}` : locality;
}

function formatAddress(data: NominatimResponse, fallbackCoords: string): string {
  const addr = data.address;
  if (!addr) {
    return data.display_name?.split(',').slice(0, 3).join(',').trim() ?? fallbackCoords;
  }

  const locality = extractLocality(addr);
  const street = extractStreet(addr);

  if (locality && street) {
    return `${locality}, ${street}`;
  }
  if (locality) {
    return buildLocalityString(locality, addr.country);
  }
  if (street) {
    return street;
  }
  return data.display_name?.split(',').slice(0, 3).join(',').trim() ?? fallbackCoords;
}

export const geocodingService = {
  reverseGeocode: async (lat: number, lng: number, lang = 'uk'): Promise<string> => {
    const cacheKey = buildCacheKey(lat, lng);
    const cached = geocodingCache.get(cacheKey);
    if (cached) return cached;

    const fallback = `${lat.toFixed(GEOCODING_CONSTANTS.COORDINATE_PRECISION)}, ${lng.toFixed(GEOCODING_CONSTANTS.COORDINATE_PRECISION)}`;
    const url = `${GEOCODING_CONSTANTS.REVERSE_URL}?lat=${String(lat)}&lon=${String(lng)}&format=jsonv2&accept-language=${lang}`;

    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(GEOCODING_CONSTANTS.REQUEST_TIMEOUT_MS),
      });
      if (!response.ok) return fallback;
      const data = (await response.json()) as NominatimResponse;
      const formatted = formatAddress(data, fallback);
      geocodingCache.set(cacheKey, formatted);
      return formatted;
    } catch {
      return fallback;
    }
  },
};
