import { t } from '../lib/tokenUtils';

export function MuiFormLabel(t: any) {
  return {
    styleOverrides: {
      root: {
        color: t.textSecondary ? t.textSecondary() : t('theme-base-text-secondary'),
        fontWeight: 500,
        fontSize: '1rem',
        // Add more style properties as needed, or use label-specific tokens if available
      },
      asterisk: {
        color: t.primaryMain ? t.primaryMain() : t('theme-base-primary-main'),
      },
      // Add other overrides if needed
    },
  };
}