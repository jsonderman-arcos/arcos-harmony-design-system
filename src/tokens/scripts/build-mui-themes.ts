import fs from 'fs';
import path from 'path';
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { createTokenUtils } from './lib/tokenUtils';
import {MuiButton} from './overrides/Button';

const OUTPUT_DIR = path.resolve(__dirname, '../outputs');
const OUTPUT_FILE = path.resolve(OUTPUT_DIR, 'mui-theme.json');

function loadTokens(fileName: string): Record<string, string> {
  const fullPath = path.resolve(OUTPUT_DIR, fileName);
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
  const { t } = createTokenUtils(tokens);
  console.log('Available token keys:', Object.keys(tokens));
  console.log('Primary main color token:', t.primaryMain());
  console.log('On primary color token:', t.onPrimary());
  console.log('Secondary main color token:', t.secondaryMain());
  console.log('Surface color token:', t.surface());
  console.log('Surface raised color token:', t.surfaceRaised());
  console.log('Text primary color token:', t.textPrimary());
  console.log('Text secondary color token:', t.textSecondary());
  console.log('Text disabled color token:', t.textDisabled());
  console.log('Divider color token:', t.divider());
  console.log('Action hover color token:', t.actionHover());
  console.log('Action selected color token:', t.actionSelected());
  console.log('Action disabled color token:', t.actionDisabled());
  console.log('Action disabled background color token:', t.actionDisabledBg());

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
      MuiButton: MuiButton(t),
    },
  };
}

function main() {
  const coreTokens = loadTokens('core.muiflat.json');
  const themeTokens = loadTokens('theme.muiflat.json');

  const themeOptions = buildMuiTheme({ ...coreTokens, ...themeTokens });
  const muiTheme = createTheme(themeOptions);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(muiTheme, null, 2));
  console.log(`MUI theme written to ${OUTPUT_FILE}`);
}

main();