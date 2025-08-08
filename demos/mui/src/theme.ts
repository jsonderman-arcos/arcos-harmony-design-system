import { createTheme } from '@mui/material/styles';
import coreTokens from './tokens/coreTokens.json';
import darkModeTokens from './tokens/darkModeTokens.json';
import lightModeTokens from './tokens/lightModeTokens.json';
import mobileModeTokens from './tokens/mobileModeTokens.json';

// Define available theme modes
export type ThemeMode = 'dark' | 'light' | 'mobile';

// Theme tokens by mode
const themeTokensByMode: Record<ThemeMode, Record<string, any>> = {
  'dark': darkModeTokens,
  'light': lightModeTokens,
  'mobile': mobileModeTokens,
};

// Current theme mode
let currentThemeMode: ThemeMode = 'dark';

// Cache for resolved token values
const resolvedTokenCache: Record<string, unknown> = {};

// Clear the token cache when switching themes
function clearTokenCache() {
  Object.keys(resolvedTokenCache).forEach(key => {
    delete resolvedTokenCache[key];
  });
}

// Recursively resolve {token.references} in $value fields
function resolveTokenValue(path: string, visited = new Set<string>()): unknown {
  if (resolvedTokenCache[path] !== undefined) return resolvedTokenCache[path];

  const modeTokens = themeTokensByMode[currentThemeMode] || darkModeTokens;
  let value = getValueByPath(modeTokens, path) ?? getValueByPath(coreTokens, path);
  
  if (typeof value === 'object' && value && '$value' in value)
    value = (value as { $value: unknown }).$value;
  
  if (
    typeof value === 'string' &&
    value.startsWith('{') &&
    value.endsWith('}')
  ) {
    const refPath = value.slice(1, -1).replace(/\//g, '.');
    if (visited.has(refPath)) throw new Error(`Circular reference: ${refPath}`);
    visited.add(refPath);
    return resolveTokenValue(refPath, visited);
  }

  // Store in cache before returning
  resolvedTokenCache[path] = value;
  return value;
}

// Recursively get value
function getValueByPath(obj: Record<string, unknown>, path: string): unknown {
  return path
    .split('.')
    .reduce(
      (o, k) =>
        o && typeof o === 'object' && k in o
          ? (o as Record<string, unknown>)[k]
          : undefined,
      obj as unknown
    );
}

// Helper function to parse px values to numbers
function parsePxToNumber(px: string): number {
  return Number(px.replace('px', ''));
}

// Get a resolved value by token path
export function getValueByTokenName(tokenPath: string): string {
  return resolveTokenValue(tokenPath) as string;
}

// Get color values for theme
const primary = getValueByTokenName('Base.primary.main') || '#1976d2';
const secondary = getValueByTokenName('Base.secondary.main') || '#9c27b0';

// Create theme with tokens
export function getThemeByTokens() {
  return createTheme({
    palette: {
      mode: currentThemeMode === 'light' ? 'light' : 'dark',
      primary: {
        main: primary,
      },
      secondary: {
        main: secondary,
      },
    },
    typography: {
      fontFamily: getValueByTokenName('Base.typography.fontFamily') || '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  });
}

// Set theme mode function
export function setThemeMode(mode: ThemeMode) {
  // Check if the requested mode exists
  if (!themeTokensByMode[mode]) {
    console.warn(`Theme mode '${mode}' not found, falling back to dark mode`);
    mode = 'dark';
  }
  
  // Update the current mode
  currentThemeMode = mode;
  
  // Clear the token cache to ensure fresh values
  clearTokenCache();
  
  // Generate new theme with the updated mode
  const newTheme = getThemeByTokens();
  
  console.log(`Theme switched to ${mode} mode`);
  return newTheme;
}

// Get current theme mode
export function getCurrentThemeMode(): ThemeMode {
  return currentThemeMode;
}

// Get available theme modes
export function getAvailableThemeModes(): ThemeMode[] {
  return Object.keys(themeTokensByMode) as ThemeMode[];
}

// Export the default theme
export const theme = getThemeByTokens();
export default theme;