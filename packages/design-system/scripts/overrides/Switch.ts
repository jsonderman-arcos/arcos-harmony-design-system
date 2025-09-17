export function MuiSwitch(t: any) {
  const v = (name: string, fallback: string) => `var(--${name}, ${fallback})`;

  // Palette CSS variables with sensible fallbacks
  const primary = v('theme-base-palette-primary-main', '#1976d2');
  const secondary = v('theme-base-palette-secondary-main', '#9c27b0');
  const error = v('theme-base-palette-error-main', '#d32f2f');
  const warning = v('theme-base-palette-warning-main', '#ffa726');
  const info = v('theme-base-palette-info-main', '#0288d1');
  const success = v('theme-base-palette-success-main', '#388e3c');

  const disabled = v('theme-base-action-disabled', 'rgba(0,0,0,0.38)');
  const disabledBg = v('theme-base-action-disabled-bg', 'rgba(0,0,0,0.12)');
  const thumbBg = v('theme-base-input-white-bg', '#fff');

  // Helper to create semi-transparent track color using CSS vars
  const mix = (cssVarWithFallback: string, pct = 50) =>
    `color-mix(in srgb, ${cssVarWithFallback} ${pct}%, transparent)`;

  return {
    styleOverrides: {
      switchBase: {
        // Primary (default)
        '&.MuiSwitch-colorPrimary.Mui-checked': {
          color: primary,
          '& + .MuiSwitch-track': {
            backgroundColor: mix(primary, 50),
          },
          '& .MuiSwitch-thumb': {
            backgroundColor: primary,
          },
        },

        // Secondary
        '&.MuiSwitch-colorSecondary.Mui-checked': {
          color: secondary,
          '& + .MuiSwitch-track': {
            backgroundColor: mix(secondary, 50),
          },
          '& .MuiSwitch-thumb': {
            backgroundColor: secondary,
          },
        },

        // Error
        '&.MuiSwitch-colorError.Mui-checked': {
          color: error,
          '& + .MuiSwitch-track': {
            backgroundColor: mix(error, 50),
          },
          '& .MuiSwitch-thumb': {
            backgroundColor: error,
          },
        },

        // Warning
        '&.MuiSwitch-colorWarning.Mui-checked': {
          color: warning,
          '& + .MuiSwitch-track': {
            backgroundColor: mix(warning, 50),
          },
          '& .MuiSwitch-thumb': {
            backgroundColor: warning,
          },
        },

        // Info
        '&.MuiSwitch-colorInfo.Mui-checked': {
          color: info,
          '& + .MuiSwitch-track': {
            backgroundColor: mix(info, 50),
          },
          '& .MuiSwitch-thumb': {
            backgroundColor: info,
          },
        },

        // Success
        '&.MuiSwitch-colorSuccess.Mui-checked': {
          color: success,
          '& + .MuiSwitch-track': {
            backgroundColor: mix(success, 50),
          },
          '& .MuiSwitch-thumb': {
            backgroundColor: success,
          },
        },

        // Disabled states
        '&.Mui-disabled': {
          color: disabled,
        },
        '&.Mui-checked.Mui-disabled': {
          color: disabled,
          '& + .MuiSwitch-track': {
            opacity: 0.5,
          },
        },
      },

      thumb: {
        // Unchecked thumb color
        backgroundColor: thumbBg,
      },

      track: {
        // Unchecked track color
        backgroundColor: disabledBg,
      },
    },
  };
}
