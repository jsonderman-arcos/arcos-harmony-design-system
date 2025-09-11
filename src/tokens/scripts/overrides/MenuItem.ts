import { t } from '../lib/tokenUtils';

export const MuiMenuItem = {
  styleOverrides: {
    root: {
      borderRadius: t.radius,
      textTransform: 'none',
      color: t.textPrimary ? t.textPrimary() : 'rgba(33,33,33,1)',
      backgroundColor: t.inputWhiteBg ? t.inputWhiteBg() : 'rgba(255,255,255,1)',
      '&:hover': {
        backgroundColor: t.actionHover ? t.actionHover() : 'rgba(0,0,0,0.04)',
      },
      '&.Mui-selected': {
        backgroundColor: t.primaryMain ? t.primaryMain() : 'rgba(50,98,141,1)',
        color: t.onPrimary ? t.onPrimary() : '#fff',
        '&:hover': {
          backgroundColor: t.primaryDark ? t.primaryDark() : 'rgba(33,66,99,1)',
        },
      },
      '&.Mui-disabled': {
        color: t.textDisabled ? t.textDisabled() : 'rgba(0,0,0,0.38)',
        backgroundColor: t.actionDisabledBg ? t.actionDisabledBg() : 'rgba(0,0,0,0.12)',
      },
      '&:focus-visible': {
        outline: `${Math.max(2, t.borderSize)}px solid ${t.primaryFocusRing ? t.primaryFocusRing() : t.focusRing ? t.focusRing() : '#1976d2'}`,
        outlineOffset: 2,
      },
    },
  },
};