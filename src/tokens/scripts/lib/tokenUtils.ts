// src/tokens/utils/tokenUtils.ts (facade)
import {
  TOKENS, activeMode, byModeKey, token, tokenNumber, choose,
  setTokenMode as coreSetTokenMode,
} from './core/tokenCore';
import { clearPrefixCaches } from './families/utils';
import { allCoreRadii, radiusMax, radiusByName, radiiSorted } from './families/radii';
import { allCoreSpacing, spacingByName, spacingClosest } from './families/spacing';
import { paperElevationToken, paperBackgroundForElevation } from './families/elevation';
import { SELECTORS } from './theme/selectors';

export { createTokenUtils } from './factory/createTokenUtils';

const selectors = Object.fromEntries(
  Object.entries(SELECTORS).map(([name, keys]) => [name, () => choose(keys)])
) as Record<string, () => string>;

/** ---------- Number parsing helpers ---------- */
const toNum = (v: unknown, fb = NaN) => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? ''));
  return Number.isFinite(n) ? n : fb;
};

/** Sorted [key, value] entries by numeric value ascending for any numeric family. */
export function sortEntriesByValueAsc(obj: Record<string, number>): Array<[string, number]> {
  return Object.entries(obj).sort((a, b) => a[1] - b[1]);
}


export function setTokenMode(mode: 'Light' | 'Dark' | 'Mobile') {
  coreSetTokenMode(mode);
  clearPrefixCaches();
}

export const t = Object.freeze({
  ...selectors,
  // Paper elevation mapping
  paperElevationToken: (level: number) => paperElevationToken(level),
  paperBackgroundForElevation: (level: number) => paperBackgroundForElevation(level) ?? token(paperElevationToken(level), token('theme-base-background-elevations-highest')),
  get radius() {
    return Number(token('theme-base-shape.radius', token('core-radii-border-radius', '8')));
  },
  // Shape / numeric (radii)
  radiiAll: () => allCoreRadii(),
  radiusMax: () => radiusMax(),
  radiusBy: (name: string, fb?: number) => radiusByName(name, fb),
  radiiSorted: () => radiiSorted(),
  // Spacing family accessors
  spacingsAll: () => allCoreSpacing(),
  spacingBy: (name: string, fb?: number) => spacingByName(name, fb),
  spacingClosest: (px: number) => spacingClosest(px).value,
  get borderSize() {
    return Number(token('theme-base-border-size.default', token('theme-base-border-size-default', '1')));
  },
} as const);

export type TokenShorthand = typeof t;