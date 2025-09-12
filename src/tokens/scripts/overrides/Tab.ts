import { t } from '../lib/tokenUtils';

export function MuiTab(t:any) {
  return {
    styleOverrides: {
      root: {
        //textTransform: 'none',
        color: t.textSecondary(),
        '&.Mui-selected': { color: t.primaryMain() },
          '&:hover': { backgroundColor: t.actionHover() },
          '&:focus-visible': {
            outline: `${Math.max(2, t.borderSize)}px solid ${t.primaryFocusRing() || t.focusRing()}`,
            outlineOffset: 2,
            borderRadius: 0,
          },
        },
      },
}
}