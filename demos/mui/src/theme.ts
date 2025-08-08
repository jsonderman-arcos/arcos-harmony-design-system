import { createTheme } from '@mui/material/styles';

// Define available theme modes
type ThemeMode = 'light' | 'dark';

// Create a simple theme with sensible defaults
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Available theme modes
const availableThemeModes = ['light', 'dark'];

// Function to set theme mode
export const setThemeMode = (mode: string) => {
  return createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode: (mode === 'dark' ? 'dark' : 'light') as 'light' | 'dark',
    },
  });
};

// Function to get available theme modes
export const getAvailableThemeModes = () => {
  return availableThemeModes;
};

export default theme;