/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

const OPTIMIZE_MODE_DIFF = true;
const PACKAGE_ROOT = path.resolve(__dirname, '..');

// Allow selecting which collections to build via CLI or ENV
// Usage: node build-from-figma.js --collections="Core,Lighthouse Theme,Theme – Application"
// or set env: BUILD_COLLECTIONS="Core,Lighthouse Theme"
const ARG_COLLECTIONS = process.argv.find(a => a.startsWith('--collections='));
const REQ_COLLECTIONS: string[] | null = ARG_COLLECTIONS
  ? ARG_COLLECTIONS.split('=')[1].split(',').map(s => s.trim()).filter(Boolean)
  : (process.env.BUILD_COLLECTIONS
      ? String(process.env.BUILD_COLLECTIONS).split(',').map(s => s.trim()).filter(Boolean)
      : null);

const isCoreCollectionName = (name: string) => /(^|[^a-z])core([^a-z]|$)/i.test(name);

/** ---------- tiny utils ---------- */
const toKebab = (s: string) =>
  s
    .replace(/[^a-zA-Z0-9/]+/g, ' ')
    .trim()
    .replace(/[A-Z]+(?![a-z])|[A-Z]/g, m => '-' + m.toLowerCase())
    .replace(/\/+/g, '/')
    .replace(/\s+/g, '-')
    .replace(/^-+/, '')
    .toLowerCase();

const normCollectionName = (n: string) => toKebab(n).replace(/-+collection$/, '');

function colorObjToRgba(v: any): string {
  if (!v || typeof v !== 'object') return String(v);
  if ('r' in v && 'g' in v && 'b' in v) {
    const r = Math.round((v.r ?? 0) * 255);
    const g = Math.round((v.g ?? 0) * 255);
    const b = Math.round((v.b ?? 0) * 255);
    const a = v.a == null ? 1 : v.a;
    return `rgba(${r},${g},${b},${a})`;
  }
  return String(v);
}

/** ---------- types from your sample ---------- */
type ModeId = string;
type VarId = string;
type CollectionId = string;

type FigmaVariable = {
  id: VarId;
  name: string; // "path/like/this"
  variableCollectionId: CollectionId;
  resolvedType: 'FLOAT' | 'COLOR' | 'STRING' | string;
  valuesByMode: Record<ModeId, any>; // number|string|{r,g,b,a}|{type:"VARIABLE_ALIAS", id: VarId}
};

type FigmaCollection = {
  id: CollectionId;
  name: string;
  defaultModeId: ModeId;
  modes: { modeId: ModeId; name: string }[];
  variableIds: VarId[];
};

type FigmaResponse = {
  meta: {
    variableCollections: Record<CollectionId, FigmaCollection>;
    variables: Record<VarId, FigmaVariable>;
  };
};

/** ---------- flat token shape we’ll emit ---------- */
type FlatToken = {
  id: VarId;
  var: `--${string}`;         // css var name
  name: string;               // kebab name without leading --
  type: string;
  collectionId: CollectionId;
  collectionName: string;
  valuesByMode: Record<string, string | number>;
  aliasOf?: `--${string}`;
};

type FlatMap = Record<string, FlatToken>; // key is kebab name (no leading --)

/** ---------- read input ---------- */
const INPUT = path.resolve(PACKAGE_ROOT, 'src/tokens/inputs/tokens-raw-response.json');
const OUT_DIR = path.resolve(PACKAGE_ROOT, 'src/theme');
fs.mkdirSync(OUT_DIR, { recursive: true });

const raw: FigmaResponse = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
const collections = Object.values(raw.meta.variableCollections);
console.log('Detected collections:');
collections.forEach(c => console.log('-', c.name));

const variables = raw.meta.variables;

/** ---------- choose which collections to build ---------- */
let buildCollections: FigmaCollection[] = [];

if (REQ_COLLECTIONS && REQ_COLLECTIONS.length) {
  // fuzzy match by substring (case-insensitive)
  const wanted = REQ_COLLECTIONS.map(s => s.toLowerCase());
  buildCollections = collections.filter(c => wanted.some(w => c.name.toLowerCase().includes(w)));
  if (!buildCollections.length) {
    console.error('No matching collections for:', REQ_COLLECTIONS.join(', '));
    console.error('Available collections:');
    collections.forEach(c => console.error('-', c.name));
    process.exit(1);
  }
} else {
  // fallback to legacy auto-detect: one Core + one Theme-like
  const coreCol = collections.find(c => isCoreCollectionName(c.name));
  const themeCol = collections.find(c => /(theme|lighthouse)/i.test(c.name) && (!coreCol || c.id !== coreCol.id));
  if (!coreCol || !themeCol) {
    console.error('Could not auto-detect Core and Theme collections. Use --collections or BUILD_COLLECTIONS. Found:');
    collections.forEach(c => console.error('-', c.name));
    process.exit(1);
  }
  buildCollections = [coreCol, themeCol];
}

const COLLECTION_PREFIX: Record<string, string> = Object.fromEntries(
  buildCollections.map(c => [c.id, normCollectionName(c.name)])
);

/** ---------- build a global id -> cssVarName map ---------- */
function kebabFromFigmaName(n: string) {
  // Figma names may already include a “Lighthouse/…” prefix; keep hierarchy, kebab it
  const parts = n.split('/').map(p => toKebab(p));
  return parts.join('-').replace(/--+/g, '-');
}

function makeCssVarName(collectionPrefix: string, figmaName: string): `--${string}` {
  const base = kebabFromFigmaName(figmaName);
  // avoid duplicating collection if already included in path
  const hasPrefix = base.startsWith(collectionPrefix + '-');
  const name = hasPrefix ? base : `${collectionPrefix}-${base}`;
  return (`--${name}`) as `--${string}`;
}

const idToVar: Record<VarId, `--${string}`> = {};

for (const v of Object.values(variables)) {
  const col = raw.meta.variableCollections[v.variableCollectionId];
  if (!col) continue;
  if (!buildCollections.find(bc => bc.id === col.id)) continue; // skip variables from collections we are not building
  const prefix = COLLECTION_PREFIX[col.id];
  idToVar[v.id] = makeCssVarName(prefix, v.name);
}

/** ---------- flatten a collection ---------- */
function flattenCollection(col: FigmaCollection): FlatMap {
  const prefix = COLLECTION_PREFIX[col.id];
  const fm: FlatMap = {};
  for (const vid of col.variableIds) {
    const v = variables[vid];
    if (!v) continue;

    const cssVar = makeCssVarName(prefix, v.name);
    const name = cssVar.slice(2); // drop leading --
    const flat: FlatToken = {
      id: v.id,
      var: cssVar,
      name,
      type: v.resolvedType,
      collectionId: col.id,
      collectionName: col.name,
      valuesByMode: {},
    };

    for (const [modeId, rawVal] of Object.entries(v.valuesByMode || {})) {
      const modeName = col.modes.find(m => m.modeId === modeId)?.name ?? modeId;
      if (rawVal && typeof rawVal === 'object' && rawVal.type === 'VARIABLE_ALIAS' && rawVal.id) {
        flat.aliasOf = idToVar[rawVal.id]; // we store last alias seen; good enough because Theme values are usually aliases per mode
        flat.valuesByMode[modeName] = `var(${idToVar[rawVal.id]})`;
      } else {
        flat.valuesByMode[modeName] =
          v.resolvedType === 'COLOR' ? colorObjToRgba(rawVal) : String(rawVal);
      }
    }

    fm[name] = flat;
  }
  return fm;
}

const flatByCollection: Record<string, FlatMap> = Object.fromEntries(
  buildCollections.map(col => [col.id, flattenCollection(col)])
);

/** ---------- resolve Core internal aliases to raw values ---------- */
function resolveCoreAliasesToRaw(fm: FlatMap, col: FigmaCollection): FlatMap {
  // Build dependency edges
  const edges: Record<string, string[]> = {};
  for (const t of Object.values(fm)) {
    const deps: string[] = [];
    // If any mode is var(--x), treat as dependency
    for (const v of Object.values(t.valuesByMode)) {
      const m = /^var\(--(.+?)\)/.exec(String(v));
      if (m) deps.push(m[1]);
    }
    edges[t.name] = Array.from(new Set(deps));
  }

  // topo sort
  const visited: Record<string, number> = {}; // 0=unseen,1=visiting,2=done
  const order: string[] = [];
  function dfs(n: string) {
    if (visited[n] === 1) throw new Error(`Alias cycle in Core: ${n}`);
    if (visited[n] === 2) return;
    visited[n] = 1;
    for (const d of edges[n] || []) dfs(d);
    visited[n] = 2;
    order.push(n);
  }
  Object.keys(fm).forEach(dfs);

  // map mode names (stable list)
  const modeNames = col.modes.map(m => m.name);
  const defaultMode = col.modes.find(m => m.modeId === col.defaultModeId)?.name ?? modeNames[0];

  // resolve in topo order
  for (const name of order) {
    const t = fm[name];
    for (const mode of modeNames) {
      let v = t.valuesByMode[mode];
      if (v == null) v = t.valuesByMode[defaultMode]; // fallback
      const m = /^var\(--(.+?)\)/.exec(String(v));
      if (m) {
        const dep = fm[m[1]];
        if (!dep) continue;
        let depV = dep.valuesByMode[mode] ?? dep.valuesByMode[defaultMode];
        // chase only once because topological order guarantees dep was resolved earlier
        const m2 = /^var\(--(.+?)\)/.exec(String(depV));
        if (m2) {
          // if still alias, keep it (rare in Core); but try one more hop
          const dep2 = fm[m2[1]];
          if (dep2) depV = dep2.valuesByMode[mode] ?? dep2.valuesByMode[defaultMode];
        }
        t.valuesByMode[mode] = depV;
      }
    }
    // after resolving, strip aliasOf marker for Core
    delete t.aliasOf;
  }

  return fm;
}

for (const col of buildCollections) {
  if (isCoreCollectionName(col.name)) {
    resolveCoreAliasesToRaw(flatByCollection[col.id], col);
  }
}

/** ---------- CSS scope planners (auto from mode names) ---------- */
function scopeOpenClose(collection: FigmaCollection, isThemeLike: boolean) {
  const defaultModeName =
    collection.modes.find(m => m.modeId === collection.defaultModeId)?.name ??
    collection.modes[0].name;

  type Scope = { open: string; close: string; modeName: string }[];
  const scopes: Scope = [];

  for (const m of collection.modes) {
    const name = m.name;
    const norm = toKebab(name);

    if (isThemeLike) {
      // Theme: default mode at :root; others at [data-theme="..."]
      if (name === defaultModeName) {
        scopes.push({ modeName: name, open: ':root {\n', close: '}\n' });
      } else {
        scopes.push({
          modeName: name,
          open: `[data-theme="${norm}"] {\n`,
          close: '}\n',
        });
      }
    } else {
      // Core: attempt responsive mapping from common names, else data attribute
      const n = name.toLowerCase();
      if (name === defaultModeName) {
        scopes.push({ modeName: name, open: ':root {\n', close: '}\n' });
      } else if (/\b(large|desktop|xl|lg)\b/.test(n)) {
        scopes.push({
          modeName: name,
          open: '@media (min-width: 1024px) {\n:root {\n',
          close: '}\n}\n',
        });
      } else if (/\b(mobile|small|sm)\b/.test(n)) {
        scopes.push({
          modeName: name,
          open: '@media (max-width: 640px) {\n:root {\n',
          close: '}\n}\n',
        });
      } else {
        // generic attribute fallback so you can opt-in via JS if needed
        scopes.push({
          modeName: name,
          open: `[data-core-mode="${norm}"] {\n`,
          close: '}\n',
        });
      }
    }
  }

  return { scopes, defaultModeName };
}

/** ---------- helper to resolve var(--...) references recursively ---------- */
function resolveFinalValue(
  value: string,
  map: FlatMap,
  preferredMode?: string,
  fallbackMode?: string,
): string {
  let val = value;
  const seen = new Set<string>();

  while (/^var\(--.+\)$/.test(val)) {
    // Extract the CSS var name and normalize to our FlatMap key (no leading `--`)
    const rawRef = String(val).slice(4, -1);
    const ref = rawRef.replace(/^--/, ''); // keys in FlatMap do NOT include leading dashes

    if (seen.has(ref)) break;
    seen.add(ref);

    const token = map[ref];
    if (!token) break;

    // Resolution order: preferred mode -> fallback mode -> Default -> Light -> first available
    let next =
      (preferredMode ? token.valuesByMode[preferredMode] : undefined) ??
      (fallbackMode ? token.valuesByMode[fallbackMode] : undefined) ??
      token.valuesByMode['Default'] ??
      token.valuesByMode['Light'] ??
      Object.values(token.valuesByMode)[0];

    if (next == null) break;

    val = String(next);
  }

  return val;
}

/** ---------- CSS writers ---------- */
function writeCssByMode(
  fm: FlatMap,
  collection: FigmaCollection,
  resolverMap: FlatMap,
  opts: { preferAlias: boolean },
) {
  const { scopes, defaultModeName } = scopeOpenClose(collection, !isCoreCollectionName(collection.name));
  const names = Object.keys(fm).sort();
  let css = '';

  for (const s of scopes) {
    css += s.open;
    for (const name of names) {
      const t = fm[name];
      const varName = `--${name}`;
      const val = t.valuesByMode[s.modeName];
      const fallback = t.valuesByMode[defaultModeName];

      if (
        s.modeName === defaultModeName ||
        !OPTIMIZE_MODE_DIFF ||
        val == null ||
        val !== fallback
      ) {
        const output = val ?? fallback;
        const resolvedOutput = resolveFinalValue(
          String(output),
          resolverMap,
          s.modeName,
          defaultModeName,
        );
        if (opts.preferAlias && t.aliasOf && /^var\(--/.test(String(output))) {
          css += `  ${varName}: ${output};\n`;
        } else {
          css += `  ${varName}: ${resolvedOutput};\n`;
        }
      }
    }
    css += s.close;
  }
  return css;
}

// Utility function to flatten objects into dot-notation keys
function flattenObject(obj: any, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};

  function recurse(current: any, prop: string) {
    if (Object(current) !== current || Array.isArray(current)) {
      result[prop] = String(current);
    } else {
      let isEmpty = true;
      for (const key in current) {
        isEmpty = false;
        recurse(current[key], prop ? `${prop}.${key}` : key);
      }
      if (isEmpty && prop) result[prop] = '';
    }
  }

  recurse(obj, prefix);
  return result;
}

/** ---------- emit files (multi-collection) ---------- */

// Build a single resolver map from all selected collections (after core alias resolution)
const combinedResolver: FlatMap = Object.assign({}, ...buildCollections.map(c => flatByCollection[c.id]));

let aggregatedCss = '';

for (const col of buildCollections) {
  const prefix = COLLECTION_PREFIX[col.id];
  const fm = flatByCollection[col.id];
  const preferAlias = !isCoreCollectionName(col.name);

  const css = `/* AUTO-GENERATED: ${prefix.toUpperCase()} */\n` + writeCssByMode(fm, col, combinedResolver, { preferAlias });
  aggregatedCss += css + '\n';

  // Write per-collection flat JSON
  fs.writeFileSync(path.join(OUT_DIR, `${prefix}.flat.json`), JSON.stringify(fm, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, `${prefix}.css`), css);

  // Resolved object -> dot notation for MUI compatibility
  const defaultModeName = col.modes.find(m => m.modeId === col.defaultModeId)?.name ?? col.modes[0].name;
  const resolvedObj = Object.fromEntries(
    Object.entries(fm).map(([k, t]) => [
      k,
      {
        ...t,
        valuesByMode: Object.fromEntries(
          Object.entries(t.valuesByMode).map(([m, v]) => [
            m,
            resolveFinalValue(String(v), combinedResolver, m, defaultModeName),
          ])
        ),
      },
    ])
  );
  const dot = flattenObject(resolvedObj);
  fs.writeFileSync(path.join(OUT_DIR, `${prefix}.muiflat.json`), JSON.stringify(dot, null, 2));
}

// Aggregate CSS
fs.writeFileSync(path.join(OUT_DIR, 'tokens.css'), aggregatedCss.trim() + '\n');

console.log('[tokens] Built collections:');
for (const col of buildCollections) {
  const prefix = COLLECTION_PREFIX[col.id];
  console.log('-', col.name, '=>', path.join(OUT_DIR, `${prefix}.css`));
  console.log('  ', path.join(OUT_DIR, `${prefix}.flat.json`));
  console.log('  ', path.join(OUT_DIR, `${prefix}.muiflat.json`));
}
console.log('-', path.join(OUT_DIR, 'tokens.css'));
