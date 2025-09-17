// src/tokens/scripts/lib/families/spacing.ts
import { numericTokensByPrefix } from './utils';

export function allCoreSpacing(): Record<string, number> {
  return numericTokensByPrefix('core-spacing-spacing-');
}

export function spacingByName(name: string, fallback?: number): number {
  const family = allCoreSpacing();
  if (family[name] != null) return family[name];
  const fullKey = name.startsWith('core-spacing-spacing-') ? name : `core-spacing-spacing-${name}`;
  if (family[fullKey] != null) return family[fullKey];
  return fallback ?? 0;
}

export function spacingClosest(px: number): { key: string; value: number } {
  const family = allCoreSpacing();
  const entries = Object.entries(family).sort((a, b) => a[1] - b[1]);
  if (!entries.length) return { key: 'core-spacing-spacing-base', value: px };
  let best = entries[0];
  let bestDiff = Math.abs(entries[0][1] - px);
  for (const e of entries) {
    const diff = Math.abs(e[1] - px);
    if (diff < bestDiff) { best = e; bestDiff = diff; }
  }
  return { key: best[0], value: best[1] };
}