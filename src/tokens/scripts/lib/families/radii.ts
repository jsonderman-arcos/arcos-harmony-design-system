// src/tokens/scripts/lib/families/radii.ts
import { token } from '../core/tokenCore';
import { tokensByPrefix } from './utils';

export function allCoreRadii(): Record<string, number> {
  const raw = tokensByPrefix('core-radii-border-radius');
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw)) {
    const n = parseFloat(String(v));
    if (Number.isFinite(n)) out[k] = n;
  }
  return out;
}

export function radiusMax(): number {
  const explicit = token('core-radii-border-radius-max', '');
  const n = parseFloat(explicit);
  if (Number.isFinite(n)) return n;
  const all = Object.values(allCoreRadii());
  return all.length ? Math.max(...all) : 9999;
}

export function radiusByName(name: string, fallback?: number): number {
  const family = allCoreRadii();
  if (family[name] != null) return family[name];
  const fullKey = name.startsWith('core-radii-border-radius') ? name : `core-radii-border-radius-${name}`;
  if (family[fullKey] != null) return family[fullKey];
  return fallback ?? 0;
}

export function radiiSorted(): Array<[string, number]> {
  return Object.entries(allCoreRadii()).sort((a, b) => a[1] - b[1]);
}