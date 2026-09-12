import { RoutePaths } from '@/router/routes';
import type { IconName } from '@/assets/icons';

export interface NavItemConfig {
  id: string;
  label: string;
  path: string;
  icon: IconName;
}

export const NAV_ITEMS_LEFT: readonly NavItemConfig[] = [
  {
    id: 'map',
    label: 'Map',
    path: RoutePaths.map.path,
    icon: 'compass',
  },
  {
    id: 'feed',
    label: 'Feed',
    path: RoutePaths.feed.path,
    icon: 'book',
  },
] as const;

export const NAV_ITEMS_RIGHT: readonly NavItemConfig[] = [
  {
    id: 'albums',
    label: 'Albums',
    path: RoutePaths.albums.path,
    icon: 'photos',
  },
  {
    id: 'profile',
    label: 'Profile',
    path: RoutePaths.profile.path,
    icon: 'user',
  },
] as const;
