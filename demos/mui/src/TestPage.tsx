import React, { useState } from 'react';
import { Button, Typography, ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme, { setThemeMode } from './theme.ts';
import type { ThemeMode } from './theme.ts';

const TestPage: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState(theme);
  
  const handleThemeChange = (mode: ThemeMode) => {
    const newTheme = setThemeMode(mode);
    setCurrentTheme(newTheme);
  };
  
  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box sx={{ p: 3 }}>
        <Typography variant="h3">Test Page with Theme</Typography>
        <Typography variant="body1">This is a test page to verify basic MUI components with theme are working.</Typography>
        <Typography variant="body1">If you can see this text with proper styling, the theme is working correctly!</Typography>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary">
            Primary Button
          </Button>
          <Button variant="contained" color="secondary">
            Secondary Button
          </Button>
        </Box>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => handleThemeChange('light')}>
            Light Theme
          </Button>
          <Button variant="outlined" onClick={() => handleThemeChange('dark')}>
            Dark Theme
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default TestPage;
