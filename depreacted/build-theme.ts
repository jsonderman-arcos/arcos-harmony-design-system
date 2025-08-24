// tokens/scripts/build-theme.ts
import fs from 'node:fs';
import path from 'node:path';
import { flattenFigmaVariables } from './lib/flatten';
import { writeCssByMode } from './lib/cssWriter';
import { buildAliasGraph, validateAliases } from './lib/aliasGraph';

const inTheme = path.resolve('tokens/inputs/theme.tokens.json');
const outThemeCss  = path.resolve('tokens/outputs/theme.css');
const outThemeFlat = path.resolve('tokens/outputs/theme.flat.json');
const mergedOutCss = path.resolve('tokens/outputs/tokens.css');
const coreCss  = path.resolve('tokens/outputs/core.css');
const coreFlat = path.resolve('tokens/outputs/core.flat.json');

// 1) Load Theme (or fetch via API if you prefer)
const themeRaw = JSON.parse(fs.readFileSync(inTheme, 'utf8'));
const themeFlat = flattenFigmaVariables(themeRaw, {
  prefix: 'lighthouse',      // example: your Theme collection name
  convertColor: true,
  keepAliases: true          // preserve VARIABLE_ALIAS as aliasOf: '--core-...'
});

// 2) Load Core flat for cross-collection alias validation
const coreFlatJson = JSON.parse(fs.readFileSync(coreFlat,'utf8'));

// 3) Build alias graph and validate
const graph = buildAliasGraph(themeFlat, coreFlatJson);
const { warnings, errors } = validateAliases(graph, {
  ensureAllModesExist: true, // warn if alias target missing in some Theme modes
  fallbackMode: 'default'    // use default when specific mode missing
});
warnings.forEach(w => console.warn('[theme][warn]', w));
if (errors.length) {
  errors.forEach(e => console.error('[theme][error]', e));
  process.exit(1);
}

// 4) Emit Theme CSS per mode (example: light/dark/mobile)
const themeScopes = {
  light: {  open: ':root {\n',                close: '}\n' },
  dark:  {  open: '[data-theme="dark"] {\n',  close: '}\n' },
  mobile:{  open: '[data-density="mobile"] {\n', close: '}\n' }
};

const css = writeCssByMode(themeFlat, themeScopes, {
  preferAlias: true,             // emit var(--target) when aliasOf is present
  crossCollection: coreFlatJson  // so we can format alias names consistently
});

// 5) Write files and merge with Core
fs.writeFileSync(outThemeCss, `/* AUTO-GENERATED */\n${css}`);
fs.writeFileSync(outThemeFlat, JSON.stringify(themeFlat, null, 2));

const merged = [
  fs.existsSync(coreCss) ? fs.readFileSync(coreCss,'utf8') : '',
  fs.readFileSync(outThemeCss,'utf8')
].join('\n');

fs.writeFileSync(mergedOutCss, merged);
console.log('[theme] built theme.css and merged tokens.css');