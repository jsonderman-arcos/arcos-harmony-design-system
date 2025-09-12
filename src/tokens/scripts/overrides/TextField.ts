// Helper for CSS vars with safe fallbacks
const v = (name: string, fallback: string) => `var(--${name}, ${fallback})`;

export function MuiTextField(t: any) {
  const radius = t?.radius ?? '4px';

  return {
    defaultProps: {
      variant: 'outlined',
    },
    styleOverrides: {
      root: {
        borderRadius: radius,
      },
    },
  };
}

// OutlinedInput override — pulls background/borders/states from tokens (light/dark via CSS vars)
export function MuiOutlinedInput(t: any) {
  const radius = t?.radius ?? '4px';
  const borderSize = Math.max(1, t?.borderSize ?? 1);

  // Base colors
  const bg = v(
    'theme-base-components-input-outlined-background-fill',
    // fallback to elevation 0 / paper background, then white
    v(
      'theme-base-background-elevations-level-0',
      (typeof t?.paperBackgroundForElevation === 'function' && t.paperBackgroundForElevation(0)) ||
        'rgba(255,255,255,1)'
    )
  );

  const divider = v(
    'theme-base-divider',
    (typeof t?.divider === 'function' ? t.divider() : t?.divider) || 'rgba(0,0,0,0.12)'
  );

  // Primary focus + states
  const primaryMain = v(
    'theme-base-primary-main',
    (typeof t?.primaryMain === 'function' && t.primaryMain()) || 'rgba(25,118,210,1)'
  );
  const stateFocus = v('theme-base-primary-states-focus', 'rgba(25,118,210,0.12)');

  // Feedback tokens (error, warning, info, success) — mirrors Alert.ts
  const errorMain = v('theme-base-feedback-error-main', 'rgba(211,47,47,1)');
  const warningMain = v('theme-base-feedback-warning-main', 'rgba(237,108,2,1)');
  const infoMain = v('theme-base-feedback-info-main', 'rgba(2,136,209,1)');
  const successMain = v('theme-base-feedback-success-main', 'rgba(46,125,50,1)');

  const disabled = v(
    'theme-base-action-disabled',
    (typeof t?.actionDisabled === 'function' ? t.actionDisabled() : 'rgba(0,0,0,0.38)')
  );
  const disabledBg = v(
    'theme-base-action-disabled-background',
    (typeof t?.actionDisabledBg === 'function' ? t.actionDisabledBg() : 'rgba(0,0,0,0.12)')
  );

  const root: Record<string, any> = {
    borderRadius: radius,
    backgroundColor: bg,
    '--mui-palette-background-paper': bg, // sync MUI background channel
    '&.Mui-disabled': {
      backgroundColor: disabledBg,
      color: disabled,
    },
    // Focus visual (match Button/Alert state token approach)
    '&.Mui-focused': {
      boxShadow: `0 0 0 ${borderSize}px ${stateFocus}`,
    },
    // Outline color transitions
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: divider },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: primaryMain },
    // ---- Feedback states (mirror Alert.ts) ----
    '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: errorMain },
    '&.Mui-focused.MuiInputBase-colorWarning .MuiOutlinedInput-notchedOutline': { borderColor: warningMain },
    '&.Mui-focused.MuiInputBase-colorInfo .MuiOutlinedInput-notchedOutline': { borderColor: infoMain },
    '&.Mui-focused.MuiInputBase-colorSuccess .MuiOutlinedInput-notchedOutline': { borderColor: successMain },
  };

  return {
    styleOverrides: {
      root,
      // The actual outline element
      notchedOutline: {
        borderColor: divider,
      },
      // Other slots (kept for completeness/extensibility)
      input: {
        color: v(
          'theme-base-text-primary',
          'rgba(0,0,0,0.87)' // fallback to default MUI text primary
        ),
      },
      adornedStart: {},
      adornedEnd: {},
      colorPrimary: {},
      colorSecondary: {},
    },
  };
}