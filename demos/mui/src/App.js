import React, { useState } from 'react';
import { 
  ThemeProvider, 
  CssBaseline, 
  Box, 
  Container, 
  Typography, 
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Grid,
  IconButton,
  Divider,
  Paper
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { lightTheme, darkTheme } from './theme';

function App() {
  const [theme, setTheme] = useState('light');
  const [dropdown, setDropdown] = useState('');
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Handle dropdown change
  const handleDropdownChange = (event) => {
    setDropdown(event.target.value);
  };

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" component="h1" gutterBottom>
                MUI Theme Demo
              </Typography>
              <IconButton onClick={toggleTheme} color="primary">
                {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>
            </Box>
            
            <Typography variant="body1" gutterBottom>
              This demo showcases MUI components with light and dark theme switching.
              The button colors and other styles are different between themes.
            </Typography>
          </Paper>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Buttons</Typography>
                  <Box sx={{ '& button': { m: 1 } }}>
                    <Button variant="contained" color="primary">Primary</Button>
                    <Button variant="contained" color="secondary">Secondary</Button>
                    <Button variant="outlined" color="primary">Outlined</Button>
                    <Button variant="text" color="primary">Text</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Text Fields</Typography>
                  <Box sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}>
                    <TextField label="Standard" variant="outlined" />
                    <TextField
                      label="Password"
                      type="password"
                      variant="outlined"
                      placeholder="Enter password"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Dropdown</Typography>
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel id="demo-simple-select-label">Select Option</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={dropdown}
                      label="Select Option"
                      onChange={handleDropdownChange}
                    >
                      <MenuItem value="option1">Option 1</MenuItem>
                      <MenuItem value="option2">Option 2</MenuItem>
                      <MenuItem value="option3">Option 3</MenuItem>
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Toggle Switch</Typography>
                  <Box sx={{ m: 1 }}>
                    <FormControlLabel
                      control={<Switch defaultChecked color="primary" />}
                      label="Primary Switch"
                    />
                    <FormControlLabel
                      control={<Switch color="secondary" />}
                      label="Secondary Switch"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Typography</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h1">h1 Heading</Typography>
                  <Typography variant="h2">h2 Heading</Typography>
                  <Typography variant="h3">h3 Heading</Typography>
                  <Typography variant="h4">h4 Heading</Typography>
                  <Typography variant="h5">h5 Heading</Typography>
                  <Typography variant="h6">h6 Heading</Typography>
                  <Typography variant="subtitle1">Subtitle 1</Typography>
                  <Typography variant="subtitle2">Subtitle 2</Typography>
                  <Typography variant="body1">
                    Body 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </Typography>
                  <Typography variant="body2">
                    Body 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
