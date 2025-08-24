import { t } from '../lib/tokenUtils';

export const MuiTab = {
  styleOverrides: {
        root: {
          //textTransform: 'none',
          color: t.textSecondary(),
          '&.Mui-selected': { color: t.primaryMain() },
          '&:hover': { backgroundColor: t.actionHover() },
          '&:focus-visible': {
            outline: `${Math.max(2, t.borderSize)}px solid ${t.primaryFocusRing() || t.focusRing()}`,
            outlineOffset: 2,
            borderRadius: t.radius,
          },
        },
      },
};