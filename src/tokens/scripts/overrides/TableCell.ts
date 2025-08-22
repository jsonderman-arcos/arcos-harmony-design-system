

import { t } from '../lib/tokenUtils';

export const MuiTableCell = {
 styleOverrides: {
        root: {
          borderBottom: `${t.borderSize}px solid ${t.divider()}`,
          color: t.textPrimary(),
        },
      },
};