// src/tokens/scripts/lib/families/elevation.ts
import { token } from '../core/tokenCore';

const PAPER_ELEVATION_TOKENS: Record<number, string> = {
  0: 'theme-base-background-elevations-base',
  1: 'theme-base-background-elevations-level-1',
  2: 'theme-base-background-elevations-level-2',
  3: 'theme-base-background-elevations-level-3',
  4: 'theme-base-background-elevations-level-4',
  5: 'theme-base-background-elevations-level-5',
  6: 'theme-base-background-elevations-highest',
};

export function paperElevationToken(level: number): string {
  return Object.prototype.hasOwnProperty.call(PAPER_ELEVATION_TOKENS, level)
    ? PAPER_ELEVATION_TOKENS[level]
    : 'theme-base-background-elevations-highest';
}

export function paperBackgroundForElevation(level: number): string {
  const key = paperElevationToken(level);
  return token(key, token('theme-base-background-elevations-highest', ''));
}