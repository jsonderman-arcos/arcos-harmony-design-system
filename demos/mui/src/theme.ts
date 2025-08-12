/**
 * MUI Theme
 * Generated on 8/12/2025, 2:27:06 PM
 */
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { ThemeConfig } from './theme.types';

// Export ThemeMode type for use in App.tsx
export type ThemeMode = 'light' | 'dark';

// Theme configuration
export const themeConfig: ThemeConfig = {
  "lightPalette": {
    "primary": {
      "main": "#000000",
      "light": "#4285F4",
      "dark": "#1A73E8",
      "contrastText": "#E8F0FE"
    },
    "secondary": {
      "main": "#9c27b0",
      "light": "#4DD0E1",
      "dark": "#00ACC1",
      "contrastText": "#FFFFFF"
    },
    "error": {
      "main": "#D32F2F",
      "light": "#EF5350",
      "dark": "#C62828",
      "contrastText": "#FFEBEE"
    },
    "warning": {
      "main": "#FFC107",
      "light": "#ed6c02",
      "dark": "#ed6c02",
      "contrastText": "#ed6c02"
    },
    "info": {
      "main": "#1976d2",
      "light": "#1976d2",
      "dark": "#1976d2",
      "contrastText": "#1976d2"
    },
    "success": {
      "main": "#2e7d32",
      "light": "#2e7d32",
      "dark": "#2e7d32",
      "contrastText": "#FFFFFF"
    },
    "grey": {
      "50": "#fafafa",
      "100": "rgba(0.07058823853731155, 0.07058823853731155, 0.07058823853731155, 1)",
      "200": "rgba(0.11764705926179886, 0.11764705926179886, 0.11764705926179886, 1)",
      "300": "rgba(0.13725490868091583, 0.13725490868091583, 0.13725490868091583, 1)",
      "400": "rgba(0.14509804546833038, 0.14509804546833038, 0.14509804546833038, 1)",
      "500": "rgba(0.15294118225574493, 0.15294118225574493, 0.15294118225574493, 1)",
      "600": "rgba(0.16470588743686676, 0.16470588743686676, 0.16470588743686676, 1)",
      "700": "rgba(0.1725490242242813, 0.1725490242242813, 0.1725490242242813, 1)",
      "800": "rgba(0.18039216101169586, 0.18039216101169586, 0.18039216101169586, 1)",
      "900": "rgba(0.1921568661928177, 0.1921568661928177, 0.1921568661928177, 1)",
      "910": "rgba(0.20000000298023224, 0.20000000298023224, 0.20000000298023224, 1)",
      "920": "rgba(0.21176470816135406, 0.21176470816135406, 0.21176470816135406, 1)",
      "930": "rgba(0.21960784494876862, 0.21960784494876862, 0.21960784494876862, 1)",
      "50006": "rgba(0.15294118225574493, 0.15294118225574493, 0.15294118225574493, 0.05999999865889549)",
      "50016": "rgba(0.15294118225574493, 0.15294118225574493, 0.15294118225574493, 0.1599999964237213)",
      "50030": "rgba(0.15294118225574493, 0.15294118225574493, 0.15294118225574493, 0.30000001192092896)",
      "50050": "rgba(0.15294118225574493, 0.15294118225574493, 0.15294118225574493, 0.5)"
    },
    "text": {
      "primary": "rgba(0, 0, 0, 0.87)",
      "secondary": "rgba(0, 0, 0, 0.6)",
      "disabled": "rgba(0, 0, 0, 0.38)"
    },
    "divider": "rgba(0, 0, 0, 0.12)",
    "background": {
      "paper": "#FFFFFF",
      "default": "#9e9e9e"
    },
    "action": {
      "active": "rgba(0, 0, 0, 0.56)",
      "hover": "rgba(0, 0, 0, 0.06)",
      "selected": "rgba(0, 0, 0, 0.12)",
      "disabled": "rgba(0, 0, 0, 0.38)",
      "disabledBackground": "rgba(0, 0, 0, 0.12)",
      "focus": "rgba(0, 0, 0, 0.12)"
    },
    "common": {
      "black": "#000000",
      "white": "#ffffff"
    }
  },
  "darkPalette": {
    "primary": {
      "main": "#000000",
      "light": "#1976d2",
      "dark": "#1976d2",
      "contrastText": "#1976d2"
    },
    "secondary": {
      "main": "#9c27b0",
      "light": "#2e7d32",
      "dark": "#2e7d32",
      "contrastText": "#2e7d32"
    },
    "error": {
      "main": "#d32f2f",
      "light": "#d32f2f",
      "dark": "#d32f2f",
      "contrastText": "#d32f2f"
    },
    "warning": {
      "main": "#ed6c02",
      "light": "#ed6c02",
      "dark": "#ed6c02",
      "contrastText": "#ed6c02"
    },
    "info": {
      "main": "#1976d2",
      "light": "#1976d2",
      "dark": "#1976d2",
      "contrastText": "#1976d2"
    },
    "success": {
      "main": "#2e7d32",
      "light": "#2e7d32",
      "dark": "#2e7d32",
      "contrastText": "#2e7d32"
    },
    "grey": {
      "50": "#fafafa",
      "100": "rgba(0.07058823853731155, 0.07058823853731155, 0.07058823853731155, 1)",
      "200": "rgba(0.11764705926179886, 0.11764705926179886, 0.11764705926179886, 1)",
      "300": "rgba(0.13725490868091583, 0.13725490868091583, 0.13725490868091583, 1)",
      "400": "rgba(0.14509804546833038, 0.14509804546833038, 0.14509804546833038, 1)",
      "500": "rgba(0.15294118225574493, 0.15294118225574493, 0.15294118225574493, 1)",
      "600": "rgba(0.16470588743686676, 0.16470588743686676, 0.16470588743686676, 1)",
      "700": "rgba(0.1725490242242813, 0.1725490242242813, 0.1725490242242813, 1)",
      "800": "rgba(0.18039216101169586, 0.18039216101169586, 0.18039216101169586, 1)",
      "900": "rgba(0.1921568661928177, 0.1921568661928177, 0.1921568661928177, 1)",
      "910": "rgba(0.20000000298023224, 0.20000000298023224, 0.20000000298023224, 1)",
      "920": "rgba(0.21176470816135406, 0.21176470816135406, 0.21176470816135406, 1)",
      "930": "rgba(0.21960784494876862, 0.21960784494876862, 0.21960784494876862, 1)",
      "50006": "rgba(0.15294118225574493, 0.15294118225574493, 0.15294118225574493, 0.05999999865889549)",
      "50016": "rgba(0.15294118225574493, 0.15294118225574493, 0.15294118225574493, 0.1599999964237213)",
      "50030": "rgba(0.15294118225574493, 0.15294118225574493, 0.15294118225574493, 0.30000001192092896)",
      "50050": "rgba(0.15294118225574493, 0.15294118225574493, 0.15294118225574493, 0.5)"
    },
    "text": {
      "primary": "rgba(0, 0, 0, 0.87)",
      "secondary": "rgba(0, 0, 0, 0.6)",
      "disabled": "#757575"
    },
    "divider": "rgba(0, 0, 0, 0.12)",
    "background": {
      "paper": "#ffffff",
      "default": "#9e9e9e"
    },
    "action": {
      "active": "#ffffff",
      "hover": "#ffffff",
      "selected": "#ffffff",
      "disabled": "#ffffff",
      "disabledBackground": "rgba(0, 0, 0, 0.12)",
      "focus": "#ffffff"
    },
    "common": {
      "black": "#000000",
      "white": "#ffffff"
    }
  },
  "typography": {
    "fontFamily": "Arial",
    "fontSize": 14,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500,
    "fontWeightBold": 700,
    "h1": {},
    "h2": {},
    "h3": {},
    "h4": {},
    "h5": {},
    "h6": {},
    "subtitle1": {},
    "subtitle2": {},
    "body1": {},
    "body2": {},
    "button": {
      "fontSize": "#757575"
    },
    "caption": {},
    "overline": {}
  },
  "spacing": "(factor: number) => `${Math.round(factor * 8 * 10) / 10}px`",
  "shape": {
    "borderRadius": 8
  }
};

// Create the base theme with common options
const baseThemeOptions: ThemeOptions = {
  typography: themeConfig.typography,
  shape: themeConfig.shape,
  spacing: (factor: number) => `${Math.round(factor * 8 * 10) / 10}px`
};

// Create the light theme
export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: themeConfig.lightPalette,
});

// Create the dark theme
export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: themeConfig.darkPalette,
});

// Default theme (light)
const theme = lightTheme;

export default theme;

/**
 * Get all available theme modes
 * @returns Array of available theme modes
 */
export function getAvailableThemeModes(): ThemeMode[] {
  return ['light', 'dark'];
}

/**
 * Set the theme mode
 * @param mode - The theme mode to set
 * @returns The theme with the specified mode
 */
export function setThemeMode(mode: ThemeMode) {
  return mode === 'dark' ? darkTheme : lightTheme;
}