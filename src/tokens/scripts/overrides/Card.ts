

import { t } from '../lib/tokenUtils';

export const MuiCard = {
styleOverrides: {
        root: {
          borderRadius: t.radius,
          backgroundColor: t.surfaceRaised(),
          border: `${t.borderSize}px solid ${t.divider()}`,
        },
      },
};