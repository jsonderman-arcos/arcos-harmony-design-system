import { t } from '../lib/tokenUtils';

export function MuiMenu(t:any) {
  return {
  styleOverrides: {
    paper: {
      borderRadius: t.radius,
      backgroundColor: t.inputWhiteBg ? t.inputWhiteBg() : 'rgba(255,255,255,1)',
      boxShadow: t.paperBackgroundForElevation ? t.paperBackgroundForElevation(2) : undefined,
      minWidth: 160,
      padding: '4px 0',
      // Add more overrides as needed from your mui-theme.json
    },
    list: {
      paddingTop: t.spacingBy('core-spacing-spacing-2xs'),
      paddingBottom: t.spacingBy('core-spacing-spacing-2xs'),
      paddingLeft: t.spacingBy('core-spacing-spacing-sm'),
      paddingRight: t.spacingBy('core-spacing-spacing-sm'),
    },
  },
}
}