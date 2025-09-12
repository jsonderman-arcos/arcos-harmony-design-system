
const v = (name: string, fallback: string) => `var(--${name}, ${fallback})`;

export function MuiTabs(_t: any) {
  return {
    styleOverrides: {
      root: {
        backgroundColor: 'transparent',
        minHeight: 48,
        borderBottom: `${_t?.borderSize ?? 1}px solid ${v('theme-base-divider','rgba(0,0,0,0.12)')}`,
    },
    indicator: {
      height: 3,
      borderRadius: 2,
      backgroundColor: v('theme-base-primary-main', '#1976d2'),
    },
    scrollButtons: {
      color: v('theme-base-text-primary', 'rgba(0,0,0,0.87)'),
      '&.Mui-disabled': {
        opacity: 0.3,
      },
    },
    flexContainer: {
      minHeight: 48,
    },
  },
}
}