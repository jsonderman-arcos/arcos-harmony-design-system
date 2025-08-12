import { createTheme } from '@mui/material/styles';

// Light theme configuration from your design system
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
      light: '#4285F4',
      dark: '#1A73E8',
      contrastText: '#E8F0FE',
    },
    secondary: {
      main: '#9c27b0',
      light: '#4DD0E1',
      dark: '#00ACC1',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    fontFamily: 'Arial',
    fontWeightBold: 700,
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 700,
        },
        containedPrimary: {
          backgroundColor: '#000000',
          '&:hover': {
            backgroundColor: '#1A73E8',
          },
        },
      },
    },
  },
});

// Dark theme configuration from your design system
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#000000',
      light: '#1976d2',
      dark: '#1976d2',
      contrastText: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
      light: '#4DD0E1',
      dark: '#00ACC1',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#121212', // Standard dark background
      paper: '#1e1e1e', // Standard dark paper
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
  },
  typography: {
    fontFamily: 'Arial',
    fontWeightBold: 700,
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 700,
        },
        containedPrimary: {
          backgroundColor: '#1976d2',
          color: '#1976d2',
          '&:hover': {
            backgroundColor: '#1976d2',
          },
        },
      },
    },
  },
});
