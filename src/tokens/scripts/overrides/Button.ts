export function MuiButton(t: any) {
  // Helper for CSS vars with safe fallbacks
  const v = (name: string, fallback: string) => `var(--${name}, ${fallback})`;

  const radius = t?.radius ?? '4px';
  const borderSize = Math.max(2, t?.borderSize ?? 1);

  // ===== Base (matches theme.muiflat.json token names) =====
  // Primary (theme-base-primary-*)
  const primary = {
    main: v('theme-base-primary-main', 'rgba(50,98,141,1)'),
    dark: v('theme-base-primary-dark', 'rgba(42,82,118,1)'),
    on: v('theme-base-primary-on-main', 'rgba(235,239,244,1)'), // contrast text alias
    // Use `dark` as hover fallback if no explicit hover token exists
    hoverBgSolid: v('theme-base-primary-dark', 'rgba(42,82,118,1)'),
    // State overlays for outlined/text hovers
    stateHover: v('theme-base-primary-states-hover', 'rgba(50,98,141,0.06)'),
    stateSelected: v('theme-base-primary-states-selected', 'rgba(50,98,141,0.16)'),
    stateFocus: v('theme-base-primary-states-focus', 'rgba(50,98,141,0.12)'),
    stateFocusVisible: v('theme-base-primary-states-focus-visible', 'rgba(50,98,141,0.30)'),
    stateOutlinedBorder: v('theme-base-primary-states-outlined-border', 'rgba(50,98,141,0.50)'),
  } as const;

  // Secondary (theme-base-secondary-*)
  const secondary = {
    main: v('theme-base-secondary-main', 'rgba(65,94,91,1)'),
    dark: v('theme-base-secondary-dark', 'rgba(113,164,158,1)'),
    on: v('theme-base-secondary-on-main', 'rgba(255,255,255,1)'),
    hoverBgSolid: v('theme-base-secondary-dark', 'rgba(113,164,158,1)'),
    stateHover: v('theme-base-secondary-states-hover', 'rgba(65,94,91,0.06)'),
    stateSelected: v('theme-base-secondary-states-selected', 'rgba(65,94,91,0.16)'),
    stateFocus: v('theme-base-secondary-states-focus', 'rgba(65,94,91,0.30)'),
    stateFocusVisible: v('theme-base-secondary-states-focus-visible', 'rgba(65,94,91,0.50)'),
    stateOutlinedBorder: v('theme-base-secondary-states-outlined-border', 'rgba(65,94,91,0.50)'),
  } as const;

  // Feedback (theme-base-feedback-*) — mirror Alert.ts usage
  const error = {
    main: v('theme-base-feedback-error-main', 'rgba(211,47,47,1)'),
    dark: v('theme-base-feedback-error-dark', 'rgba(154,0,7,1)'),
    on: v('theme-base-feedback-error-contrast-text', 'rgba(255,255,255,1)'),
    hoverBgSolid: v('theme-base-feedback-error-dark', 'rgba(154,0,7,1)'),
  } as const;

  const warning = {
    main: v('theme-base-feedback-warning-main', 'rgba(237,108,2,1)'),
    dark: v('theme-base-feedback-warning-dark', 'rgba(181,61,0,1)'),
    on: v('theme-base-feedback-warning-contrast-text', 'rgba(26,19,0,1)'),
    hoverBgSolid: v('theme-base-feedback-warning-dark', 'rgba(181,61,0,1)'),
  } as const;

  const info = {
    main: v('theme-base-feedback-info-main', 'rgba(2,136,209,1)'),
    dark: v('theme-base-feedback-info-dark', 'rgba(1,87,155,1)'),
    on: v('theme-base-feedback-info-contrast-text', 'rgba(255,255,255,1)'),
    hoverBgSolid: v('theme-base-feedback-info-dark', 'rgba(1,87,155,1)'),
  } as const;

  const success = {
    main: v('theme-base-feedback-success-main', 'rgba(46,125,50,1)'),
    dark: v('theme-base-feedback-success-dark', 'rgba(27,94,32,1)'),
    on: v('theme-base-feedback-success-contrast-text', 'rgba(255,255,255,1)'),
    hoverBgSolid: v('theme-base-feedback-success-dark', 'rgba(27,94,32,1)'),
  } as const;

  // Actions / disabled / focus
  const disabled = v('theme-base-action-disabled', 'rgba(0,0,0,0.38)');
  const disabledBg = v('theme-base-action-disabled-background', 'rgba(0,0,0,0.12)');
  const focusRing = primary.stateFocusVisible; // prefer primary focus-visible token

  // Helper to create overlay hovers for outlined/text using explicit state tokens
  const overlay = (bgOverlay: string) => ({ backgroundColor: bgOverlay });

  // Shorthand generators
  const contained = (c: { main: string; dark: string; on: string; hoverBgSolid: string }) => ({
    backgroundColor: c.main,
    color: c.on,
    boxShadow: 'none',
    '&:hover': { backgroundColor: c.hoverBgSolid, boxShadow: 'none' },
    '&:active': { backgroundColor: c.dark, boxShadow: 'none' },
    '&.Mui-disabled': { color: disabled, backgroundColor: disabledBg, boxShadow: 'none' },
  });

  const outlined = (c: { main: string }, state: { stateHover: string; stateOutlinedBorder: string }) => ({
    color: c.main,
    borderColor: state.stateOutlinedBorder,
    '&:hover': overlay(state.stateHover),
    '&.Mui-disabled': { color: disabled, borderColor: disabledBg },
  });

  const text = (c: { main: string }, state: { stateHover: string }) => ({
    color: c.main,
    '&:hover': overlay(state.stateHover),
    '&.Mui-disabled': { color: disabled },
  });

  return {
    styleOverrides: {
      root: {
        borderRadius: radius,
        textTransform: 'none',
        boxShadow: 'none',
        '&:focus-visible': {
          outline: `${borderSize}px solid ${focusRing}`,
          outlineOffset: 2,
        },

        /* Specificity bump to ensure primary/secondary win over default MUI rules */
        '&.MuiButton-containedPrimary': {
          backgroundColor: primary.main,
          color: primary.on,
          '&:hover': { backgroundColor: primary.hoverBgSolid, boxShadow: 'none' },
          '&:active': { backgroundColor: primary.dark, boxShadow: 'none' },
        },
        '&.MuiButton-outlinedPrimary': {
          color: primary.main,
          borderColor: primary.stateOutlinedBorder,
          '&:hover': overlay(primary.stateHover),
        },
        '&.MuiButton-textPrimary': {
          color: primary.main,
          '&:hover': overlay(primary.stateHover),
        },

        '&.MuiButton-containedSecondary': {
          backgroundColor: secondary.main,
          color: secondary.on,
          '&:hover': { backgroundColor: secondary.hoverBgSolid, boxShadow: 'none' },
          '&:active': { backgroundColor: secondary.dark, boxShadow: 'none' },
        },
        '&.MuiButton-outlinedSecondary': {
          color: secondary.main,
          borderColor: secondary.stateOutlinedBorder,
          '&:hover': overlay(secondary.stateHover),
        },
        '&.MuiButton-textSecondary': {
          color: secondary.main,
          '&:hover': overlay(secondary.stateHover),
        },
      },

      // Primary
      containedPrimary: contained(primary),
      outlinedPrimary: outlined(primary, primary),
      textPrimary: text(primary, primary),

      // Secondary
      containedSecondary: contained(secondary),
      outlinedSecondary: outlined(secondary, secondary),
      textSecondary: text(secondary, secondary),

      // Feedback colors
      containedError: contained(error),
      outlinedError: { color: error.main, borderColor: error.main, '&:hover': overlay(primary.stateHover) },
      textError: { color: error.main, '&:hover': overlay(primary.stateHover) },

      containedWarning: contained(warning),
      outlinedWarning: { color: warning.main, borderColor: warning.main, '&:hover': overlay(secondary.stateHover) },
      textWarning: { color: warning.main, '&:hover': overlay(secondary.stateHover) },

      containedInfo: contained(info),
      outlinedInfo: { color: info.main, borderColor: info.main, '&:hover': overlay(primary.stateHover) },
      textInfo: { color: info.main, '&:hover': overlay(primary.stateHover) },

      containedSuccess: contained(success),
      outlinedSuccess: { color: success.main, borderColor: success.main, '&:hover': overlay(secondary.stateHover) },
      textSuccess: { color: success.main, '&:hover': overlay(secondary.stateHover) },
    },
  };
}