

import { t } from '../lib/tokenUtils';

export const MuiSelect = {
   styleOverrides: {
        select: { '&:focus': { backgroundColor: 'transparent' } },
        icon: { color: t.textSecondary() },
      },
};