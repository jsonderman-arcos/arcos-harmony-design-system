
const v = (name: string, fallback: string) => `var(--${name}, ${fallback})`;

export function MuiFormControl() {
  return {
    styleOverrides: {
      root: {
        backgroundColor: 'transparent',
        color: v('theme-base-text-primary', 'rgba(0,0,0,0.87)'),
        borderRadius: '4px',
      },
    },
  };
}