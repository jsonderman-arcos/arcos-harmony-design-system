// src/tokens/scripts/lib/core/tokenCore.ts
import core from '@theme/core.muiflat.json';
import theme from '@theme/theme.muiflat.json';

export const TOKENS: Record<string, string> = {
  ...core,
  ...theme,
};

// --- memoization cache for single token lookups (cleared when mode changes) ---
const tokenCache = new Map<string, string>(); // key: `${mode}::${key}::${fallback}`

let CURRENT_MODE: 'Light' | 'Dark' | 'Mobile' = 'Light';

export const activeMode = (): 'Light' | 'Dark' | 'Mobile' => CURRENT_MODE || 'Light';

export function setTokenMode(mode: 'Light' | 'Dark' | 'Mobile') {
  CURRENT_MODE = mode;
  tokenCache.clear();
}

export function byModeKey(key: string, mode = activeMode()): string | undefined {
  return (
    TOKENS[`${key}.valuesByMode.${mode}`] ??
    TOKENS[`${key}.valuesByMode.Default`] ??
    TOKENS[`${key}.valuesByMode.Light`]
  );
}

export function choose(keys: string[], mode = activeMode(), fallback?: string): string {
  for (const k of keys) {
    const v = byModeKey(k, mode);
    if (v != null && v !== '' && v !== 'var(undefined)') return v;
  }
  return fallback ?? '';
}

export function token(key: string, fallback?: string): string {
  const mode = activeMode();
  const cacheKey = `${mode}::${key}::${fallback ?? ''}`;
  const hit = tokenCache.get(cacheKey);
  if (hit !== undefined) return hit;

  // 1) Direct lookup by mode
  let modeValue = byModeKey(key, mode);

  // 2) Resolve var(--alias) if present
  if (modeValue?.startsWith('var(')) {
    const alias = modeValue.match(/^var\((--[^)]+)\)$/)?.[1]?.replace(/^--/, '');
    if (alias) {
      const aliasVal = byModeKey(alias, mode);
      if (aliasVal) {
        tokenCache.set(cacheKey, aliasVal);
        return aliasVal;
      }
    }
  }

  // 3) Resolve aliasOf metadata
  const aliasOf = TOKENS[`${key}.aliasOf`]?.replace(/^--/, '');
  if (!modeValue && aliasOf) {
    const aliased = byModeKey(aliasOf, mode);
    if (aliased) {
      tokenCache.set(cacheKey, aliased);
      return aliased;
    }
  }

  const result = modeValue ?? (fallback ?? '');
  tokenCache.set(cacheKey, result);
  return result;
}

/** Utility to resolve number tokens (px/rem without units) */
export function tokenNumber(key: string, fallback = 0): number {
  const val = token(key);
  const num = parseFloat(val);
  return isNaN(num) ? fallback : num;
}