

import { t } from '../lib/tokenUtils';

export const MuiOutlinedInput = {
      styleOverrides: {
        root: {
          borderRadius: t.radius,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: t.primaryMain(),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: t.primaryMain(),
            boxShadow: `0 0 0 3px ${t.primaryFocusRing() || t.focusRing()}`,
          },
        },
        notchedOutline: {
          borderColor: t.divider(),
          borderWidth: t.borderSize,
        },
        input: {
          color: t.textPrimary(),
          '&::placeholder': { color: t.textSecondary() },
        },
      },
};