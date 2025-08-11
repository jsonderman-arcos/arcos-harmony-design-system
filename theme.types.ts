/**
 * MUI Theme Types
 * Generated on 8/11/2025, 6:52:20 PM
 */
import { Theme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface CustomTheme extends Theme {
    status?: {
      danger?: string;
    };
  }
  
  interface CustomThemeOptions extends ThemeOptions {
    status?: {
      danger?: string;
    };
  }
  
  export function createTheme(options?: CustomThemeOptions): CustomTheme;
}

// Extend the palette to include custom colors
declare module '@mui/material/styles/createPalette' {
  interface Palette {
    neutral?: Palette['primary'];
  }
  
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
  }
}

// Theme configuration
export interface ThemeConfig {
  lightPalette: Record<string, any>;
  darkPalette: Record<string, any>;
  typography: Record<string, any>;
  spacing: string;
  shape: Record<string, any>;
}