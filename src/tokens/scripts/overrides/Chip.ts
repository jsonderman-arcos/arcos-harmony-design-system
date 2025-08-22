

import { t } from '../lib/tokenUtils';

export const MuiChip = {
   styleOverrides: {
        root: {
          borderRadius: t.radius,
          border: `${t.borderSize}px solid ${t.divider()}`,
          backgroundColor: t.surfaceRaised(),
          '&.MuiChip-colorPrimary': {
            backgroundColor: t.primarySelected(),
            color: t.primaryDark(),
          },
        },
      },
};