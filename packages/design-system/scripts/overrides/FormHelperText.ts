
const v = (name: string, fallback: string) => `var(--${name}, ${fallback})`;

export function MuiFormHelperText(_t: any) {
  return {
    styleOverrides: {
      root: {
        color: v('theme-base-text-secondary', 'rgba(0,0,0,0.6)'),
        backgroundColor: 'transparent',
      },
    },
  };
}