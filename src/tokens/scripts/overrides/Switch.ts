export function MuiSwitch(t: any) {
  const toAlpha = (c: string, alpha = 0.5) => {
    // rgba(r,g,b,a)
    const rgba = c.match(/^rgba?\(([^)]+)\)$/i);
    if (rgba) {
      const parts = rgba[1].split(',').map(s => s.trim());
      const [r, g, b] = parts.map((p, i) => (i < 3 ? parseInt(p, 10) : p));
      if (Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)) {
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    }
    // #rrggbb
    const hex = c.match(/^#([0-9a-f]{6})$/i);
    if (hex) {
      const n = parseInt(hex[1], 16);
      const r = (n >> 16) & 255;
      const g = (n >> 8) & 255;
      const b = n & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    // Fallback: return original; caller may also set opacity
    return c;
  };
  return {
    styleOverrides: {
      switchBase: {
        // No generic color application; handle per-color so `color` prop works

        // Primary (default)
        '&.MuiSwitch-colorPrimary.Mui-checked': {
          color: t.primaryMain ? t.primaryMain() : '#1976d2',
          '& + .MuiSwitch-track': {
            backgroundColor: toAlpha(t.primaryMain ? t.primaryMain() : '#1976d2', 0.5),
          },
          '& .MuiSwitch-thumb': {
            backgroundColor: t.primaryMain ? t.primaryMain() : '#1976d2',
          },
        },

        // Secondary
        '&.MuiSwitch-colorSecondary.Mui-checked': {
          color: t.secondaryMain ? t.secondaryMain() : '#9c27b0',
          '& + .MuiSwitch-track': {
            backgroundColor: toAlpha(t.secondaryMain ? t.secondaryMain() : '#9c27b0', 0.5),
          },
          '& .MuiSwitch-thumb': {
            backgroundColor: t.secondaryMain ? t.secondaryMain() : '#9c27b0',
          },
        },

        // Error
        '&.MuiSwitch-colorError.Mui-checked': {
          color: t.errorMain ? t.errorMain() : '#d32f2f',
          '& + .MuiSwitch-track': {
            backgroundColor: toAlpha(t.errorMain ? t.errorMain() : '#d32f2f', 0.5),
          },
          '& .MuiSwitch-thumb': {
            backgroundColor: t.errorMain ? t.errorMain() : '#d32f2f',
          },
        },

        // Warning
        '&.MuiSwitch-colorWarning.Mui-checked': {
          color: t.warningMain ? t.warningMain() : '#ffa726',
          '& + .MuiSwitch-track': {
            backgroundColor: toAlpha(t.warningMain ? t.warningMain() : '#ffa726', 0.5),
          },
          '& .MuiSwitch-thumb': {
            backgroundColor: t.warningMain ? t.warningMain() : '#ffa726',
          },
        },

        // Info
        '&.MuiSwitch-colorInfo.Mui-checked': {
          color: t.infoMain ? t.infoMain() : '#0288d1',
          '& + .MuiSwitch-track': {
            backgroundColor: toAlpha(t.infoMain ? t.infoMain() : '#0288d1', 0.5),
          },
          '& .MuiSwitch-thumb': {
            backgroundColor: t.infoMain ? t.infoMain() : '#0288d1',
          },
        },

        // Success
        '&.MuiSwitch-colorSuccess.Mui-checked': {
          color: t.successMain ? t.successMain() : '#388e3c',
          '& + .MuiSwitch-track': {
            backgroundColor: toAlpha(t.successMain ? t.successMain() : '#388e3c', 0.5),
          },
          '& .MuiSwitch-thumb': {
            backgroundColor: t.successMain ? t.successMain() : '#388e3c',
          },
        },
        '&.Mui-disabled': {
          color: t.actionDisabled ? t.actionDisabled() : 'rgba(0,0,0,0.38)',
        },
        '&.Mui-checked.Mui-disabled': {
          color: t.actionDisabled ? t.actionDisabled() : 'rgba(0,0,0,0.38)',
          '& + .MuiSwitch-track': {
            opacity: 0.5,
          },
        },
      },
      thumb: {
        // Unchecked thumb color
        backgroundColor: t.inputWhiteBg ? t.inputWhiteBg() : '#fff',
      },
      track: {
        // Unchecked track color
        backgroundColor: t.actionDisabledBg ? t.actionDisabledBg() : 'rgba(0,0,0,0.12)',
      },
    },
  };
}
