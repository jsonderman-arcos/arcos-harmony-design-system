import React, { useState } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  experimental_extendTheme as extendTheme 
} from '@mui/material/styles';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  CssBaseline
} from '@mui/material';
import themeConfig from '../theme.json';

// Function to create theme from theme.json
function createMuiTheme(mode = 'light') {
  // Set default colors for when theme config is missing colorSchemes
  const defaultColors = {
    light: {
      primary: {
        main: '#5916d2', 
        contrastText: '#ffffff'
      },
      secondary: {
        main: '#9c27b0', // Default MUI purple
        contrastText: '#ffffff'
      }
    },
    dark: {
      primary: {
        main: '#0044f9', 
        contrastText: '#ffffff'
      },
      secondary: {
        main: '#ce93d8', // Lighter purple for dark mode
        contrastText: '#000000'
      }
    },
    mobile: {
      primary: {
        main: '#ffa5f5', // Different blue for mobile
        contrastText: '#ffffff'
      },
      secondary: {
        main: '#ab47bc', // Different purple for mobile
        contrastText: '#ffffff'
      }
    }
  };

  // Get colorScheme components if available in config
  const hasColorSchemes = themeConfig.colorSchemes && Object.keys(themeConfig.colorSchemes).length > 0;
  const colorScheme = hasColorSchemes ? 
    (themeConfig.colorSchemes[mode] || themeConfig.colorSchemes.light) : 
    {};
  
  // Create a theme instance with the appropriate settings
  return createTheme({
    palette: {
      mode: mode === 'dark' ? 'dark' : 'light',
      primary: colorScheme.palette?.primary || defaultColors[mode]?.primary || defaultColors.light.primary,
      secondary: colorScheme.palette?.secondary || defaultColors[mode]?.secondary || defaultColors.light.secondary,
    },
    components: {
      ...themeConfig.components,
      ...(colorScheme.components || {})
    },
    typography: colorScheme.typography || themeConfig.typography || {},
    shadows: colorScheme.shadows || themeConfig.shadows || ["none"],
    spacing: themeConfig.spacing || [0, 4, 8, 16, 32, 64],
  });
}

function App() {
  // State for theme mode (light, dark, or mobile)
  const [mode, setMode] = useState('light');
  
  // Handle mode change from dropdown
  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  // Create theme based on selected mode
  const theme = createMuiTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Add theme debugging info */}
      <Container maxWidth="md" sx={{ mt: 8, mb: 8, py: 2 }}>
        <Paper elevation={3} sx={{ p: { xs: 4, sm: 6 }, borderRadius: 2 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ mb: 5, pt: 2, fontWeight: 500, textAlign: 'center' }}
          >
            MUI Button Demo
          </Typography>
          
          {/* Color mode switcher */}
          <Box sx={{ 
            mb: 6, 
            maxWidth: 300, 
            mx: 'auto', 
            p: 3, 
            py: 4,
            bgcolor: 'background.paper', 
            borderRadius: 1,
            boxShadow: 1
          }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="theme-mode-label">Color Mode</InputLabel>
              <Select
                labelId="theme-mode-label"
                id="theme-mode-select"
                value={mode}
                onChange={handleModeChange}
                label="Color Mode"
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="mobile">Mobile</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          {/* Button showcase */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 7, sm: 10 }, // Significantly increased gap between buttons
              my: 8, // Increased margin above and below
              py: 8, // Increased padding above and below
              px: { xs: 3, sm: 5 },
              bgcolor: 'background.default',
              borderRadius: 2,
              boxShadow: 1
            }}
          >
            {/* Filled button */}
            <Button 
              variant="contained"
            >
              Primary
            </Button>
            
            {/* Outlined button */}
            <Button 
              variant="outlined"
            >
              Secondary
            </Button>
            
            {/* Text button */}
            <Button 
              variant="text"
            >
              Text
            </Button>
          </Box>
          
          <Typography 
            variant="body1" 
            sx={{ 
              mt: 4, 
              p: 3,
              py: 4, 
              textAlign: 'center',
              bgcolor: 'background.paper',
              borderRadius: 1,
              fontWeight: 500
            }}
          >
            Current theme mode: <strong>{mode}</strong>
          </Typography>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
