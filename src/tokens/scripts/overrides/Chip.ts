export function MuiChip(t: any) {
  const base = {
    borderRadius: t.radius,
    border: `${t.borderSize}px solid ${t.divider()}`,
    backgroundColor: t.surfaceRaised(),
    color: t.textSecondary(),
  } as const;

  const filled = (bg: string, fg: string) => ({
    backgroundColor: bg,
    color: fg,
    '& .MuiChip-deleteIcon': { color: fg },
  });

  const outlined = (stroke: string, fg: string) => ({
    backgroundColor: 'transparent',
    borderColor: stroke,
    color: fg,
    '& .MuiChip-deleteIcon': { color: fg },
  });

  return {
    styleOverrides: {
      root: {
        ...base,
      },
      // Variants
      filled: {},
      outlined: {},
      // Colors
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
        style: filled(t.surfaceRaised(), t.textSecondary()),
      },
      {
        props: { variant: 'outlined' },
        style: outlined(t.divider(), t.textSecondary()),
      },
      // Primary
      {
        props: { color: 'primary', variant: 'filled' },
        style: filled(t.primaryMain(), t.onPrimary()),
      },
      {
        props: { color: 'primary', variant: 'outlined' },
        style: outlined(t.primaryMain(), t.primaryMain()),
      },
      // Secondary
      {
        props: { color: 'secondary', variant: 'filled' },
        style: filled(t.secondaryMain(), t.onPrimary() || t.textPrimary()),
      },
      {
        props: { color: 'secondary', variant: 'outlined' },
        style: outlined(t.secondaryMain(), t.secondaryMain()),
      },
      // Error
      {
        props: { color: 'error', variant: 'filled' },
        style: filled(t.errorMain?.() || '#d32f2f', t.onError?.() || '#fff'),
      },
      {
        props: { color: 'error', variant: 'outlined' },
        style: outlined(t.errorMain?.() || '#970f0fff', t.errorMain?.() || '#d32f2f'),
      },
      // Warning
      {
        props: { color: 'warning', variant: 'filled' },
        style: filled(t.warningMain?.() || '#ed6c02', t.onWarning?.() || t.textPrimary()),
      },
      {
        props: { color: 'warning', variant: 'outlined' },
        style: outlined(t.warningMain?.() || '#ed6c02', t.warningMain?.() || '#ed6c02'),
      },
      // Info
      {
        props: { color: 'info', variant: 'filled' },
        style: filled(t.infoMain?.() || '#0288d1', t.onInfo?.() || '#fff'),
      },
      {
        props: { color: 'info', variant: 'outlined' },
        style: outlined(t.infoMain?.() || '#0288d1', t.infoMain?.() || '#0288d1'),
      },
      // Success
      {
        props: { color: 'success', variant: 'filled' },
        style: filled(t.successMain?.() || '#2e7d32', t.onSuccess?.() || '#fff'),
      },
      {
        props: { color: 'success', variant: 'outlined' },
        style: outlined(t.successMain?.() || '#2e7d32', t.successMain?.() || '#2e7d32'),
      },
    ],
  };
}