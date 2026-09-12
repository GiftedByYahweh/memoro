import book from './book.svg?raw';
import bookmark from './bookmark.svg?raw';
import camera from './camera.svg?raw';
import check from './check.svg?raw';
import close from './close.svg?raw';
import compass from './compass.svg?raw';
import edit from './edit.svg?raw';
import eyeOff from './eye-off.svg?raw';
import eye from './eye.svg?raw';
import filter from './filter.svg?raw';
import flight from './flight.svg?raw';
import folderStar from './folder-star.svg?raw';
import layers from './layers.svg?raw';
import lock from './lock.svg?raw';
import logo from './logo.svg?raw';
import mail from './mail.svg?raw';
import moreVertical from './more-vertical.svg?raw';
import navigation from './navigation.svg?raw';
import photos from './photos.svg?raw';
import plus from './plus.svg?raw';
import search from './search.svg?raw';
import settings from './settings.svg?raw';
import shield from './shield.svg?raw';
import sun from './sun.svg?raw';
import target from './target.svg?raw';
import trash from './trash.svg?raw';
import user from './user.svg?raw';

export const icons = {
  book,
  bookmark,
  camera,
  check,
  close,
  compass,
  edit,
  eye,
  eyeOff,
  filter,
  flight,
  folderStar,
  layers,
  lock,
  logo,
  mail,
  moreVertical,
  navigation,
  photos,
  plus,
  search,
  settings,
  shield,
  sun,
  target,
  trash,
  user,
} as const;

export type IconName = keyof typeof icons;
