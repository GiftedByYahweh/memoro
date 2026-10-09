import { GEOCODING_CONSTANTS } from '@/constants/geocoding.constants';
import i18n from '@/i18n';

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

function extractLocality(addr: NominatimAddress): string {
  return addr.city ?? addr.town ?? addr.village ?? addr.suburb ?? '';
}

function extractStreet(addr: NominatimAddress): string {
  if (!addr.road) return '';
  return addr.house_number ? `${addr.road}, ${addr.house_number}` : addr.road;
}

function formatCoordinates(lat: number, lng: number): string {
  const precision = GEOCODING_CONSTANTS.COORDINATE_PRECISION;
  return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
}

function shortenDisplayName(displayName: string): string {
  return displayName.split(',').slice(0, GEOCODING_CONSTANTS.DISPLAY_NAME_PARTS).join(',').trim();
}

function formatStructuredAddress(addr: NominatimAddress): string {
  const locality = extractLocality(addr);
  const street = extractStreet(addr);
  if (locality && street) return `${locality}, ${street}`;
  if (locality) return addr.country ? `${locality}, ${addr.country}` : locality;
  return street;
}

function formatAddress(data: NominatimResponse, fallback: string): string {
  const structured = data.address ? formatStructuredAddress(data.address) : '';
  if (structured) return structured;
  return data.display_name ? shortenDisplayName(data.display_name) : fallback;
}

export const geocodingService = {
  reverseGeocode: async (lat: number, lng: number): Promise<string> => {
    const fallback = formatCoordinates(lat, lng);
    const lang = i18n.global.locale.value;
    const cacheKey = `${lang}:${fallback}`;
    const cached = geocodingCache.get(cacheKey);
    if (cached) return cached;

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
