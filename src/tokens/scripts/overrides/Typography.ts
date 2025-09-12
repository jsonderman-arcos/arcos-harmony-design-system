// CSS var helper with safe fallback
const v = (name: string, fallback: string) => `var(--${name}, ${fallback})`;

export function MuiTypography(t: any) {
  const radius = t?.radius ?? '4px';

  // Text tokens (default text colors)
  const text = {
    primary: v(
      'theme-base-text-primary',
      // fallback to palette.text.primary-ish dark value
      'rgba(0,0,0,0.8700000047683716)'
    ),
    secondary: v(
      'theme-base-text-secondary',
      'rgba(0,0,0,0.699999988079071)'
    ),
  } as const;

  // Brand palette tokens (used when color="primary"|"secondary")
  const primary = {
    main: v(
      'theme-base-primary-main',
      (typeof t?.primaryMain === 'function' && t.primaryMain()) || 'rgba(25,118,210,1)'
    ),
  } as const;
  const secondary = {
    main: v(
      'theme-base-secondary-main',
      (typeof t?.secondaryMain === 'function' && t.secondaryMain()) || 'rgba(156,39,176,1)'
    ),
  } as const;

  // Feedback (mirrors Alert.ts)
  const error = { main: v('theme-base-feedback-error-main', 'rgba(211,47,47,1)') } as const;
  const warning = { main: v('theme-base-feedback-warning-main', 'rgba(237,108,2,1)') } as const;
  const info = { main: v('theme-base-feedback-info-main', 'rgba(2,136,209,1)') } as const;
  const success = { main: v('theme-base-feedback-success-main', 'rgba(46,125,50,1)') } as const;

  return {
    defaultProps: {},
    styleOverrides: {
      root: {
        borderRadius: radius,
        // Default text color should follow the token so it swaps with data-theme
        color: text.primary,
      },

      // Matches <Typography color="primary"/"secondary">
      colorPrimary: { color: primary.main },
      colorSecondary: { color: secondary.main },

      // Matches <Typography color="textPrimary"/"textSecondary">
      colorTextPrimary: { color: text.primary },
      colorTextSecondary: { color: text.secondary },

      // Feedback colors
      
      colorError: { color: error.main },
      colorWarning: { color: warning.main },
      colorInfo: { color: info.main },
      colorSuccess: { color: success.main },
    },
  };
}
