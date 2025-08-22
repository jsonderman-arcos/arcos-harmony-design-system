import { t } from '../lib/tokenUtils';

export function MuiButton(t: any) {
  return {
    styleOverrides: {
      root: {
        borderRadius: t.radius,
        '&:focus-visible': {
          outline: `${Math.max(2, t.borderSize)}px solid ${t.primaryFocusRing() || t.focusRing()}`,
          outlineOffset: 2,
        },
      },
      containedPrimary: {
        backgroundColor: t.primaryMain(),
        color: t.onPrimary(),
        '&:hover': { backgroundColor: t.primaryDark(), boxShadow: 'none' },
        '&:active': { backgroundColor: t.primaryDark() },
        '&.Mui-disabled': {
          color: t.actionDisabled(),
          backgroundColor: t.actionDisabledBg(),
        },
      },
      outlinedPrimary: {
        borderColor: t.primaryMain(),
        color: t.primaryMain(),
        '&:hover': { backgroundColor: t.primaryHover() },
      },
      textPrimary: {
        color: t.primaryMain(),
        '&:hover': { backgroundColor: t.primaryHover() },
      },
    },
  };
}