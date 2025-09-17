
// demos/mui/src/main.tsx
import 'arcos-harmony-design-system/theme/tokens.css';
import 'arcos-harmony-design-system/theme/theme.css';
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider, CssBaseline, Switch, FormControlLabel } from '@mui/material';
import { createTheme, type Theme, type ThemeOptions } from '@mui/material/styles';
import { muiThemeJson } from 'arcos-harmony-design-system';

function Root() {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
React.useEffect(() => {
  document.documentElement.setAttribute('data-theme', mode);
}, [mode]);
  const baseTheme = React.useMemo(() => createTheme(muiThemeJson as ThemeOptions), []);
  const theme = React.useMemo<Theme>(
    () => ({
      ...baseTheme,
      palette: {
        ...baseTheme.palette,
        mode
      }
    }),
    [baseTheme, mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        id="root"
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--theme-base-background-elevations-level-1)',
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={mode === 'dark'}
              onChange={() => setMode(mode === 'light' ? 'dark' : 'light')}
            />
          }
          label="Dark mode"
        />
        <App />
      </div>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
