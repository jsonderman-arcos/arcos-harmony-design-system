import fs from 'node:fs';
import path from 'node:path';

// Paths
const coreJsonPath = path.resolve(__dirname, '../outputs/core.flat.json');
const themeJsonPath = path.resolve(__dirname, '../outputs/theme.flat.json');
const outPath = path.resolve(__dirname, '../outputs/muiThemeObjects.ts');

// Load flat tokens
const flatCore = JSON.parse(fs.readFileSync(coreJsonPath, 'utf8'));
const flatTheme = JSON.parse(fs.readFileSync(themeJsonPath, 'utf8'));

// Helper to convert kebab-case to camelCase
function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, g) => g.toUpperCase());
}

// Extract tokens by prefix
function extractTokens(flat: any, prefix: string, mode: string): Record<string, string> {
  const themeVars: Record<string, string> = {};
  for (const [name, token] of Object.entries<any>(flat)) {
    if (!name.startsWith(prefix)) continue;
    const camelName = toCamelCase(name.replace(`${prefix}-`, ''));
    const value = token.valuesByMode?.[mode];
    if (value) themeVars[camelName] = value;
  }
  return themeVars;
}

// Map extracted tokens to MUI theme structure (basic color palette only)
function buildMuiTheme(theme: Record<string, string>) {
  return {
    palette: {
      mode: 'light',
      primary: {
        main: theme.primary ?? '#1976d2',
      },
      secondary: {
        main: theme.secondary ?? '#9c27b0',
      },
      background: {
        default: theme.background ?? '#fff',
        paper: theme.surface ?? '#fff',
      },
      text: {
        primary: theme.textPrimary ?? '#000',
        secondary: theme.textSecondary ?? '#666',
      },
    },
  };
}

const lightTokens = extractTokens(flatTheme, 'lighthouse-theme', 'Light');
const darkTokens = extractTokens(flatTheme, 'lighthouse-theme', 'Dark');

const muiThemeLight = buildMuiTheme(lightTokens);
const muiThemeDark = buildMuiTheme({ ...lightTokens, ...darkTokens });

const outContent = `/* AUTO-GENERATED MUI THEMES */

export const muiThemeLight = ${JSON.stringify(muiThemeLight, null, 2)};

export const muiThemeDark = ${JSON.stringify(muiThemeDark, null, 2)};
`;

fs.writeFileSync(outPath, outContent);
console.log('[themes] Wrote muiThemeObjects.ts');