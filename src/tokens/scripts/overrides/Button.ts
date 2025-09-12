export function MuiButton(t: any) {
  // Helper for CSS vars with safe fallbacks
  const v = (name: string, fallback: string) => `var(--${name}, ${fallback})`;

  const radius = t?.radius ?? '4px';
  const borderSize = Math.max(2, t?.borderSize ?? 1);

  // ===== Base (matches theme.muiflat.json token names) =====
  // Primary (theme-base-primary-*)
  const primary = {
    main: v('theme-base-primary-main', '#32628D'),
    dark: v('theme-base-primary-dark', '#2A5276'),
    on: v('theme-base-primary-on-main', '#EBEFF4'), // contrast text alias
    // Use `dark` as hover fallback if no explicit hover token exists
    hoverBgSolid: v('theme-base-primary-dark', '#2A5276'),
    // State overlays for outlined/text hovers
    stateHover: v('theme-base-primary-states-hover', 'rgba(50,98,141,0.06)'),
    stateSelected: v('theme-base-primary-states-selected', 'rgba(50,98,141,0.16)'),
    stateFocus: v('theme-base-primary-states-focus', 'rgba(50,98,141,0.12)'),
    stateFocusVisible: v('theme-base-primary-states-focus-visible', 'rgba(50,98,141,0.30)'),
    stateOutlinedBorder: v('theme-base-primary-states-outlined-border', 'rgba(50,98,141,0.50)'),
  } as const;

  // Secondary (theme-base-secondary-*)
  const secondary = {
    main: v('theme-base-secondary-main', '#415E5B'),
    dark: v('theme-base-secondary-dark', '#71A49E'),
    on: v('theme-base-secondary-on-main', '#FFFFFF'),
    hoverBgSolid: v('theme-base-secondary-dark', '#71A49E'),
    stateHover: v('theme-base-secondary-states-hover', 'rgba(65,94,91,0.06)'),
    stateSelected: v('theme-base-secondary-states-selected', 'rgba(65,94,91,0.16)'),
    stateFocus: v('theme-base-secondary-states-focus', 'rgba(65,94,91,0.30)'),
    stateFocusVisible: v('theme-base-secondary-states-focus-visible', 'rgba(65,94,91,0.50)'),
    stateOutlinedBorder: v('theme-base-secondary-states-outlined-border', 'rgba(65,94,91,0.50)'),
  } as const;

  // Feedback (theme-base-feedback-*) — mirror Alert.ts usage
  const error = {
    main: v('theme-base-feedback-error-main', '#d32f2f'),
    dark: v('theme-base-feedback-error-dark', '#9a0007'),
    on: v('theme-base-feedback-error-contrast-text', '#ffffff'),
    hoverBgSolid: v('theme-base-feedback-error-dark', '#9a0007'),
  } as const;

  const warning = {
    main: v('theme-base-feedback-warning-main', '#ed6c02'),
    dark: v('theme-base-feedback-warning-dark', '#b53d00'),
    on: v('theme-base-feedback-warning-contrast-text', '#1a1300'),
    hoverBgSolid: v('theme-base-feedback-warning-dark', '#b53d00'),
  } as const;

  const info = {
    main: v('theme-base-feedback-info-main', '#0288d1'),
    dark: v('theme-base-feedback-info-dark', '#01579b'),
    on: v('theme-base-feedback-info-contrast-text', '#ffffff'),
    hoverBgSolid: v('theme-base-feedback-info-dark', '#01579b'),
  } as const;

  const success = {
    main: v('theme-base-feedback-success-main', '#2e7d32'),
    dark: v('theme-base-feedback-success-dark', '#1b5e20'),
    on: v('theme-base-feedback-success-contrast-text', '#ffffff'),
    hoverBgSolid: v('theme-base-feedback-success-dark', '#1b5e20'),
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