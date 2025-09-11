import { t } from '../lib/tokenUtils';

export const MuiSelect = {
  styleOverrides: {
    select: {
      '&:focus': { backgroundColor: 'transparent' },
  color: t.textPrimary ? t.textPrimary() : 'rgba(33,33,33,1)',
  backgroundColor: t.inputWhiteBg ? t.inputWhiteBg() : 'rgba(255,255,255,1)',
      '&.Mui-disabled': {
  color: t.textDisabled ? t.textDisabled() : 'rgba(0,0,0,0.38)',
  backgroundColor: t.actionDisabledBg ? t.actionDisabledBg() : 'rgba(0,0,0,0.12)',
      },
    },
    icon: {
  color: t.textSecondary ? t.textSecondary() : 'rgba(0,0,0,0.54)',
    },
  },
};