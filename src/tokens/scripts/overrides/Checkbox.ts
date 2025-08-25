

import { t } from '../lib/tokenUtils';

export const MuiCheckbox = {
  styleOverrides: {
        root: {
          color: t.textSecondary(),
          '&.Mui-checked': { color: t.primaryMain() },
          '&:hover': { backgroundColor: t.primaryHover() },
          '&.Mui-disabled': { color: t.actionDisabled() },
          '&:focus-visible': {
            outline: `${Math.max(2, t.borderSize)}px solid ${t.primaryFocusRing() || t.focusRing()}`,
            outlineOffset: 2,
            borderRadius: t.radius,
          },
        },
      },
};