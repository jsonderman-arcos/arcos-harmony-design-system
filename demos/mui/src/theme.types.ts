/**
 * MUI Theme type definitions generated from design tokens
 */
import { Theme as MuiTheme } from '@mui/material/styles';

// Extend the Material-UI Theme interface
declare module '@mui/material/styles' {
  interface Theme {
    // Add any custom theme properties here
  }
  
  interface ThemeOptions {
    // Add any custom theme option properties here
  }
}

// Export the extended theme type
export type Theme = MuiTheme;
