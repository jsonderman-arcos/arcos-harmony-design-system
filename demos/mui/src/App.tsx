import React, { useState } from 'react';
import { 
  ThemeProvider, 
  CssBaseline, 
  Box, 
  Container, 
  Typography, 
  Button,
  Paper,
  Stack, 
  AppBar, 
  Toolbar
} from '@mui/material';
import theme, { setThemeMode, getAvailableThemeModes } from './theme.ts';
import type { ThemeMode } from './theme.ts';

// Import components one by one
import SpacingTest from './components/SpacingTest';
import TypographySection from './components/TypographySection';
import ButtonsSection from './components/ButtonsSection';
import InputsSection from './components/InputsSection';
import DataDisplaySection from './components/DataDisplaySection';
import FeedbackSection from './components/FeedbackSection';
import NavigationSection from './components/NavigationSection';

const App: React.FC = () => {
  console.log('App is rendering');
  console.log('Initial theme:', theme);
  
  const [currentTheme, setCurrentTheme] = useState(theme);
  const availableModes = getAvailableThemeModes();
  
  // Handler for theme mode switching
  const handleThemeChange = (mode: ThemeMode) => {
    console.log('Switching theme to:', mode);
    const newTheme = setThemeMode(mode);
    console.log('New theme:', newTheme);
    setCurrentTheme(newTheme);
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            UX Design System - MUI Demo
          </Typography>
          <Stack direction="row" spacing={1}>
            {availableModes.map(mode => (
              <Button 
                key={mode}
                color="inherit"
                variant={mode === currentTheme.palette.mode ? "outlined" : "text"}
                onClick={() => handleThemeChange(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </Stack>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            UX Design System - MUI Demo
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            This demo showcases Material UI components styled with your design tokens.
            Change the theme mode using the buttons in the app bar to see how the components adapt.
          </Typography>
        </Box>
        
        {/* Debug information */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Theme Debug Info
          </Typography>
          <Typography variant="body2">
            Theme Mode: {currentTheme.palette.mode || 'default'}
          </Typography>
          <Typography variant="body2">
            Primary Color: {currentTheme.palette.primary.main}
          </Typography>
          <Typography variant="body2">
            Secondary Color: {currentTheme.palette.secondary.main}
          </Typography>
          <Typography variant="body2">
            Spacing Example (2): {currentTheme.spacing(2)}
          </Typography>
        </Paper>
        
        {/* Spacing Test - to verify decimal point handling */}
        <SpacingTest />
        
        {/* Typography Section */}
        <TypographySection />
        
        {/* Buttons Section */}
        <ButtonsSection />
        
        {/* Inputs Section */}
        <InputsSection />
        
        {/* Data Display Section */}
        <DataDisplaySection />
        
        {/* Feedback Section */}
        <FeedbackSection />
        
        {/* Navigation Section */}
        <NavigationSection />
        
        <Box sx={{ mt: 4, py: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            UX Design System - Demo created {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
