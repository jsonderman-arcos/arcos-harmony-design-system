
const v = (name: string, fallback: string) => `var(--${name}, ${fallback})`;

export function MuiSelect(_t: any) {
  return {
    styleOverrides: {
      select: {
        '&:focus': { backgroundColor: 'transparent' },
        color: v('theme-base-text-primary', 'rgba(33,33,33,1)'),
        backgroundColor: v('theme-base-components-input-outlined-background-fill', 'rgba(255,255,255,1)'),
        '&.Mui-disabled': {
          color: v('theme-base-action-disabled', 'rgba(0,0,0,0.38)'),
          backgroundColor: v('theme-base-action-disabled-background', 'rgba(0,0,0,0.12)'),
        },
      },
      icon: {
        color: v('theme-base-text-secondary', 'rgba(0,0,0,0.54)'),
      },
    },
  }
}
