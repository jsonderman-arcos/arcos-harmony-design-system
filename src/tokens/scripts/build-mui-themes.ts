import fs from 'fs';
import path from 'path';
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { createTokenUtils } from './lib/tokenUtils';

const OUTPUT_DIR = path.resolve(__dirname, '../../theme');
const OUTPUT_FILE = path.resolve(OUTPUT_DIR, 'mui-theme.json');
const OUTPUT_THEME_TS = path.resolve(__dirname, '../../theme/mui-theme.ts');
const OVERRIDES_DIR = path.resolve(__dirname, './overrides');

// near the top of build-mui-themes.ts (or right before you create `t`)
type TokenSelectors = {
  primaryMain: () => string;
  onPrimary: () => string;
  secondaryMain: () => string;
  surface: () => string;
  surfaceRaised: () => string;
  textPrimary: () => string;
  textSecondary: () => string;
  textDisabled: () => string;
  divider: () => string;
  actionHover: () => string;
  actionSelected: () => string;
  actionDisabled: () => string;
  actionDisabledBg: () => string;
  paperBackgroundForElevation: (level: number) => string;
};

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
  const v = value.trim();
  // Accept any usage of CSS custom properties, including fallbacks and nesting
  // e.g., var(--token), var(--token, #fff), rgb(var(--token) / 0.5)
  if (/var\(/i.test(v)) return true;
  // Hex: #RGB/#RRGGBB/#RRGGBBAA/#RGBA
  if (/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)) return true;
  // rgb()/rgba()
  if (/^rgba?\((.|\s)+\)$/i.test(v)) return true;
  // hsl()/hsla()
  if (/^hsla?\((.|\s)+\)$/i.test(v)) return true;
  // Modern CSS color functions
  if (/^(oklch|oklab|lab|lch|hwb|color|color-mix)\((.|\s)+\)$/i.test(v)) return true;
  // Basic color names
  if (/^[a-z]+$/i.test(v)) return true;
  return false;
}

function buildMuiTheme(tokens: Record<string, string>): ThemeOptions {
  const t = createTokenUtils(tokens) as ReturnType<typeof createTokenUtils> & TokenSelectors & Record<string, any>;
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
  // Ensure primary/secondary helpers exist (resolve from Theme token keys)
  if (typeof anyT.primaryMain !== 'function') {
    anyT.primaryMain = () =>
      tokens['theme-base-primary-main'] ?? tokens['themeBasePrimaryMain'] ?? tokens['primaryMain'];
  }
  if (typeof anyT.onPrimary !== 'function') {
    anyT.onPrimary = () =>
      tokens['theme-base-primary-on-main'] ?? tokens['themeBasePrimaryOnMain'] ?? tokens['primaryContrastText'];
  }
  if (typeof anyT.secondaryMain !== 'function') {
    anyT.secondaryMain = () =>
      tokens['theme-base-secondary-main'] ?? tokens['themeBaseSecondaryMain'] ?? tokens['secondaryMain'];
  }
  if (typeof anyT.paperBackgroundForElevation !== 'function') {
    anyT.paperBackgroundForElevation = (level: number) =>
      (tokens[`theme-base-background-paper-elevation-${level}`] as string | undefined) ??
      (tokens[`themeBaseBackgroundPaperElevation${level}`] as string | undefined) ??
      (tokens['theme-base-surface-light-main'] as string | undefined);
  }
  //console.log('Available token keys:', Object.keys(tokens));
  console.log('Primary main color token:', t.primaryMain());

  // Default color fallbacks
  const DEFAULTS = {
    main: 'rgba(50,98,141,1)',
    primaryMain: 'rgba(50,98,141,1)',
    contrastText: 'rgba(255,255,255,1)',
    secondaryMain: 'rgba(65,94,91,1)',
    surface: 'rgba(255,255,255,1)',
    surfaceRaised: 'rgba(245,245,245,1)',
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
      main: isValidMuiColor(t.primaryMain()) ? t.primaryMain() : DEFAULTS.primaryMain,
      contrastText: isValidMuiColor(t.onPrimary()) ? t.onPrimary() : DEFAULTS.contrastText,
      ...(isValidMuiColor(tokens['theme-base-primary-light']) && { light: tokens['theme-base-primary-light'] as string }),
      ...(isValidMuiColor(tokens['theme-base-primary-dark']) && { dark: tokens['theme-base-primary-dark'] as string }),
    },
    secondary: {
      main: isValidMuiColor(t.secondaryMain()) ? t.secondaryMain() : DEFAULTS.secondaryMain,
      contrastText: isValidMuiColor(tokens['theme-base-secondary-on-main'])
        ? (tokens['theme-base-secondary-on-main'] as string)
        : DEFAULTS.contrastText,
      ...(isValidMuiColor(tokens['theme-base-secondary-light']) && { light: tokens['theme-base-secondary-light'] as string }),
      ...(isValidMuiColor(tokens['theme-base-secondary-dark']) && { dark: tokens['theme-base-secondary-dark'] as string }),
    },
    background: {
      // map to your 7-level elevation family: base (0) for app background, level-1 for Paper
      default: isValidMuiColor(t.paperBackgroundForElevation(0))
        ? t.paperBackgroundForElevation(0)
        : DEFAULTS.surface,
      paper: isValidMuiColor(t.paperBackgroundForElevation(1))
        ? t.paperBackgroundForElevation(1)
        : DEFAULTS.surfaceRaised,
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