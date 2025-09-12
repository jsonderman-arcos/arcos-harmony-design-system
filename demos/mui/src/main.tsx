
// demos/mui/src/main.tsx
import '../../../src/theme/core.css';   // ← the file that defines --core-lighthouse-... vars
import '../../../src/theme/theme.css';         // ← your theme that references them
import * as React from "react";
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider, CssBaseline, Switch, FormControlLabel } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import baseTheme from '../../../src/theme/mui-theme';

function Root() {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
React.useEffect(() => {
  document.documentElement.setAttribute('data-theme', mode);
}, [mode]);
  const theme = React.useMemo(
    () => (
      {
        ...baseTheme,
        palette: {
          ...baseTheme.palette,
          mode,
        },
      } as Theme
    ),
    [mode]
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