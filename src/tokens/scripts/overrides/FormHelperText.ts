import { t } from '../lib/tokenUtils';

export function MuiFormHelperText(t:any) {
  return {
    styleOverrides: {
      root: {
        color: t.textSecondary(),
        backgroundColor: 'transparent',
      },
  },
};
}