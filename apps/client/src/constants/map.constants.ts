export const MAP_STYLES = {
  dark: 'https://tiles.openfreemap.org/styles/dark',
  fiord: 'https://tiles.openfreemap.org/styles/fiord',
  liberty: 'https://tiles.openfreemap.org/styles/liberty',
  positron: 'https://tiles.openfreemap.org/styles/positron',
  bright: 'https://tiles.openfreemap.org/styles/bright',
} as const;

export type MapStyleKey = keyof typeof MAP_STYLES;

export const DEFAULT_MAP_STYLE_KEY: MapStyleKey = 'dark';
export const DEFAULT_MAP_STYLE = MAP_STYLES[DEFAULT_MAP_STYLE_KEY];

export const DEFAULT_MAP_CENTER = {
  lng: 30.5234,
  lat: 50.4501,
} as const;

export const DEFAULT_MAP_ZOOM = 10;
export const USER_LOCATION_ZOOM = 14;
export const MIN_MAP_ZOOM = 1;
export const MAX_MAP_ZOOM = 19;

export const FLY_TO_DURATION_MS = 1500;
export const GEOLOCATION_TIMEOUT_MS = 10000;
export const PITCH_3D_DEGREES = 55;
export const PITCH_2D_DEGREES = 0;
export const BEARING_NORTH_DEGREES = 0;

export const MAP_CONTROL_ICON_SIZE = {
  TARGET: 22,
  LAYERS: 22,
  NAVIGATION: 20,
  NORTH: 24,
} as const;
