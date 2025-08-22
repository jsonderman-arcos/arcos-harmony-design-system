import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { muiThemeLight } from '../../../src/tokens/outputs/muiThemeObjects';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={muiThemeLight}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);