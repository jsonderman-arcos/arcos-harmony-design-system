// src/tokens/utils/tokenUtils.ts
import core from '../../outputs/core.muiflat.json';
import theme from '../../outputs/theme.muiflat.json';

const TOKENS: Record<string, string> = {
  ...core,
  ...theme,
};

/** Return the raw value of a token key (rgba/hex/px/etc). */
export function token(key: string, fallback?: string): string {
  const v = TOKENS[key];
  if (!v || v === 'var(undefined)') return fallback ?? '';

  const aliasMatch = v.match(/^var\((--[^)]+)\)$/);
  if (aliasMatch) {
    const aliasKey = aliasMatch[1].replace(/^--/, '');
    return TOKENS[aliasKey] || fallback || '';
  }

  return v;
}

/** Utility to resolve number tokens (px/rem without units) */
export function tokenNumber(key: string, fallback = 0): number {
  const val = token(key);
  const num = parseFloat(val);
  return isNaN(num) ? fallback : num;
}

/** Shorthand reads for common design tokens */
export const t = {
  // Base text & surfaces
  textPrimary: () => token('lighthouse--theme-base-text-primary'),
  textSecondary: () => token('lighthouse--theme-base-text-secondary'),
  textDisabled: () => token('lighthouse--theme-base-text-disabled'),
  divider: () => token('lighthouse--theme-base-divider-default'),
  surface: () => token('lighthouse--theme-base-background-paper-elevation-0'),
  surfaceRaised: () => token('lighthouse--theme-base-background-paper-elevation-1'),
  // Primary
  primaryMain: () => token('lighthouse--theme-base-primary-main'),
  primaryLight: () => token('lighthouse--theme-base-primary-light'),
  primaryDark: () => token('lighthouse--theme-base-primary-dark'),
  onPrimary: () => token('lighthouse--theme-base-primary-contrast-text'),
  primaryHover: () => token('lighthouse--theme-base-primary-states-hover'),
  primarySelected: () => token('lighthouse--theme-base-primary-states-selected'),
  primaryFocusRing: () => token('lighthouse--theme-base-primary-states-focus-visible'),
  // Secondary (if you need it)
  secondaryMain: () => token('lighthouse--theme-base-secondary-main'),
  // Focus / generic states
  focusRing: () => token('lighthouse--theme-base-text-states-focus-visible'),
  actionHover: () => token('lighthouse--theme-base-action-hover'),
  actionSelected: () => token('lighthouse--theme-base-action-selected'),
  actionDisabled: () => token('lighthouse--theme-base-action-disabled'),
  actionDisabledBg: () => token('lighthouse--theme-base-action-disabled-background'),
  // Radius / borders (fall back to 8 if missing)
  radius: Number(token('core-radii-border-radius', '8')),
  borderSize:  Number(token('lighthouse--theme-base-border-size-default', '1')),
};