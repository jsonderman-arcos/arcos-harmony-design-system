// src/tokens/utils/tokenUtils.ts
import core from '../../outputs/core.muiflat.json';
import theme from '../../outputs/theme.muiflat.json';

const TOKENS: Record<string, string> = {
  ...core,
  ...theme,
};

/** Return the raw value of a token key (rgba/hex/px/etc). 
export function token(key: string, fallback?: string): string {
  const v = TOKENS[key];
  if (!v || v === 'var(undefined)') return fallback ?? '';

  const aliasMatch = v.match(/^var\((--[^)]+)\)$/);
  if (aliasMatch) {
    const aliasKey = aliasMatch[1].replace(/^--/, '');
    return TOKENS[aliasKey] || fallback || '';
  }

  return v;
}*/

let CURRENT_MODE = 'Light';

export function setTokenMode(mode: 'Light' | 'Dark' | 'Mobile') {
  CURRENT_MODE = mode;
}

export function token(key: string, fallback?: string): string {
  const mode = CURRENT_MODE || 'Light'; // fallback if undefined

  let modeValue = TOKENS[`${key}.valuesByMode.${mode}`];

  // fallback to Default
  if (!modeValue && mode === 'Light') {
    modeValue = TOKENS[`${key}.valuesByMode.Default`];
  }

      console.log ("Mode Value");
    console.log (modeValue);
  if (modeValue?.startsWith('var(')) {

    const alias = modeValue.match(/^var\((--[^)]+)\)$/)?.[1]?.replace(/^--/, '');
    if (alias) {
      return TOKENS[alias + `.valuesByMode.Default`] || fallback || '';
    }
  }

  const aliasOf = TOKENS[`${key}.aliasOf`]?.replace(/^--/, '');
  if (aliasOf) {
    return TOKENS[aliasOf + `.valuesByMode.Default`] || fallback || '';
  }

  return fallback ?? '';
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

export function createTokenUtils(tokens: Record<string, string>) {
  const getToken = (key: string, fallback?: string): string => {
    const v = tokens[key];
    if (!v || v === 'var(undefined)') return fallback ?? '';

    const aliasMatch = v.match(/^var\((--[^)]+)\)$/);
    if (aliasMatch) {
      const aliasKey = aliasMatch[1].replace(/^--/, '');
      return tokens[aliasKey] || fallback || '';
    }

    return v;
  };

  const getTokenNumber = (key: string, fallback = 0): number => {
    const val = getToken(key);
    const num = parseFloat(val);
    return isNaN(num) ? fallback : num;
  };

  return {
    token: getToken,
    tokenNumber: getTokenNumber,
    t: {
      textPrimary: () => getToken('lighthouse--theme-base-text-primary'),
      textSecondary: () => getToken('lighthouse--theme-base-text-secondary'),
      textDisabled: () => getToken('lighthouse--theme-base-text-disabled'),
      divider: () => getToken('lighthouse--theme-base-divider-default'),
      surface: () => getToken('lighthouse--theme-base-background-paper-elevation-0'),
      surfaceRaised: () => getToken('lighthouse--theme-base-background-paper-elevation-1'),
      primaryMain: () => getToken('lighthouse--theme-base-primary-main'),
      primaryLight: () => getToken('lighthouse--theme-base-primary-light'),
      primaryDark: () => getToken('lighthouse--theme-base-primary-dark'),
      onPrimary: () => getToken('lighthouse--theme-base-primary-contrast-text'),
      primaryHover: () => getToken('lighthouse--theme-base-primary-states-hover'),
      primarySelected: () => getToken('lighthouse--theme-base-primary-states-selected'),
      primaryFocusRing: () => getToken('lighthouse--theme-base-primary-states-focus-visible'),
      secondaryMain: () => getToken('lighthouse--theme-base-secondary-main'),
      focusRing: () => getToken('lighthouse--theme-base-text-states-focus-visible'),
      actionHover: () => getToken('lighthouse--theme-base-action-hover'),
      actionSelected: () => getToken('lighthouse--theme-base-action-selected'),
      actionDisabled: () => getToken('lighthouse--theme-base-action-disabled'),
      actionDisabledBg: () => getToken('lighthouse--theme-base-action-disabled-background'),
      radius: getTokenNumber('core-radii-border-radius', 8),
      borderSize: getTokenNumber('lighthouse--theme-base-border-size-default', 1),
    },
  };
}