const v = (name: string, fallback: string) => `var(--${name}, ${fallback})`;

export function MuiFormLabel(t: any) {
  return {
    styleOverrides: {
      root: {
        color: v('theme-base-text-secondary', 'rgba(0,0,0,0.6)'),
        fontWeight: 500,
        fontSize: '1rem',
        // Add more style properties as needed, or use label-specific tokens if available
      },
      asterisk: {
        color: v('theme-base-primary-main', 'rgba(25,118,210,1)'),
      },
      // Add other overrides if needed
    },
  };
}