/**
 * Auto-generated Material UI theme.
 * Generated on: 8/11/2025
 */

import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { createContext, useState, useMemo, useContext } from 'react';
import type { Theme, ThemeMode, ThemeProviderProps, ThemesByMode } from './theme.types';

// Theme configurations for each mode
const themeConfigs = {
  light: {
  "palette": {
    "mode": "light",
    "common": {
      "black": "#000",
      "white": "#fff"
    },
    "primary": {
      "main": "#1976d2",
      "light": "#42a5f5",
      "dark": "#1565c0",
      "contrastText": "#fff"
    },
    "secondary": {
      "main": "#9c27b0",
      "light": "#ba68c8",
      "dark": "#7b1fa2",
      "contrastText": "#fff"
    },
    "error": {
      "main": "#d32f2f",
      "light": "#ef5350",
      "dark": "#c62828",
      "contrastText": "#fff"
    },
    "warning": {
      "main": "#ed6c02",
      "light": "#ff9800",
      "dark": "#e65100",
      "contrastText": "#fff"
    },
    "info": {
      "main": "#0288d1",
      "light": "#03a9f4",
      "dark": "#01579b",
      "contrastText": "#fff"
    },
    "success": {
      "main": "#2e7d32",
      "light": "#4caf50",
      "dark": "#1b5e20",
      "contrastText": "#fff"
    },
    "grey": {
      "50": "#fafafa",
      "100": "#f5f5f5",
      "200": "#eeeeee",
      "300": "#e0e0e0",
      "400": "#bdbdbd",
      "500": "#9e9e9e",
      "600": "#757575",
      "700": "#616161",
      "800": "#424242",
      "900": "#212121",
      "A100": "#f5f5f5",
      "A200": "#eeeeee",
      "A400": "#bdbdbd",
      "A700": "#616161"
    },
    "text": {
      "primary": "rgba(0, 0, 0, 0.87)",
      "secondary": "rgba(0, 0, 0, 0.6)",
      "disabled": "rgba(0, 0, 0, 0.38)"
    },
    "divider": "rgba(0, 0, 0, 0.12)",
    "background": {
      "paper": "#fff",
      "default": "#fff"
    },
    "action": {
      "active": "rgba(0, 0, 0, 0.54)",
      "hover": "rgba(0, 0, 0, 0.04)",
      "selected": "rgba(0, 0, 0, 0.08)",
      "disabled": "rgba(0, 0, 0, 0.26)",
      "disabledBackground": "rgba(0, 0, 0, 0.12)",
      "focus": "rgba(0, 0, 0, 0.12)"
    }
  },
  "typography": {
    "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500,
    "fontWeightBold": 700,
    "h1": {
      "fontWeight": 300,
      "fontSize": "6rem",
      "lineHeight": 1.167
    },
    "h2": {
      "fontWeight": 300,
      "fontSize": "3.75rem",
      "lineHeight": 1.2
    },
    "h3": {
      "fontWeight": 400,
      "fontSize": "3rem",
      "lineHeight": 1.167
    },
    "h4": {
      "fontWeight": 400,
      "fontSize": "2.125rem",
      "lineHeight": 1.235
    },
    "h5": {
      "fontWeight": 400,
      "fontSize": "1.5rem",
      "lineHeight": 1.334
    },
    "h6": {
      "fontWeight": 500,
      "fontSize": "1.25rem",
      "lineHeight": 1.6
    }
  },
  "breakpoints": {
    "values": {
      "xs": 0,
      "sm": 600,
      "md": 900,
      "lg": 1200,
      "xl": 1536
    }
  },
  "shape": {
    "borderRadius": 4
  }
},
  
  dark: {
  "palette": {
    "mode": "dark",
    "common": {
      "black": "#000",
      "white": "#fff"
    },
    "primary": {
      "main": "#1976d2",
      "light": "#42a5f5",
      "dark": "#1565c0",
      "contrastText": "#fff"
    },
    "secondary": {
      "main": "#9c27b0",
      "light": "#ba68c8",
      "dark": "#7b1fa2",
      "contrastText": "#fff"
    },
    "error": {
      "main": "#d32f2f",
      "light": "#ef5350",
      "dark": "#c62828",
      "contrastText": "#fff"
    },
    "warning": {
      "main": "#ed6c02",
      "light": "#ff9800",
      "dark": "#e65100",
      "contrastText": "#fff"
    },
    "info": {
      "main": "#0288d1",
      "light": "#03a9f4",
      "dark": "#01579b",
      "contrastText": "#fff"
    },
    "success": {
      "main": "#2e7d32",
      "light": "#4caf50",
      "dark": "#1b5e20",
      "contrastText": "#fff"
    },
    "grey": {
      "50": "#fafafa",
      "100": "#f5f5f5",
      "200": "#eeeeee",
      "300": "#e0e0e0",
      "400": "#bdbdbd",
      "500": "#9e9e9e",
      "600": "#757575",
      "700": "#616161",
      "800": "#424242",
      "900": "#212121",
      "A100": "#f5f5f5",
      "A200": "#eeeeee",
      "A400": "#bdbdbd",
      "A700": "#616161"
    },
    "text": {
      "primary": "rgba(0, 0, 0, 0.87)",
      "secondary": "rgba(0, 0, 0, 0.6)",
      "disabled": "rgba(0, 0, 0, 0.38)"
    },
    "divider": "rgba(0, 0, 0, 0.12)",
    "background": {
      "paper": "#fff",
      "default": "#fff"
    },
    "action": {
      "active": "rgba(0, 0, 0, 0.54)",
      "hover": "rgba(0, 0, 0, 0.04)",
      "selected": "rgba(0, 0, 0, 0.08)",
      "disabled": "rgba(0, 0, 0, 0.26)",
      "disabledBackground": "rgba(0, 0, 0, 0.12)",
      "focus": "rgba(0, 0, 0, 0.12)"
    }
  },
  "typography": {
    "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500,
    "fontWeightBold": 700,
    "h1": {
      "fontWeight": 300,
      "fontSize": "6rem",
      "lineHeight": 1.167
    },
    "h2": {
      "fontWeight": 300,
      "fontSize": "3.75rem",
      "lineHeight": 1.2
    },
    "h3": {
      "fontWeight": 400,
      "fontSize": "3rem",
      "lineHeight": 1.167
    },
    "h4": {
      "fontWeight": 400,
      "fontSize": "2.125rem",
      "lineHeight": 1.235
    },
    "h5": {
      "fontWeight": 400,
      "fontSize": "1.5rem",
      "lineHeight": 1.334
    },
    "h6": {
      "fontWeight": 500,
      "fontSize": "1.25rem",
      "lineHeight": 1.6
    }
  },
  "breakpoints": {
    "values": {
      "xs": 0,
      "sm": 600,
      "md": 900,
      "lg": 1200,
      "xl": 1536
    }
  },
  "shape": {
    "borderRadius": 4
  }
},
  
  mobile: {
  "palette": {
    "mode": "light",
    "common": {
      "black": "#000",
      "white": "#fff"
    },
    "primary": {
      "main": "#1976d2",
      "light": "#42a5f5",
      "dark": "#1565c0",
      "contrastText": "#fff"
    },
    "secondary": {
      "main": "#9c27b0",
      "light": "#ba68c8",
      "dark": "#7b1fa2",
      "contrastText": "#fff"
    },
    "error": {
      "main": "#d32f2f",
      "light": "#ef5350",
      "dark": "#c62828",
      "contrastText": "#fff"
    },
    "warning": {
      "main": "#ed6c02",
      "light": "#ff9800",
      "dark": "#e65100",
      "contrastText": "#fff"
    },
    "info": {
      "main": "#0288d1",
      "light": "#03a9f4",
      "dark": "#01579b",
      "contrastText": "#fff"
    },
    "success": {
      "main": "#2e7d32",
      "light": "#4caf50",
      "dark": "#1b5e20",
      "contrastText": "#fff"
    },
    "grey": {
      "50": "#fafafa",
      "100": "#f5f5f5",
      "200": "#eeeeee",
      "300": "#e0e0e0",
      "400": "#bdbdbd",
      "500": "#9e9e9e",
      "600": "#757575",
      "700": "#616161",
      "800": "#424242",
      "900": "#212121",
      "A100": "#f5f5f5",
      "A200": "#eeeeee",
      "A400": "#bdbdbd",
      "A700": "#616161"
    },
    "text": {
      "primary": "rgba(0, 0, 0, 0.87)",
      "secondary": "rgba(0, 0, 0, 0.6)",
      "disabled": "rgba(0, 0, 0, 0.38)"
    },
    "divider": "rgba(0, 0, 0, 0.12)",
    "background": {
      "paper": "#fff",
      "default": "#fff"
    },
    "action": {
      "active": "rgba(0, 0, 0, 0.54)",
      "hover": "rgba(0, 0, 0, 0.04)",
      "selected": "rgba(0, 0, 0, 0.08)",
      "disabled": "rgba(0, 0, 0, 0.26)",
      "disabledBackground": "rgba(0, 0, 0, 0.12)",
      "focus": "rgba(0, 0, 0, 0.12)"
    }
  },
  "typography": {
    "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500,
    "fontWeightBold": 700,
    "h1": {
      "fontWeight": 300,
      "fontSize": "6rem",
      "lineHeight": 1.167
    },
    "h2": {
      "fontWeight": 300,
      "fontSize": "3.75rem",
      "lineHeight": 1.2
    },
    "h3": {
      "fontWeight": 400,
      "fontSize": "3rem",
      "lineHeight": 1.167
    },
    "h4": {
      "fontWeight": 400,
      "fontSize": "2.125rem",
      "lineHeight": 1.235
    },
    "h5": {
      "fontWeight": 400,
      "fontSize": "1.5rem",
      "lineHeight": 1.334
    },
    "h6": {
      "fontWeight": 500,
      "fontSize": "1.25rem",
      "lineHeight": 1.6
    }
  },
  "breakpoints": {
    "values": {
      "xs": 0,
      "sm": 600,
      "md": 900,
      "lg": 1200,
      "xl": 1536
    }
  },
  "shape": {
    "borderRadius": 4
  }
},
  
  largeScreen: {
  "palette": {
    "mode": "light",
    "common": {
      "black": "#000",
      "white": "#fff"
    },
    "primary": {
      "main": "#1976d2",
      "light": "#42a5f5",
      "dark": "#1565c0",
      "contrastText": "#fff"
    },
    "secondary": {
      "main": "#9c27b0",
      "light": "#ba68c8",
      "dark": "#7b1fa2",
      "contrastText": "#fff"
    },
    "error": {
      "main": "#d32f2f",
      "light": "#ef5350",
      "dark": "#c62828",
      "contrastText": "#fff"
    },
    "warning": {
      "main": "#ed6c02",
      "light": "#ff9800",
      "dark": "#e65100",
      "contrastText": "#fff"
    },
    "info": {
      "main": "#0288d1",
      "light": "#03a9f4",
      "dark": "#01579b",
      "contrastText": "#fff"
    },
    "success": {
      "main": "#2e7d32",
      "light": "#4caf50",
      "dark": "#1b5e20",
      "contrastText": "#fff"
    },
    "grey": {
      "50": "#fafafa",
      "100": "#f5f5f5",
      "200": "#eeeeee",
      "300": "#e0e0e0",
      "400": "#bdbdbd",
      "500": "#9e9e9e",
      "600": "#757575",
      "700": "#616161",
      "800": "#424242",
      "900": "#212121",
      "A100": "#f5f5f5",
      "A200": "#eeeeee",
      "A400": "#bdbdbd",
      "A700": "#616161"
    },
    "text": {
      "primary": "rgba(0, 0, 0, 0.87)",
      "secondary": "rgba(0, 0, 0, 0.6)",
      "disabled": "rgba(0, 0, 0, 0.38)"
    },
    "divider": "rgba(0, 0, 0, 0.12)",
    "background": {
      "paper": "#fff",
      "default": "#fff"
    },
    "action": {
      "active": "rgba(0, 0, 0, 0.54)",
      "hover": "rgba(0, 0, 0, 0.04)",
      "selected": "rgba(0, 0, 0, 0.08)",
      "disabled": "rgba(0, 0, 0, 0.26)",
      "disabledBackground": "rgba(0, 0, 0, 0.12)",
      "focus": "rgba(0, 0, 0, 0.12)"
    }
  },
  "typography": {
    "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500,
    "fontWeightBold": 700,
    "h1": {
      "fontWeight": 300,
      "fontSize": "6rem",
      "lineHeight": 1.167
    },
    "h2": {
      "fontWeight": 300,
      "fontSize": "3.75rem",
      "lineHeight": 1.2
    },
    "h3": {
      "fontWeight": 400,
      "fontSize": "3rem",
      "lineHeight": 1.167
    },
    "h4": {
      "fontWeight": 400,
      "fontSize": "2.125rem",
      "lineHeight": 1.235
    },
    "h5": {
      "fontWeight": 400,
      "fontSize": "1.5rem",
      "lineHeight": 1.334
    },
    "h6": {
      "fontWeight": 500,
      "fontSize": "1.25rem",
      "lineHeight": 1.6
    }
  },
  "breakpoints": {
    "values": {
      "xs": 0,
      "sm": 600,
      "md": 900,
      "lg": 1200,
      "xl": 1536
    }
  },
  "shape": {
    "borderRadius": 4
  }
}
};

// Create the actual themes
export const themes: ThemesByMode = {
  light: createTheme(themeConfigs.light),
  dark: createTheme(themeConfigs.dark),
  mobile: createTheme(themeConfigs.mobile),
  largeScreen: createTheme(themeConfigs.largeScreen)
};

// Create context for theme mode
const ThemeModeContext = createContext<{
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}>({
  mode: 'light',
  setMode: () => {}
});

// Create a custom theme provider
export function ThemeProvider({ mode = 'light', children }: ThemeProviderProps) {
  const [currentMode, setCurrentMode] = useState<ThemeMode>(mode);
  
  const themeContextValue = useMemo(() => ({
    mode: currentMode,
    setMode: (newMode: ThemeMode) => setCurrentMode(newMode)
  }), [currentMode]);
  
  const theme = useMemo(() => themes[currentMode] || themes.light, [currentMode]);
  
  return (
    <ThemeModeContext.Provider value={themeContextValue}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeModeContext.Provider>
  );
}

// Custom hook to use the theme mode
export function useThemeMode() {
  return useContext(ThemeModeContext);
}

// Export the default theme (light mode)
export default themes.light;

// Helper function to resolve token references at runtime
export function resolveTokenValue(value) {
  if (typeof value !== 'string' || !value.startsWith('{') || !value.endsWith('}')) {
    return value;
  }
  
  const path = value.substring(1, value.length - 1).split('.');
  let result = themes.light;
  
  for (const part of path) {
    if (!result[part]) return value; // Return original if path not found
    result = result[part];
  }
  
  return result;
}
