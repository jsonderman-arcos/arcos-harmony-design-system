/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

const OPTIMIZE_MODE_DIFF = true;

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
const INPUT = path.resolve('src/tokens/inputs/tokens-raw-response.json'); // adjust if needed
const OUT_DIR = path.resolve('src/tokens/outputs');
fs.mkdirSync(OUT_DIR, { recursive: true });

const raw: FigmaResponse = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
const collections = Object.values(raw.meta.variableCollections);
console.log('Detected collections:');
collections.forEach(c => console.log('-', c.name));

const variables = raw.meta.variables;

/** ---------- detect Core / Theme by collection name ---------- */
const coreCol = collections.find(c => /(^|[^a-z])core([^a-z]|$)/i.test(c.name));
const themeCol = collections.find(c => /(theme|lighthouse)/i.test(c.name) && c !== coreCol);

if (!coreCol || !themeCol) {
  console.error('Could not detect Core and Theme collections by name. Found:');
  collections.forEach(c => console.error('-', c.name));
  process.exit(1);
}

const CORE_PREFIX = normCollectionName(coreCol.name);          // "core"
const THEME_PREFIX = normCollectionName(themeCol.name);        // "lighthouse-theme" (example)

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

  let prefix: string;
  if (coreCol && col.id === coreCol.id) {
    prefix = CORE_PREFIX;
  } else if (themeCol && col.id === themeCol.id) {
    prefix = THEME_PREFIX;
  } else {
    console.warn(`Unknown collection ID: ${col.id}`);
    continue;
  }

  idToVar[v.id] = makeCssVarName(prefix, v.name);
  }

/** ---------- flatten a collection ---------- */
function flattenCollection(col: FigmaCollection): FlatMap {
  const prefix = col.id === coreCol!.id ? CORE_PREFIX : THEME_PREFIX;
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

const flatCore = flattenCollection(coreCol);
const flatTheme = flattenCollection(themeCol);

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

resolveCoreAliasesToRaw(flatCore, coreCol);

/** ---------- CSS scope planners (auto from mode names) ---------- */
function scopeOpenClose(collection: FigmaCollection, isTheme: boolean) {
  const defaultModeName =
    collection.modes.find(m => m.modeId === collection.defaultModeId)?.name ??
    collection.modes[0].name;

  type Scope = { open: string; close: string; modeName: string }[];
  const scopes: Scope = [];

  for (const m of collection.modes) {
    const name = m.name;
    const norm = toKebab(name);

    if (isTheme) {
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

/** ---------- CSS writers ---------- */
function writeCssByMode(
  fm: FlatMap,
  collection: FigmaCollection,
  opts: { preferAlias: boolean },
) {
  const { scopes, defaultModeName } = scopeOpenClose(collection, collection.id === themeCol!.id);
  const names = Object.keys(fm).sort();
  let css = '';

  for (const s of scopes) {
    css += s.open;
    for (const name of names) {
      const t = fm[name];
      const varName = `--${name}`;
      const val = t.valuesByMode[s.modeName];
      const fallback = t.valuesByMode[defaultModeName];

      // Always emit for default mode, or if OPTIMIZE_MODE_DIFF is false
      if (
        s.modeName === defaultModeName ||
        !OPTIMIZE_MODE_DIFF ||
        val == null ||
        val !== fallback
      ) {
        const output = val ?? fallback;
        if (opts.preferAlias && t.aliasOf && /^var\(--/.test(String(output))) {
          css += `  ${varName}: ${output};\n`;
        } else {
          css += `  ${varName}: ${output};\n`;
        }
      }
    }
    css += s.close;
  }
  return css;
}

/** ---------- emit files ---------- */
const coreCss = `/* AUTO-GENERATED: CORE */\n` + writeCssByMode(flatCore, coreCol, { preferAlias: false });
const themeCss = `/* AUTO-GENERATED: THEME */\n` + writeCssByMode(flatTheme, themeCol, { preferAlias: true });

fs.writeFileSync(path.join(OUT_DIR, 'core.flat.json'), JSON.stringify(flatCore, null, 2));
fs.writeFileSync(path.join(OUT_DIR, 'theme.flat.json'), JSON.stringify(flatTheme, null, 2));
fs.writeFileSync(path.join(OUT_DIR, 'core.css'), coreCss);
fs.writeFileSync(path.join(OUT_DIR, 'theme.css'), themeCss);
fs.writeFileSync(path.join(OUT_DIR, 'tokens.css'), `${coreCss}\n${themeCss}`);

console.log('[tokens] Wrote:');
console.log('-', path.join(OUT_DIR, 'core.css'));
console.log('-', path.join(OUT_DIR, 'theme.css'));
console.log('-', path.join(OUT_DIR, 'tokens.css'));
console.log('-', path.join(OUT_DIR, 'core.flat.json'));
console.log('-', path.join(OUT_DIR, 'theme.flat.json'));