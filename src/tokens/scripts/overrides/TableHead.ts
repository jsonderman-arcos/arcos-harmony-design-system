

import { t } from '../lib/tokenUtils';

export const MuiTableHead = {
  styleOverrides: {
          root: {
            backgroundColor: t.surfaceRaised(),
            '& .MuiTableCell-head': {
              color: t.textSecondary(),
              borderBottom: `${t.borderSize()}px solid ${t.divider()}`,
            },
          },
        },
};