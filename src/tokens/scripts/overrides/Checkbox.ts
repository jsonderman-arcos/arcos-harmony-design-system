
const v = (name: string, fallback: string) => `var(--${name}, ${fallback})`;

export const MuiCheckbox = {
  styleOverrides: {
    root: {
      color: v('theme-base-text-primary', 'rgba(0,0,0,0.87)'),
      '&.Mui-checked': {
        color: v('theme-base-primary-main', 'rgba(25,118,210,1)'),
      },
      '&:hover': {
        backgroundColor: v('theme-base-primary-states-hover', 'rgba(25,118,210,0.04)'),
      },
      '&.Mui-disabled': {
        color: v('theme-base-action-disabled', 'rgba(0,0,0,0.38)'),
      },
      '&:focus-visible': {
        outline: `2px solid ${v('theme-base-primary-focus-ring', '#1976d2')}`,
        outlineOffset: 2,
        borderRadius: '4px',
      },
    },
  },
};