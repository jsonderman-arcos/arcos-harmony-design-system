// MUI Alert theme overrides using base-feedback tokens from theme.muiflat.json
// Applies standard, filled, and outlined variants for success, info, warning, and error

export function MuiAlert(t: any) {
  const radius = t?.radius ?? '4px';
  const v = (name: string, fallback: string) => `var(--${name}, ${fallback})`;

  // Provide palette-like fallbacks so filled/outlined variants always render
  const error = {
    main: v('theme-base-feedback-error-main', '#d32f2f'),
    light: v('theme-base-feedback-error-light', '#fde7e9'),
    dark: v('theme-base-feedback-error-dark', '#9a0007'),
    on: v('theme-base-feedback-error-contrast-text', '#ffffff'),
  };

  const warning = {
    main: v('theme-base-feedback-warning-main', '#ed6c02'),
    light: v('theme-base-feedback-warning-light', '#fff4e5'),
    dark: v('theme-base-feedback-warning-dark', '#b53d00'),
    on: v('theme-base-feedback-warning-contrast-text', '#1a1300'),
  };

  const info = {
    main: v('theme-base-feedback-info-main', '#0288d1'),
    light: v('theme-base-feedback-info-light', '#e3f2fd'),
    dark: v('theme-base-feedback-info-dark', '#01579b'),
    on: v('theme-base-feedback-info-contrast-text', '#ffffff'),
  };

  const success = {
    main: v('theme-base-feedback-success-main', '#2e7d32'),
    light: v('theme-base-feedback-success-light', '#e8f5e9'),
    dark: v('theme-base-feedback-success-dark', '#1b5e20'),
    on: v('theme-base-feedback-success-contrast-text', '#ffffff'),
  };

  return {
    styleOverrides: {
      root: {
        borderRadius: radius,
      },

      // ---- standard variant ----
      standardSuccess: {
        backgroundColor: success.light,
        color: success.dark,
      },
      standardInfo: {
        backgroundColor: info.light,
        color: info.dark,
      },
      standardWarning: {
        backgroundColor: warning.light,
        color: warning.dark,
      },
      standardError: {
        backgroundColor: error.light,
        color: error.dark,
      },

      // ---- filled variant ----
      filledSuccess: {
        backgroundColor: success.main,
        color: success.on,
      },
      filledInfo: {
        backgroundColor: info.main,
        color: info.on,
      },
      filledWarning: {
        backgroundColor: warning.main,
        color: warning.on,
      },
      filledError: {
        backgroundColor: error.main,
        color: error.on,
      },

      // ---- outlined variant ----
      outlinedSuccess: {
        color: success.dark,
        border: '1px solid',
        borderColor: success.main,
      },
      outlinedInfo: {
        color: info.dark,
        border: '1px solid',
        borderColor: info.main,
      },
      outlinedWarning: {
        color: warning.dark,
        border: '1px solid',
        borderColor: warning.main,
      },
      outlinedError: {
        color: error.dark,
        border: '1px solid',
        borderColor: error.main,
      },
    },
  };
}