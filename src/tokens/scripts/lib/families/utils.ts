// src/tokens/scripts/lib/families/utils.ts
import { TOKENS, activeMode, byModeKey } from '../core/tokenCore';

// memo caches for prefix scans (cleared via clearPrefixCaches)
const byPrefixCache = new Map<string, Record<string, string>>();
const numericByPrefixCache = new Map<string, Record<string, number>>();

export function clearPrefixCaches() {
  byPrefixCache.clear();
  numericByPrefixCache.clear();
}

/** List resolved token values by prefix (mode-aware, alias-resolving). */
export function tokensByPrefix(prefix: string): Record<string, string> {
  const mode = activeMode();
  const cacheKey = `${mode}::${prefix}`;
  const hit = byPrefixCache.get(cacheKey);
  if (hit) return hit;

  const bases = new Set<string>();
  for (const key of Object.keys(TOKENS)) {
    if (!key.startsWith(prefix)) continue;
    if (key.endsWith('.aliasOf')) continue;
    const base = key.includes('.valuesByMode.') ? key.split('.valuesByMode.')[0] : key;
    bases.add(base);
  }

  const out: Record<string, string> = {};
  for (const base of bases) {
    const direct = byModeKey(base, mode) ?? TOKENS[base];
    if (direct == null || direct === '' || direct === 'var(undefined)') continue;
    let v = String(direct);
    if (v.startsWith('var(')) {
      const alias = v.match(/^var\((--[^)]+)\)$/)?.[1]?.replace(/^--/, '');
      if (alias) v = byModeKey(alias, mode) ?? v;
    }
    out[base] = v;
  }
  byPrefixCache.set(cacheKey, out);
  return out;
}

const toNum = (v: unknown, fb = NaN) => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? ''));
  return Number.isFinite(n) ? n : fb;
};

export function numericTokensByPrefix(prefix: string): Record<string, number> {
  const mode = activeMode();
  const cacheKey = `${mode}::${prefix}`;
  const hit = numericByPrefixCache.get(cacheKey);
  if (hit) return hit;

  const raw = tokensByPrefix(prefix);
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw)) {
    const n = toNum(v);
    if (Number.isFinite(n)) out[k] = n;
  }
  numericByPrefixCache.set(cacheKey, out);
  return out;
}