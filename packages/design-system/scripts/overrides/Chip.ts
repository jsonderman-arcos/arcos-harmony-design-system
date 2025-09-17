export function MuiChip(t: any) {
  const v = (name: string, fallback: string) => `var(--${name}, ${fallback})`;

  // Base surface/text/divider via CSS vars with fallbacks to theme helpers
  const surfaceRaised = v('theme-base-surface-raised', t.surfaceRaised?.() || '#fff');
  const textSecondary = v('theme-base-text-secondary', t.textSecondary?.() || 'rgba(0,0,0,0.6)');
  const textPrimary = v('theme-base-text-primary', t.textPrimary?.() || 'rgba(0,0,0,0.87)');
  const divider = v('theme-base-divider', t.divider?.() || 'rgba(0,0,0,0.12)');

  // Palette roles as CSS variables (aligns with Switch.ts)
    // Default Chip tokens (from theme-base-components-chip-default-*)
  const chipDefault = {
    fill: v('theme-base-components-chip-default-close-fill', '#f5f5f5'),
    hover: v('theme-base-components-chip-default-hover-fill', 'rgba(0,0,0,0.12)'),
    border: v('theme-base-components-chip-default-enabled-border', '#bdbdbd'),
    focus: v('theme-base-components-chip-default-focus-fill', 'rgba(255,255,255,0.2)'),
    text: textPrimary,
  };
  const primary = {
    main: v('theme-base-palette-primary-main', '#1976d2'),
    on: v('theme-base-palette-primary-contrast-text', '#ffffff'),
  } as const;
  const secondary = {
    main: v('theme-base-palette-secondary-main', '#9c27b0'),
    on: v('theme-base-palette-secondary-contrast-text', '#ffffff'),
  } as const;
  const error = {
    main: v('theme-base-palette-error-main', '#d32f2f'),
    on: v('theme-base-palette-error-contrast-text', '#ffffff'),
  } as const;
  const warning = {
    main: v('theme-base-palette-warning-main', '#ed6c02'),
    on: v('theme-base-palette-warning-contrast-text', textPrimary),
  } as const;
  const info = {
    main: v('theme-base-palette-info-main', '#0288d1'),
    on: v('theme-base-palette-info-contrast-text', '#ffffff'),
  } as const;
  const success = {
    main: v('theme-base-palette-success-main', '#2e7d32'),
    on: v('theme-base-palette-success-contrast-text', '#ffffff'),
  } as const;

  const base = {
    borderRadius: t.radiusBy?.('max', 100) ?? '9999px',
    border: `${t.borderSize ?? 1}px solid ${divider}`,
    backgroundColor: surfaceRaised,
    color: textSecondary,
    // Delete icon alpha to 50%
    '& .MuiChip-deleteIcon': { opacity: 0.5 },
  } as const;

  const filled = (bg: string, fg: string) => ({
    backgroundColor: bg,
    color: fg,
    '& .MuiChip-deleteIcon': { color: fg, opacity: 0.5 },
  });

  const outlined = (stroke: string, fg: string) => ({
    backgroundColor: 'transparent',
    borderColor: stroke,
    color: fg,
    '& .MuiChip-deleteIcon': { color: fg, opacity: 0.5 },
  });

  return {
    styleOverrides: {
      root: {
        ...base,
      },
      // Variants (we still declare these empty to let variants[] drive styles)
      filled: {},
      outlined: {},
      // Colors (kept for MUI specificity but styles come from variants[])
      colorPrimary: {},
      colorSecondary: {},
      colorError: {},
      colorWarning: {},
      colorInfo: {},
      colorSuccess: {},
    },
    variants: [
      // Default (no color prop): use surface/text
      {
        props: { variant: 'filled' },
        style: filled(surfaceRaised, textSecondary),
      },
      {
        props: { variant: 'outlined' },
        style: outlined(divider, textSecondary),
      },
      // Default chip (explicit color="default")
      {
        props: { color: 'default', variant: 'filled' },
        style: filled(chipDefault.fill, chipDefault.text),
      },
      {
        props: { color: 'default', variant: 'outlined' },
        style: outlined(chipDefault.border, chipDefault.text),
      },
      // Primary
      {
        props: { color: 'primary', variant: 'filled' },
        style: filled(primary.main, primary.on),
      },
      {
        props: { color: 'primary', variant: 'outlined' },
        style: outlined(primary.main, primary.main),
      },
      // Secondary
      {
        props: { color: 'secondary', variant: 'filled' },
        style: filled(secondary.main, secondary.on),
      },
      {
        props: { color: 'secondary', variant: 'outlined' },
        style: outlined(secondary.main, secondary.main),
      },
      // Error
      {
        props: { color: 'error', variant: 'filled' },
        style: filled(error.main, error.on),
      },
      {
        props: { color: 'error', variant: 'outlined' },
        style: outlined(error.main, error.main),
      },
      // Warning
      {
        props: { color: 'warning', variant: 'filled' },
        style: filled(warning.main, warning.on),
      },
      {
        props: { color: 'warning', variant: 'outlined' },
        style: outlined(warning.main, warning.main),
      },
      // Info
      {
        props: { color: 'info', variant: 'filled' },
        style: filled(info.main, info.on),
      },
      {
        props: { color: 'info', variant: 'outlined' },
        style: outlined(info.main, info.main),
      },
      // Success
      {
        props: { color: 'success', variant: 'filled' },
        style: filled(success.main, success.on),
      },
      {
        props: { color: 'success', variant: 'outlined' },
        style: outlined(success.main, success.main),
      },
    ],
  };
}