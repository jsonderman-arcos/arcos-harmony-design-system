/**
 * MUI Theme
 * Generated on 8/12/2025, 3:13:53 PM
 */
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { ThemeConfig } from './theme.types';

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
      "100": "rgba(18, 18, 18, 1)",
      "200": "rgba(30, 30, 30, 1)",
      "300": "rgba(35, 35, 35, 1)",
      "400": "rgba(37, 37, 37, 1)",
      "500": "rgba(39, 39, 39, 1)",
      "600": "rgba(42, 42, 42, 1)",
      "700": "rgba(44, 44, 44, 1)",
      "800": "rgba(46, 46, 46, 1)",
      "900": "rgba(49, 49, 49, 1)",
      "910": "rgba(51, 51, 51, 1)",
      "920": "rgba(54, 54, 54, 1)",
      "930": "rgba(56, 56, 56, 1)",
      "50006": "rgba(39, 39, 39, 0.06)",
      "50016": "rgba(39, 39, 39, 0.16)",
      "50030": "rgba(39, 39, 39, 0.3)",
      "50050": "rgba(39, 39, 39, 0.5)"
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
      "100": "rgba(18, 18, 18, 1)",
      "200": "rgba(30, 30, 30, 1)",
      "300": "rgba(35, 35, 35, 1)",
      "400": "rgba(37, 37, 37, 1)",
      "500": "rgba(39, 39, 39, 1)",
      "600": "rgba(42, 42, 42, 1)",
      "700": "rgba(44, 44, 44, 1)",
      "800": "rgba(46, 46, 46, 1)",
      "900": "rgba(49, 49, 49, 1)",
      "910": "rgba(51, 51, 51, 1)",
      "920": "rgba(54, 54, 54, 1)",
      "930": "rgba(56, 56, 56, 1)",
      "50006": "rgba(39, 39, 39, 0.06)",
      "50016": "rgba(39, 39, 39, 0.16)",
      "50030": "rgba(39, 39, 39, 0.3)",
      "50050": "rgba(39, 39, 39, 0.5)"
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