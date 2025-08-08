import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Container, Typography, Button, Stack, AppBar, Toolbar } from '@mui/material';
import { theme, setThemeMode, getAvailableThemeModes } from './theme';
import TypographySection from './components/TypographySection';
import ButtonsSection from './components/ButtonsSection';
import InputsSection from './components/InputsSection';
import DataDisplaySection from './components/DataDisplaySection';
import FeedbackSection from './components/FeedbackSection';
import NavigationSection from './components/NavigationSection';

const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState(theme);
  const availableModes = getAvailableThemeModes();
  
  // Handler for theme mode switching
  const handleThemeChange = (mode: string) => {
    const newTheme = setThemeMode(mode);
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
        
        {/* Component Sections */}
        <TypographySection />
        <ButtonsSection />
        <InputsSection />
        <DataDisplaySection />
        <FeedbackSection />
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
