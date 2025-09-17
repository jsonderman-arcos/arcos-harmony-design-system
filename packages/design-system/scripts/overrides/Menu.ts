const v = (name: string, fallback: string) => `var(--${name}, ${fallback})`;

export function MuiMenu(_t:any) {
  return {
  styleOverrides: {
    paper: {
      borderRadius: _t?.radius ?? '4px',
      backgroundColor: v('theme-base-components-input-outlined-background-fill', 'rgba(255,255,255,1)'),
      boxShadow: _t.paperBackgroundForElevation ? _t.paperBackgroundForElevation(2) : undefined,
      minWidth: 160,
      padding: '4px 0',
      // Add more overrides as needed from your mui-theme.json
    },
    list: {
      color: v('theme-base-text-primary', 'rgba(0,0,0,0.87)'),
      paddingTop: _t.spacingBy('core-spacing-spacing-2xs'),
      paddingBottom: _t.spacingBy('core-spacing-spacing-2xs'),
      paddingLeft: _t.spacingBy('core-spacing-spacing-sm'),
      paddingRight: _t.spacingBy('core-spacing-spacing-sm'),
    },
  },
}
}