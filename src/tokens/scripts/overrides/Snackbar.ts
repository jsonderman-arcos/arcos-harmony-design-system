// MUI Snackbar theme overrides using base-feedback tokens from theme.muiflat.json
// NOTE: Snackbar itself has no severity/variant props. Severity visuals typically come from
// an <Alert/> rendered inside the Snackbar. This override:
//  1) Styles the Snackbar container and its SnackbarContent.
//  2) Ensures child <Alert/> instances inside a Snackbar use the same tokenized colors
//     as our Alert theme (by targeting Alert classes within the Snackbar scope).

export function MuiSnackbar(t: any) {
  const radius = t?.radius ?? '4px';
  const v = (name: string, fallback: string) => `var(--${name}, ${fallback})`;

  // Feedback colors (match Alert.ts fallbacks)
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
      // Snackbar container
      root: {
        '& .MuiPaper-root, & .MuiSnackbarContent-root': {
          borderRadius: radius,
        },
        // Default fallback styling if a plain SnackbarContent is used (no Alert)
        '& .MuiSnackbarContent-root': {
          backgroundColor: info.main,
          color: info.on,
        },

        // If an <Alert/> is rendered inside, ensure it picks up our token colors
        // (These selectors only scope to Alerts inside a Snackbar)
        '& .MuiAlert-filledSuccess': { backgroundColor: success.main, color: success.on },
        '& .MuiAlert-filledInfo': { backgroundColor: info.main, color: info.on },
        '& .MuiAlert-filledWarning': { backgroundColor: warning.main, color: warning.on },
        '& .MuiAlert-filledError': { backgroundColor: error.main, color: error.on },

        '& .MuiAlert-standardSuccess': { backgroundColor: success.light, color: success.dark },
        '& .MuiAlert-standardInfo': { backgroundColor: info.light, color: info.dark },
        '& .MuiAlert-standardWarning': { backgroundColor: warning.light, color: warning.dark },
        '& .MuiAlert-standardError': { backgroundColor: error.light, color: error.dark },

        '& .MuiAlert-outlinedSuccess': { color: success.dark, border: '1px solid', borderColor: success.main },
        '& .MuiAlert-outlinedInfo': { color: info.dark, border: '1px solid', borderColor: info.main },
        '& .MuiAlert-outlinedWarning': { color: warning.dark, border: '1px solid', borderColor: warning.main },
        '& .MuiAlert-outlinedError': { color: error.dark, border: '1px solid', borderColor: error.main },
      },
    },
  };
}