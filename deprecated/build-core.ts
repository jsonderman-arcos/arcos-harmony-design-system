// tokens/scripts/build-core.ts
import fs from 'node:fs';
import path from 'node:path';
import { flattenFigmaVariables } from './lib/flatten';
import { writeCssByMode } from './lib/cssWriter';
import { fileHash } from './lib/hash';

const inFile  = path.resolve('tokens/inputs/core.tokens.json');
const outCss  = path.resolve('tokens/outputs/core.css');
const outFlat = path.resolve('tokens/outputs/core.flat.json');
const outHash = path.resolve('tokens/outputs/core.hash');

// 1) Skip if unchanged
const hash = fileHash(inFile);
if (fs.existsSync(outHash) && fs.readFileSync(outHash,'utf8') === hash) {
  console.log('[core] no changes, skipping');
  process.exit(0);
}

// 2) Load & flatten
const raw = JSON.parse(fs.readFileSync(inFile, 'utf8'));
const flat = flattenFigmaVariables(raw, {
  // prefix and kebab-case strategy for Core
  prefix: 'core',
  // convert Figma RGBA objects → css rgba()
  convertColor: true,
  // DO NOT keep aliases here—Core should be raw primitives
  keepAliases: false
});

// 3) Emit CSS per mode (example mapping)
const coreScopes = {
  default: { open: ':root {\n', close: '}\n' },
  'large-screen': { open: '@media (min-width: 1024px) {\n:root {\n', close: '}\n}\n' }
};

const css = writeCssByMode(flat, coreScopes /* keep names identical across modes */);

fs.writeFileSync(outCss, `/* AUTO-GENERATED */\n${css}`);
fs.writeFileSync(outFlat, JSON.stringify(flat, null, 2));
fs.writeFileSync(outHash, hash);

console.log('[core] built tokens/outputs/core.css and core.flat.json');