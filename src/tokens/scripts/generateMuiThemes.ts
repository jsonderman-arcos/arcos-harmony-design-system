import fs from 'node:fs';
import path from 'node:path';
import { ThemeOptions } from '@mui/material/styles';

// Paths
const coreCssPath = path.resolve(__dirname, '../outputs/core.css');
const themeCssPath = path.resolve(__dirname, '../outputs/theme.css');
const outPath = path.resolve(__dirname, '../outputs/muiThemeObjects.ts');

// Load CSS custom properties from files
const coreCssVars = fs.readFileSync(coreCssPath, 'utf8');
const themeCssVars = fs.readFileSync(themeCssPath, 'utf8');

// Parser to convert CSS custom properties into a flat JS object
function parseCssVars(cssContent: string): Record<string, string> {
  const tokenMap: Record<string, string> = {};
  const regex = /--([^:]+):\s*([^;]+);/g;
  let match;
  while ((match = regex.exec(cssContent))) {
    tokenMap[match[1].trim()] = match[2].trim();
  }
  return tokenMap;
}

const flattenedCore = parseCssVars(coreCssVars);
const flattenedTheme = parseCssVars(themeCssVars);

// Helper to convert kebab-case to camelCase
function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, g) => g.toUpperCase());
}

// Helper to convert camelCase to kebab-case
function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// Helper to convert token name to CSS var() reference
function toTokenVar(key: string): string {
  return `var(--${toKebabCase(key)})`;
}

// Helper to extract a numeric value from a token if it looks like a number
function resolveNumericToken(tokenValue: string): number | undefined {
  if (typeof tokenValue === 'string') {
    const match = tokenValue.match(/^(\d+)(px|rem|em)?$/);
    if (match) return parseInt(match[1], 10);
  }
  return undefined;
}

// Extract tokens by prefix, with fallback to a secondary flat token source
function extractTokens(
  flat: Record<string, string>,
  prefix: string,
  _mode: string,
  fallbackFlat?: Record<string, string>
): Record<string, string> {
  const themeVars: Record<string, string> = {};
  // Merge keys from both sources (theme and fallback/core)
  const names = new Set([
    ...Object.keys(flat),
    ...(fallbackFlat ? Object.keys(fallbackFlat) : []),
  ]);
  for (const name of names) {
    if (!name.startsWith(prefix)) continue;
    const camelName = toCamelCase(name.replace(`${prefix}-`, ''));
    // Try theme first, then fallback/core
    const themeToken = flat[name];
    const fallbackToken = fallbackFlat?.[name];
    let value: string | undefined = undefined;
    if (themeToken !== undefined) {
      value = themeToken;
    } else if (fallbackToken !== undefined) {
      value = fallbackToken;
    }
    if (value !== undefined) themeVars[camelName] = value;
  }
  return themeVars;
}

// Build a full MUI ThemeOptions object
function buildMuiTheme(
  theme: Record<string, string>,
  mode: 'light' | 'dark',
  fallback: Record<string, string>
): ThemeOptions {
  return {
    palette: {
      mode,
      common: {
        white: theme.white ? toTokenVar('white') : 'rgba(255, 255, 255, 1)',
        black: theme.black ? toTokenVar('black') : 'rgba(0, 0, 0, 1)',
        },
      primary: {
        main: theme.primary
          ? toTokenVar('primary')
          : 'rgba(25, 118, 210, 1)',
      },
      secondary: {
        main: theme.secondary
          ? toTokenVar('secondary')
          : 'rgba(156, 39, 176, 1)',
      },
      background: {
        default: theme.background
          ? toTokenVar('background')
          : mode === 'light' ? 'rgba(255, 255, 255, 1)' : 'rgba(18, 18, 18, 1)',
        paper: theme.surface
          ? toTokenVar('surface')
          : mode === 'light' ? 'rgba(255, 255, 255, 1)' : 'rgba(29, 29, 29, 1)',
      },
      text: {
        primary: theme.textPrimary
          ? toTokenVar('textPrimary')
          : mode === 'light' ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)',
        secondary: theme.textSecondary
          ? toTokenVar('textSecondary')
          : mode === 'light' ? 'rgba(102, 102, 102, 1)' : 'rgba(170, 170, 170, 1)',
      },
    },
    typography: {
      fontFamily: theme.fontFamily
        ? toTokenVar('fontFamily')
        : fallback.fontFamily
          ? toTokenVar('fontFamily')
          : '"Arial", sans-serif"',
      fontSize: resolveNumericToken(theme.fontSizeBase) ??
                resolveNumericToken(fallback.fontSizeBase) ??
                14,
      fontWeightLight: resolveNumericToken(theme.fontWeightLight) ??
                       resolveNumericToken(fallback.fontWeightLight) ??
                       300,
      fontWeightRegular: resolveNumericToken(theme.fontWeightRegular) ??
                         resolveNumericToken(fallback.fontWeightRegular) ??
                         400,
      fontWeightMedium: resolveNumericToken(theme.fontWeightMedium) ??
                        resolveNumericToken(fallback.fontWeightMedium) ??
                        500,
      h1: { fontSize: theme.fontSizeH1 ? toTokenVar('fontSizeH1') : '6rem' },
      h2: { fontSize: theme.fontSizeH2 ? toTokenVar('fontSizeH2') : '3.75rem' },
      h3: { fontSize: theme.fontSizeH3 ? toTokenVar('fontSizeH3') : '3rem' },
      h4: { fontSize: theme.fontSizeH4 ? toTokenVar('fontSizeH4') : '2.125rem' },
      h5: { fontSize: theme.fontSizeH5 ? toTokenVar('fontSizeH5') : '1.5rem' },
      h6: { fontSize: theme.fontSizeH6 ? toTokenVar('fontSizeH6') : '1.25rem' },
    },
    shape: {
      borderRadius: theme.borderRadiusSm
        ? toTokenVar('borderRadiusSm')
        : fallback.borderRadiusSm
          ? toTokenVar('borderRadiusSm')
          : resolveNumericToken(fallback.borderRadiusSm ?? '4') ?? 4,
    },
    spacing: theme.spacingBase
      ? toTokenVar('spacingBase')
      : fallback.spacingBase
        ? toTokenVar('spacingBase')
        : resolveNumericToken(fallback.spacingBase ?? '8') ?? 8,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: theme.componentButtonBg
              ? toTokenVar('componentButtonBg')
              : 'rgba(242, 103, 36, 1)',
            color: theme.componentButtonFg
              ? toTokenVar('componentButtonFg')
              : '#ffffff',
            borderRadius: theme.borderRadiusSm
              ? toTokenVar('borderRadiusSm')
              : '4px',
            '&:hover': {
              backgroundColor: theme.componentButtonBgHover
                ? toTokenVar('componentButtonBgHover')
                : 'rgba(245, 130, 72, 1)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: theme.borderRadiusMd
              ? toTokenVar('borderRadiusMd')
              : '8px',
            backgroundColor: theme.cardBackground
              ? toTokenVar('cardBackground')
              : mode === 'light' ? 'rgba(255, 255, 255, 1)' : 'rgba(29, 29, 29, 1)',
          },
        },
      },
    },
  };
}

// Process tokens (use core as fallback)
const lightTokens = extractTokens(flattenedTheme, 'lighthouse-theme', 'Light', flattenedCore);
const darkTokens = extractTokens(flattenedTheme, 'lighthouse-theme', 'Dark', flattenedCore);

const muiThemeLight = buildMuiTheme(lightTokens, 'light', flattenedCore);
// For dark, merge dark tokens over light tokens (both with core fallback)
const muiThemeDark = buildMuiTheme({ ...lightTokens, ...darkTokens }, 'dark', flattenedCore);

// Write to output file
const outContent = `/* AUTO-GENERATED MUI THEMES */

import { ThemeOptions } from '@mui/material/styles';

export const muiThemeLight: ThemeOptions = ${JSON.stringify(muiThemeLight, null, 2)};

export const muiThemeDark: ThemeOptions = ${JSON.stringify(muiThemeDark, null, 2)};
`;

fs.writeFileSync(outPath, outContent);
console.log('[themes] Wrote muiThemeObjects.ts');