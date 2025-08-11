/**
 * Auto-generated theme type definitions.
 * Generated on: 8/11/2025
 */

import { Theme as MUITheme, ThemeOptions as MUIThemeOptions } from '@mui/material/styles';

export interface ExtendedPaletteOptions extends MUIThemeOptions['palette'] {
  // Add any custom palette options here
}

export interface ExtendedTypographyOptions extends MUIThemeOptions['typography'] {
  // Add any custom typography options here
}

export interface ThemeOptions extends MUIThemeOptions {
  palette?: ExtendedPaletteOptions;
  typography?: ExtendedTypographyOptions;
}

export interface Theme extends MUITheme {
  palette: ExtendedPaletteOptions;
  typography: ExtendedTypographyOptions;
}

// Add type definitions for theme modes
export type ThemeMode = 'light' | 'dark' | 'mobile' | 'largeScreen';

// Define the theme by mode structure
export interface ThemesByMode {
  light: Theme;
  dark: Theme;
  mobile?: Theme;
  largeScreen?: Theme;
}

// Define a ThemeProvider props interface
export interface ThemeProviderProps {
  mode?: ThemeMode;
  children: React.ReactNode;
}
