import { t } from '../lib/tokenUtils';

export function MuiPaper(t: any) {
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
      },
      outlined: {
        border: `${t.borderSize}px solid ${t.divider()}`,
        backgroundColor: t.surface(),
      },
    },
    variants,
  };
}