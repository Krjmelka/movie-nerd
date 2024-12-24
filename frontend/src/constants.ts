import { GameMode } from './types';

export const ROUND_TIME_MAP: Record<GameMode, number> = {
  // seconds
  ACTORS: 20,
  MOVIE: 10,
  DESCRIPTION: 30,
} as const;
export const IMAGE_URL_PATH = 'https://image.tmdb.org/t/p/';

export const MOVIE_FRAGMENT_IMAGE_SIZE = {
  w300: 'w300',
  w780: 'w780',
  w1280: 'w1280',
  original: 'original',
} as const;
export const MOVIE_POSTER_IMAGE_SIZE = {
  w92: 'w92',
  w154: 'w154',
  w185: 'w185',
  w342: 'w342',
  w500: 'w500',
  w780: 'w780',
  original: 'original',
} as const;

export const ASPECT_RATIO_MAP: Record<GameMode, string> = {
  ACTORS: '740 / 284',
  MOVIE: '780 / 438',
  DESCRIPTION: '780 / 438',
} as const;
