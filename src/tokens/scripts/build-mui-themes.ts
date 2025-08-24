import fs from 'fs';
import path from 'path';
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { createTokenUtils } from './lib/tokenUtils';

const OUTPUT_DIR = path.resolve(__dirname, '../../theme');
const OUTPUT_FILE = path.resolve(OUTPUT_DIR, 'mui-theme.json');
const OUTPUT_THEME_TS = path.resolve(__dirname, '../../theme/mui-theme.ts');
const OVERRIDES_DIR = path.resolve(__dirname, './overrides');

/** Auto-load all component override factories from ./overrides
 *  An override file should export one or more functions named like `MuiButton`, `MuiChip`, etc.
 *  Each function receives the token utils `t` and returns a valid MUI component override object.
 */
function loadOverrides(t: ReturnType<typeof createTokenUtils>): Record<string, unknown> {
  const components: Record<string, unknown> = {};
  if (!fs.existsSync(OVERRIDES_DIR)) return components;

  const files = fs.readdirSync(OVERRIDES_DIR).filter(f => /\.(ts|js|mjs|cjs)$/.test(f));
  for (const file of files) {
    const full = path.resolve(OVERRIDES_DIR, file);
    // Support both ESM transpiled outputs and ts-node require
    let mod: any;
    try {
      mod = require(full);
    } catch {
      // Fall back to dynamic import for ESM if needed
      try {
        mod = require(full.replace(/\.(ts|mjs)$/, '.js'));
      } catch {
        continue;
      }
    }

    // Named exports starting with "Mui"
    Object.keys(mod).forEach((key) => {
      const exp = mod[key];
      if (typeof exp === 'function' && /^Mui[A-Z]/.test(key)) {
        try {
          components[key] = exp(t);
        } catch (e) {
          console.warn(`Failed to build override for ${key} from ${file}:`, e);
        }
      }
    });

    // Default export support: either a function returning { MuiX: {...} } or a map of factories
    if (mod && typeof mod.default === 'function') {
      try {
        const out = mod.default(t);
        if (out && typeof out === 'object') {
          Object.entries(out).forEach(([k, v]) => {
            if (/^Mui[A-Z]/.test(k)) components[k] = v;
          });
        }
      } catch {
        // ignore bad default export
      }
    } else if (mod && mod.default && typeof mod.default === 'object') {
      Object.entries(mod.default).forEach(([k, v]: [string, any]) => {
        if (typeof v === 'function') {
          try {
            components[k] = v(t);
          } catch (e) {
            console.warn(`Failed to build override for ${k} (default map) from ${file}:`, e);
          }
        } else if (/^Mui[A-Z]/.test(k)) {
          components[k] = v;
        }
      });
    }
  }

  return components;
}

function loadTokens(fileName: string): Record<string, string> {
  const fullPath = path.resolve("./src/theme", fileName);
  /* console.log('SourceFile')
  console.log(fullPath) */
  return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
}

function isValidMuiColor(value: string | undefined | null): boolean {
  if (!value || typeof value !== 'string') return false;
  // Accept hex, rgb(a), hsl(a) and color names
  // Hex: #RRGGBB or #RGB or #RRGGBBAA
  if (/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value)) return true;
  // rgba() or rgb()
  if (/^rgba?\((\s*\d+\s*,){2,3}\s*[\d.]+\s*\)$/i.test(value)) return true;
  // hsla() or hsl()
  if (/^hsla?\((\s*\d+\s*,){2,3}\s*[\d.]+\s*\)$/i.test(value)) return true;
  // Basic color names (very basic fallback)
  if (/^[a-z]+$/i.test(value)) return true;
  return false;
}

function buildMuiTheme(tokens: Record<string, string>): ThemeOptions {
  const  t  = createTokenUtils(tokens);
  // Polyfill missing helpers if createTokenUtils doesn't provide them yet
  const anyT: any = t as any;
  if (typeof anyT.primaryFocusRing !== 'function') {
    anyT.primaryFocusRing = () =>
      (typeof anyT.focusRing === 'function' && anyT.focusRing()) ||
      (typeof anyT.actionSelected === 'function' && anyT.actionSelected()) ||
      (typeof anyT.primaryMain === 'function' && anyT.primaryMain()) ||
      'rgba(0, 0, 0, 0.6)';
  }
  if (typeof anyT.focusRing !== 'function') {
    anyT.focusRing = () =>
      (typeof anyT.actionSelected === 'function' && anyT.actionSelected()) ||
      (typeof anyT.primaryMain === 'function' && anyT.primaryMain()) ||
      'rgba(0, 0, 0, 0.6)';
  }
  if (typeof anyT.borderSize !== 'number' || Number.isNaN(anyT.borderSize)) {
    anyT.borderSize = Number(
      tokens['lighthouse--theme-base-border-size.default'] ??
        tokens['lighthouse--theme-base-border-size-default'] ??
        1
    );
  }
  //console.log('Available token keys:', Object.keys(tokens));
  //console.log('Primary main color token:', t.primaryMain());

  // Default color fallbacks
  const DEFAULTS = {
    main: 'rgba(0,0,0,1)',
    contrastText: '#fff',
    secondaryMain: 'rgba(30,136,229,1)',
    surface: '#fff',
    surfaceRaised: '#f5f5f5',
    textPrimary: 'rgba(0,0,0,0.87)',
    textSecondary: 'rgba(0,0,0,0.6)',
    textDisabled: 'rgba(0,0,0,0.38)',
    divider: 'rgba(0,0,0,0.12)',
    actionHover: 'rgba(0,0,0,0.04)',
    actionSelected: 'rgba(0,0,0,0.08)',
    actionDisabled: 'rgba(0,0,0,0.26)',
    actionDisabledBg: 'rgba(0,0,0,0.12)',
  };

  // Gather all palette values with fallback and validation
  const palette = {
    mode: 'light' as const,
    primary: {
      main: isValidMuiColor(t.primaryMain()) ? t.primaryMain() : DEFAULTS.main,
      contrastText: isValidMuiColor(t.onPrimary()) ? t.onPrimary() : DEFAULTS.contrastText,
    },
    secondary: {
      main: isValidMuiColor(t.secondaryMain()) ? t.secondaryMain() : DEFAULTS.secondaryMain,
    },
    background: {
      default: isValidMuiColor(t.surface()) ? t.surface() : DEFAULTS.surface,
      paper: isValidMuiColor(t.surfaceRaised()) ? t.surfaceRaised() : DEFAULTS.surfaceRaised,
    },
    text: {
      primary: isValidMuiColor(t.textPrimary()) ? t.textPrimary() : DEFAULTS.textPrimary,
      secondary: isValidMuiColor(t.textSecondary()) ? t.textSecondary() : DEFAULTS.textSecondary,
      disabled: isValidMuiColor(t.textDisabled()) ? t.textDisabled() : DEFAULTS.textDisabled,
    },
    divider: isValidMuiColor(t.divider()) ? t.divider() : DEFAULTS.divider,
    action: {
      hover: isValidMuiColor(t.actionHover()) ? t.actionHover() : DEFAULTS.actionHover,
      selected: isValidMuiColor(t.actionSelected()) ? t.actionSelected() : DEFAULTS.actionSelected,
      disabled: isValidMuiColor(t.actionDisabled()) ? t.actionDisabled() : DEFAULTS.actionDisabled,
      disabledBackground: isValidMuiColor(t.actionDisabledBg()) ? t.actionDisabledBg() : DEFAULTS.actionDisabledBg,
    },
  };

  // Validation step: ensure all required palette color values are present and valid
  const requiredColors = [
    palette.primary.main,
    palette.primary.contrastText,
    palette.secondary.main,
    palette.background.default,
    palette.background.paper,
    palette.text.primary,
    palette.text.secondary,
    palette.text.disabled,
    palette.divider,
    palette.action.hover,
    palette.action.selected,
    palette.action.disabled,
    palette.action.disabledBackground,
  ];
  for (const color of requiredColors) {
    if (!isValidMuiColor(color)) {
      throw new Error(`Invalid or missing MUI palette color value: ${color}`);
    }
  }

  return {
    palette,
    shape: {
      borderRadius: t.radius,
    },
    components: {
      ...loadOverrides(t),
    },
  };
}

function main() {
  const coreTokens = loadTokens('core.muiflat.json');
  const themeTokens = loadTokens('theme.muiflat.json');

  const themeOptions = buildMuiTheme({ ...coreTokens, ...themeTokens });
  const muiTheme = createTheme(themeOptions);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  // 1) Raw ThemeOptions JSON (optional, useful for debugging)
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(themeOptions, null, 2));
  // 2) A consumable TS module exporting a Theme for ThemeProvider
  const banner = `/* Auto-generated by build-mui-themes.ts — do not edit by hand */`;
  const tsModule = `${banner}
import { createTheme, ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = ${JSON.stringify(themeOptions, null, 2)};
const theme = createTheme(themeOptions);
export default theme;
`;
  fs.writeFileSync(OUTPUT_THEME_TS, tsModule);

  console.log(`Wrote ThemeOptions JSON → ${OUTPUT_FILE}`);
  console.log(`Wrote ready-to-import MUI theme → ${OUTPUT_THEME_TS}`);
}

main();