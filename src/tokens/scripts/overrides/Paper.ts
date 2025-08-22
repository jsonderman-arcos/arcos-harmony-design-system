import { t } from '../lib/tokenUtils';

export const MuiPaper = {
      styleOverrides: {
        root: {
          backgroundColor: t.surface(),
          borderRadius: t.radius,
        },
        outlined: {
          border: `${t.borderSize}px solid ${t.divider()}`,
          backgroundColor: t.surface(),
        },
        elevation1: { backgroundColor: t.surfaceRaised() },
      },
};