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
  //statuses
  errorMain: () => token('theme-base-feedback-error-main'),
  warningMain: () => token('theme-base-feedback-warning-main'),
  successMain: () => token('theme-base-feedback-success-main'),
  infoMain: () => token('theme-base-feedback-info-main'),
  errorDark: () => token('theme-base-feedback-error-dark'),
  warningDark: () => token('theme-base-feedback-warning-dark'),
  successDark: () => token('theme-base-feedback-success-dark'),
  infoDark: () => token('theme-base-feedback-info-dark'),
  errorLight: () => token('theme-base-feedback-error-light'),
  warningLight: () => token('theme-base-feedback-warning-light'),
  successLight: () => token('theme-base-feedback-success-light'),
  infoLight: () => token('theme-base-feedback-info-light'),
  // specific selectors
  textPrimary: () => token('theme-base-text-primary'),
  textSecondary: () => token('theme-base-text-secondary'),
  primaryMain: () => token('theme-base-primary-main'),
  primaryHover: () => token('theme-base-primary-hover'),
  primaryDark: () => token('theme-base-primary-dark'),           
  onPrimary: () => token('theme-base-on-primary'),               
  inputWhiteBg: () => token('core-lighthouse-colors-neutrals-white-100'),
  textDisabled: () => token('theme-base-text-disabled'),
  actionDisabledBg: () => token('theme-base-action-disabled-bg'),
  actionDisabled: () => token('theme-base-action-disabled'),
  primaryFocusRing: () => token('theme-base-primary-focus-ring'),
  focusRing: () => token('theme-base-focus-ring'),
  actionHover: () => token('theme-base-action-hover'),
  // Divider
  divider: () => token('theme-base-divider'),
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