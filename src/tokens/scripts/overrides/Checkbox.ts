const v = (name: string, fallback: string) => `var(--${name}, ${fallback})`;

export function MuiCheckbox(_t: any) {
  return {
    styleOverrides: {
      root: {
        // --- DEFAULT (no color prop) ---
        // Unselected box should use base-action-selected
        color: v('theme-base-text-primary', 'rgba(0,0,0,0.56)'),

      // Ensure the SVG paints from currentColor so state rules below apply
      '& .MuiSvgIcon-root': { color: 'inherit' },
      //'& .MuiSvgIcon-root path': { fill: 'currentColor', stroke: 'currentColor' },

      // Hover background (use primary token family by default)
      '&:hover': {
        backgroundColor: v('theme-base-primary-states-hover', 'rgba(25,118,210,0.04)'),
      },

      // Disabled
      '&.Mui-disabled': {
        color: v('theme-base-action-disabled', 'rgba(0,0,0,0.38)'),
      },

      // Focus ring
      '&:focus-visible': {
        outline: `2px solid ${v('theme-base-primary-focus-ring', '#1976d2')}`,
        outlineOffset: 2,
        borderRadius: '4px',
      },

      // Selected/Indeterminate (default): primary main
      '&.Mui-checked, &.MuiCheckbox-indeterminate': {
        color: v('theme-base-primary-main', 'rgba(25,118,210,1)'),
      },

      // --- PRIMARY VARIANT ---
      '&.MuiCheckbox-colorPrimary': {
        // Unselected and selected both use primary main
        color: v('theme-base-primary-main', 'rgba(25,118,210,1)'),
        '&.Mui-checked, &.MuiCheckbox-indeterminate': {
          color: v('theme-base-primary-main', 'rgba(25,118,210,1)'),
        },
        '&:hover': {
          backgroundColor: v('theme-base-primary-states-hover', 'rgba(25,118,210,0.04)'),
        },
      },

      // --- SECONDARY VARIANT ---
      '&.MuiCheckbox-colorSecondary': {
        color: v('theme-base-secondary-main', 'rgba(156,39,176,1)'),
        '&.Mui-checked, &.MuiCheckbox-indeterminate': {
          color: v('theme-base-secondary-main', 'rgba(156,39,176,1)'),
        },
        '&:hover': {
          backgroundColor: v('theme-base-secondary-states-hover', 'rgba(156,39,176,0.04)'),
        },
      },

      // --- FEEDBACK VARIANTS ---
      '&.MuiCheckbox-colorError': {
        color: v('theme-base-feedback-error-main', 'rgba(211,47,47,1)'),
        '&.Mui-checked, &.MuiCheckbox-indeterminate': {
          color: v('theme-base-feedback-error-main', 'rgba(211,47,47,1)'),
        },
        '&:hover': {
          backgroundColor: v('theme-base-feedback-error-states-hover', 'rgba(211,47,47,0.08)'),
        },
      },
      '&.MuiCheckbox-colorWarning': {
        color: v('theme-base-feedback-warning-main', 'rgba(237,108,2,1)'),
        '&.Mui-checked, &.MuiCheckbox-indeterminate': {
          color: v('theme-base-feedback-warning-main', 'rgba(237,108,2,1)'),
        },
        '&:hover': {
          backgroundColor: v('theme-base-feedback-warning-states-hover', 'rgba(237,108,2,0.08)'),
        },
      },
      '&.MuiCheckbox-colorInfo': {
        color: v('theme-base-feedback-info-main', 'rgba(2,136,209,1)'),
        '&.Mui-checked, &.MuiCheckbox-indeterminate': {
          color: v('theme-base-feedback-info-main', 'rgba(2,136,209,1)'),
        },
        '&:hover': {
          backgroundColor: v('theme-base-feedback-info-states-hover', 'rgba(2,136,209,0.08)'),
        },
      },
      '&.MuiCheckbox-colorSuccess': {
        color: v('theme-base-feedback-success-main', 'rgba(46,125,50,1)'),
        '&.Mui-checked, &.MuiCheckbox-indeterminate': {
          color: v('theme-base-feedback-success-main', 'rgba(46,125,50,1)'),
        },
        '&:hover': {
          backgroundColor: v('theme-base-feedback-success-states-hover', 'rgba(46,125,50,0.08)'),
        },
      },
    },
  },
};
}
