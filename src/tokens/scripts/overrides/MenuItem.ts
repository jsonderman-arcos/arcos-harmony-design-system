const v = (name: string, fallback: string) => `var(--${name}, ${fallback})`;

export function MuiMenuItem(_t: any) {
  return {
    styleOverrides: {
      root: {
        borderRadius: _t?.radius ?? '4px',
        textTransform: 'none',
        color: v('theme-base-text-primary', 'rgba(33,33,33,1)'),
        backgroundColor: v('theme-base-components-input-outlined-background-fill', 'rgba(255,255,255,1)'),
        '&:hover': {
          backgroundColor: v('theme-base-action-hover', 'rgba(0,0,0,0.04)'),
        },
        '&.Mui-selected': {
          backgroundColor: v('theme-base-primary-main', 'rgba(50,98,141,1)'),
          color: v('theme-base-on-primary', '#fff'),
          '&:hover': {
            backgroundColor: v('theme-base-primary-dark', 'rgba(33,66,99,1)'),
          },
        },
        '&.Mui-disabled': {
          color: v('theme-base-action-disabled', 'rgba(0,0,0,0.38)'),
          backgroundColor: v('theme-base-action-disabled-background', 'rgba(0,0,0,0.12)'),
        },
        '&:focus-visible': {
          outline: `2px solid ${v('theme-base-primary-focus-ring', '#1976d2')}`,
          outlineOffset: 2,
        },
      },
    },
  };
}