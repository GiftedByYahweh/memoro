import { RoutePaths } from '@/router/routes';
import type { IconName } from '@/assets/icons';

export interface NavItemConfig {
  id: string;
  labelKey: string;
  path: string;
  icon: IconName;
}

export const NAV_ITEMS_LEFT: readonly NavItemConfig[] = [
  {
    id: 'map',
    labelKey: 'nav.map',
    path: RoutePaths.map.path,
    icon: 'compass',
  },
  {
    id: 'feed',
    labelKey: 'nav.feed',
    path: RoutePaths.feed.path,
    icon: 'book',
  },
] as const;

export const NAV_ITEMS_RIGHT: readonly NavItemConfig[] = [
  {
    id: 'albums',
    labelKey: 'nav.albums',
    path: RoutePaths.albums.path,
    icon: 'photos',
  },
  {
    id: 'profile',
    labelKey: 'nav.profile',
    path: RoutePaths.profile.path,
    icon: 'user',
  },
] as const;
