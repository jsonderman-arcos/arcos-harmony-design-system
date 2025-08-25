import { t } from '../lib/tokenUtils';

export function MuiCard(t: any) {
  const variants = Array.from({ length: 7 }, (_, level) => ({
    props: { elevation: level },
    style: {
      backgroundColor: t.paperBackgroundForElevation(level),
      ['--mui-palette-background-paper' as any]: t.paperBackgroundForElevation(level),
    },
  }));

  return {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {
        borderRadius: t.radius,
        border: `${t.borderSize}px solid ${t.divider()}`,
      },
    },
    variants,
  };
}