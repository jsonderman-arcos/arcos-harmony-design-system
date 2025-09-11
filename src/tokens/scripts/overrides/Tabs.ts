import { t } from '../lib/tokenUtils';

export const MuiTabs = {
  styleOverrides: {
    root: {
      backgroundColor: 'transparent',
      minHeight: 48,
      borderBottom: `${t.borderSize}px solid ${t.divider ? t.divider() : '#e0e0e0'}`,
    },
    indicator: {
      height: 3,
      borderRadius: 2,
      backgroundColor: t.primaryMain ? t.primaryMain() : '#1976d2',
    },
    scrollButtons: {
      color: t.textSecondary ? t.textSecondary() : 'rgba(0,0,0,0.54)',
      '&.Mui-disabled': {
        opacity: 0.3,
      },
    },
    flexContainer: {
      minHeight: 48,
    },
  },
};