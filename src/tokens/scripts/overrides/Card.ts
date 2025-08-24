import { t } from '../lib/tokenUtils';

export function MuiCard (t: any) {
  return {
    styleOverrides: {
        root: {
          borderRadius: t.radius,
          backgroundColor: t.surfaceRaised(),
          border: `${t.borderSize}px solid ${t.divider()}`,
        },
      },
}
};