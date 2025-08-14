/**
 * Button Theme Token Mapping
 * 
 * This file provides a reference for mapping MUI Button theme properties to design token names.
 * It follows the structure of basic-theme.json but replaces concrete values with token references.
 * All token references use dot notation (Base.primary.contrast-text) for better consistency
 * with token definitions and easier searching.
 * 
 * Use this as a reference when updating theme.json or when creating MUI button themes.
 */

// Export the theme mapping as a JavaScript object
module.exports = {
  colorSchemes: {},
  shadows: [
    "none",
    "0px 2px 1px -1px {lighthouse.effects.shadow-level-1}, 0px 1px 1px 0px {lighthouse.effects.shadow-level-2}, 0px 1px 3px 0px {lighthouse.effects.shadow-level-3}",
    "0px 3px 3px -2px {lighthouse.effects.shadow-level-1}, 0px 3px 4px 0px {lighthouse.effects.shadow-level-2}, 0px 1px 8px 0px {lighthouse.effects.shadow-level-3}",
    "0px 3px 5px -1px {lighthouse.effects.shadow-level-1}, 0px 6px 10px 0px {lighthouse.effects.shadow-level-2}, 0px 1px 18px 0px {lighthouse.effects.shadow-level-3}",
    "0px 5px 5px -3px {lighthouse.effects.shadow-level-1}, 0px 8px 10px 1px {lighthouse.effects.shadow-level-2}, 0px 3px 14px 2px {lighthouse.effects.shadow-level-3}",
    "0px 7px 8px -4px {lighthouse.effects.shadow-level-1}, 0px 12px 17px 2px {lighthouse.effects.shadow-level-2}, 0px 5px 22px 4px {lighthouse.effects.shadow-level-3}"
  ],
  typography: {
    fontFamily: "{lighthouse.typography.fontfamily-base}, Helvetica, Arial, sans-serif",
    fontSize: "{lighthouse.typography.fontsize-base}",
    fontWeightLight: "{lighthouse.typography.fontweight-light}",
    fontWeightRegular: "{lighthouse.typography.fontweight-regular}",
    fontWeightMedium: "{lighthouse.typography.fontweight-medium}",
    fontWeightBold: "{lighthouse.typography.fontweight-bold}",
    h1: {
      fontFamily: "{lighthouse.typography.fontfamily-base}, Helvetica, Arial, sans-serif",
      fontWeight: "{lighthouse.typography.fontweight-medium}",
      fontSize: "{lighthouse.typography.fontsize-4xl}",
      lineHeight: 1.2,
      letterSpacing: "-0.01562em"
    },
    h2: {
      fontFamily: "{lighthouse.typography.fontfamily-base}, Helvetica, Arial, sans-serif",
      fontWeight: "{lighthouse.typography.fontweight-medium}",
      fontSize: "{lighthouse.typography.fontsize-3xl}",
      lineHeight: 1.2,
      letterSpacing: "-0.00833em"
    },
    h3: {
      fontFamily: "{lighthouse.typography.fontfamily-base}, Helvetica, Arial, sans-serif",
      fontWeight: "{lighthouse.typography.fontweight-medium}",
      fontSize: "{lighthouse.typography.fontsize-2xl}",
      lineHeight: 1.25,
      letterSpacing: "0em"
    },
    h4: {
      fontFamily: "{lighthouse.typography.fontfamily-base}, Helvetica, Arial, sans-serif",
      fontWeight: "{lighthouse.typography.fontweight-medium}",
      fontSize: "{lighthouse.typography.fontsize-xl}",
      lineHeight: 1.3,
      letterSpacing: "0.00735em"
    },
    h5: {
      fontFamily: "{lighthouse.typography.fontfamily-base}, Helvetica, Arial, sans-serif",
      fontWeight: "{lighthouse.typography.fontweight-medium}",
      fontSize: "{lighthouse.typography.fontsize-lg}",
      lineHeight: 1.35,
      letterSpacing: "0em"
    },
    h6: {
      fontFamily: "{lighthouse.typography.fontfamily-base}, Helvetica, Arial, sans-serif",
      fontWeight: "{lighthouse.typography.fontweight-medium}",
      fontSize: "{lighthouse.typography.fontsize-md}",
      lineHeight: 1.4,
      letterSpacing: "0.0075em"
    },
    subtitle1: {
      fontFamily: "{lighthouse.typography.fontfamily-base}, Helvetica, Arial, sans-serif",
      fontWeight: "{lighthouse.typography.fontweight-regular}",
      fontSize: "{lighthouse.typography.fontsize-base}",
      lineHeight: 1.5,
      letterSpacing: "0.00938em"
    },
    subtitle2: {
      fontFamily: "{lighthouse.typography.fontfamily-base}, Helvetica, Arial, sans-serif",
      fontWeight: "{lighthouse.typography.fontweight-medium}",
      fontSize: "{lighthouse.typography.fontsize-sm}",
      lineHeight: 1.5,
      letterSpacing: "0.00714em"
    },
    body1: {
      fontFamily: "{lighthouse.typography.fontfamily-base}, Helvetica, Arial, sans-serif",
      fontWeight: "{lighthouse.typography.fontweight-regular}",
      fontSize: "{lighthouse.typography.fontsize-base}",
      lineHeight: 1.5,
      letterSpacing: "0.00938em"
    },
    body2: {
      fontFamily: "{lighthouse.typography.fontfamily-base}, Helvetica, Arial, sans-serif",
      fontWeight: "{lighthouse.typography.fontweight-regular}",
      fontSize: "{lighthouse.typography.fontsize-sm}",
      lineHeight: 1.5,
      letterSpacing: "0.01071em"
    },
    button: {
      fontFamily: "{lighthouse.typography.fontfamily-base}, Helvetica, Arial, sans-serif",
      fontWeight: "{lighthouse.typography.fontweight-medium}",
      fontSize: "{lighthouse.typography.fontsize-base}",
      lineHeight: 1.625,
      letterSpacing: "0.02857em",
      textTransform: "none"
    },
    caption: {
      fontFamily: "{lighthouse.typography.fontfamily-base}, Helvetica, Arial, sans-serif",
      fontWeight: "{lighthouse.typography.fontweight-regular}",
      fontSize: "{lighthouse.typography.fontsize-xs}",
      lineHeight: 1.4,
      letterSpacing: "0.03333em"
    },
    overline: {
      fontFamily: "{lighthouse.typography.fontfamily-base}, Helvetica, Arial, sans-serif",
      fontWeight: "{lighthouse.typography.fontweight-regular}",
      fontSize: "{lighthouse.typography.fontsize-2xs}",
      lineHeight: 2.66,
      letterSpacing: "0.08333em",
      textTransform: "uppercase"
    }
  },
  spacing: [
    "{spacing.spacing-none}",
    "{spacing.spacing-3xs}",
    "{spacing.spacing-2xs}",
    "{spacing.spacing-xs}",
    "{spacing.spacing-sm}",
    "{spacing.spacing-sm-md}",
    "{spacing.spacing-md}",
    "{spacing.spacing-lg}",
    "{spacing.spacing-xl}",
    "{spacing.spacing-2xl}"
  ],
  breakpoints: {
    values: {
      xs: 0,
      sm: "{breakpoints.breakpoint-sm}",
      md: "{breakpoints.breakpoint-md}",
      lg: "{breakpoints.breakpoint-lg}",
      xl: "{breakpoints.breakpoint-xl}"
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Large Contained Primary Button
          "&.MuiButton-sizeLarge.MuiButton-containedPrimary": {
            fontFeatureSettings: "'liga' off, 'clig' off",
            fontFamily: "Arial, Helvetica, Arial, sans-serif",
            fontSize: "1rem",
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight: "26px /* 162.5% */",
            letterSpacing: "0.46px",
            textTransform: "none",
            padding: "{Components.button.button-padding-vertical} {Components.button.button-padding-horizontal}",
            borderRadius: "{radii.border-radius}",
            opacity: "1",
            boxShadow: "none",
            // Enabled state
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              color: "{Base.primary.contrast-text}",
              background: "{Base.primary.main}",
              "& .MuiTouchRipple-root": {
                width: "80px",
                height: "42px",
                opacity: "0.3",
                background: "{Base.primary.contrast-text}",
                padding: "0",
                borderRadius: "0",
                boxShadow: "none"
              }
            },
            // Focus state
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              color: "{Base.primary.contrast-text}",
              background: "{Base.primary.main}",
              "& .MuiTouchRipple-root": {
                width: "58.901px",
                height: "54px",
                borderRadius: "100px",
                opacity: "0.3",
                background: "{Base.primary.contrast-text}",
                padding: "0",
                boxShadow: "none"
              }
            },
            // Hover state
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "{Base.primary.dark}",
              color: "{Base.primary.contrast-text}"
            },
            // Disabled state
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              color: "{Base.action.disabled}",
              background: "{Base.action.disabledBackground}",
              "& .MuiTouchRipple-root": {
                width: "80px",
                height: "42px",
                opacity: "0.3",
                background: "{Base.action.disabled}",
                padding: "0",
                borderRadius: "0",
                boxShadow: "none"
              }
            }
          },
          // Large Contained Inherit Button
          "&.MuiButton-sizeLarge.MuiButton-containedInherit": {
            fontFeatureSettings: "'liga' off, 'clig' off",
            fontFamily: "Arial, Helvetica, Arial, sans-serif",
            fontSize: "1rem",
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight: "26px /* 162.5% */",
            letterSpacing: "0.46px",
            textTransform: "none",
            padding: "{Components.button.button-padding-vertical} {Components.button.button-padding-horizontal}",
            borderRadius: "{radii.border-radius}",
            opacity: "1",
            boxShadow: "none",
            // Enabled state
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              color: "rgba(0, 0, 0, 0.87)",
              background: "#fff",
              "& .MuiTouchRipple-root": {
                width: "80px",
                height: "42px",
                opacity: "0.3",
                background: "rgba(0, 0, 0, 0.87)",
                padding: "0",
                borderRadius: "0",
                boxShadow: "none"
              }
            },
            // Focus state
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              color: "rgba(0, 0, 0, 0.87)",
              background: "#fff",
              "& .MuiTouchRipple-root": {
                width: "58.901px",
                height: "54px",
                borderRadius: "100px",
                opacity: "0.3",
                background: "rgba(0, 0, 0, 0.87)",
                padding: "0",
                boxShadow: "none"
              }
            },
            // Hover state
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "#F5F5F5",
              color: "rgba(0, 0, 0, 0.87)"
            },
            // Disabled state
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              color: "{Base.action.disabled}",
              background: "{Base.action.disabledBackground}",
              "& .MuiTouchRipple-root": {
                width: "80px",
                height: "42px",
                opacity: "0.3",
                background: "{Base.action.disabled}",
                padding: "0",
                borderRadius: "0",
                boxShadow: "none"
              }
            }
          },
          // Large Contained Secondary Button
          "&.MuiButton-sizeLarge.MuiButton-containedSecondary": {
            fontFeatureSettings: "'liga' off, 'clig' off",
            fontFamily: "Arial, Helvetica, Arial, sans-serif",
            fontSize: "1rem",
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight: "26px /* 162.5% */",
            letterSpacing: "0.46px",
            textTransform: "none",
            padding: "{Components.button.button-padding-vertical} {Components.button.button-padding-horizontal}",
            borderRadius: "{radii.border-radius}",
            opacity: "1",
            boxShadow: "none",
            // Enabled state
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              color: "{Base.secondary.contrast-text}",
              background: "{Base.secondary.main}",
              "& .MuiTouchRipple-root": {
                width: "80px",
                height: "42px",
                opacity: "0.3",
                background: "{Base.secondary.contrast-text}",
                padding: "0",
                borderRadius: "0",
                boxShadow: "none"
              }
            },
            // Focus state
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              color: "{Base.secondary.contrast-text}",
              background: "{Base.secondary.main}",
              "& .MuiTouchRipple-root": {
                width: "58.901px",
                height: "54px",
                borderRadius: "100px",
                opacity: "0.3",
                background: "{Base.secondary.contrast-text}",
                padding: "0",
                boxShadow: "none"
              }
            },
            // Hover state
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "{Base.secondary.dark}",
              color: "{Base.secondary.contrast-text}"
            },
            // Disabled state
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              color: "{Base.action.disabled}",
              background: "{Base.action.disabledBackground}",
              "& .MuiTouchRipple-root": {
                width: "80px",
                height: "42px",
                opacity: "0.3",
                background: "{Base.action.disabled}",
                padding: "0",
                borderRadius: "0",
                boxShadow: "none"
              }
            }
          },
          // Large Contained Error Button
          "&.MuiButton-sizeLarge.MuiButton-containedError": {
            fontFeatureSettings: "'liga' off, 'clig' off",
            fontFamily: "Arial, Helvetica, Arial, sans-serif",
            fontSize: "1rem",
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight: "26px /* 162.5% */",
            letterSpacing: "0.46px",
            textTransform: "none",
            padding: "{Components.button.button-padding-vertical} {Components.button.button-padding-horizontal}",
            borderRadius: "{radii.border-radius}",
            opacity: "1",
            boxShadow: "none",
            // Enabled state
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              color: "{Base.error.contrast-text}",
              background: "{Base.error.main}",
              "& .MuiTouchRipple-root": {
                width: "80px",
                height: "42px",
                opacity: "0.3",
                background: "{Base.error.contrast-text}",
                padding: "0",
                borderRadius: "0",
                boxShadow: "none"
              }
            },
            // Focus state
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              color: "{Base.error.contrast-text}",
              background: "{Base.error.main}",
              "& .MuiTouchRipple-root": {
                width: "58.901px",
                height: "54px",
                borderRadius: "100px",
                opacity: "0.3",
                background: "{Base.error.contrast-text}",
                padding: "0",
                boxShadow: "none"
              }
            },
            // Hover state
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "{Base.error.dark}",
              color: "{Base.error.contrast-text}"
            },
            // Disabled state
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              color: "{Base.action.disabled}",
              background: "{Base.action.disabledBackground}",
              "& .MuiTouchRipple-root": {
                width: "80px",
                height: "42px",
                opacity: "0.3",
                background: "{Base.action.disabled}",
                padding: "0",
                borderRadius: "0",
                boxShadow: "none"
              }
            }
          },
          // Large Contained Warning Button
          "&.MuiButton-sizeLarge.MuiButton-containedWarning": {
            fontFeatureSettings: "'liga' off, 'clig' off",
            fontFamily: "Arial, Helvetica, Arial, sans-serif",
            fontSize: "1rem",
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight: "26px /* 162.5% */",
            letterSpacing: "0.46px",
            textTransform: "none",
            padding: "{Components.button.button-padding-vertical} {Components.button.button-padding-horizontal}",
            borderRadius: "{radii.border-radius}",
            opacity: "1",
            boxShadow: "none",
            // Enabled state
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              color: "{Base.warning.contrast-text}",
              background: "{Base.warning.main}",
              "& .MuiTouchRipple-root": {
                width: "80px",
                height: "42px",
                opacity: "0.3",
                background: "{Base.warning.contrast-text}",
                padding: "0",
                borderRadius: "0",
                boxShadow: "none"
              }
            },
            // Focus state
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              color: "{Base.warning.contrast-text}",
              background: "{Base.warning.main}",
              "& .MuiTouchRipple-root": {
                width: "58.901px",
                height: "54px",
                borderRadius: "100px",
                opacity: "0.3",
                background: "{Base.warning.contrast-text}",
                padding: "0",
                boxShadow: "none"
              }
            },
            // Hover state
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "{Base.warning.dark}",
              color: "{Base.warning.contrast-text}"
            },
            // Disabled state
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              color: "{Base.action.disabled}",
              background: "{Base.action.disabledBackground}",
              "& .MuiTouchRipple-root": {
                width: "80px",
                height: "42px",
                opacity: "0.3",
                background: "{Base.action.disabled}",
                padding: "0",
                borderRadius: "0",
                boxShadow: "none"
              }
            }
          },
          // Medium Contained Primary Button
          "&.MuiButton-sizeMedium.MuiButton-containedPrimary": {
            fontFamily: "Arial, Helvetica, Arial, sans-serif",
            fontSize: "0.875rem",
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight: "24px /* 171.429% */",
            letterSpacing: "0.4px",
            textTransform: "none",
            padding: "6px 16px",
            borderRadius: "{radii.border-radius}",
            opacity: "1",
            boxShadow: "none",
            // Enabled state
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              color: "{Base.primary.contrast-text}",
              background: "{Base.primary.main}",
              "& .MuiTouchRipple-root": {
                width: "80px",
                height: "42px",
                opacity: "0.3",
                background: "{Base.primary.contrast-text}",
                padding: "0",
                borderRadius: "0",
                boxShadow: "none"
              }
            },
            // Focus state
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              color: "{Base.primary.contrast-text}",
              background: "{Base.primary.main}",
              "& .MuiTouchRipple-root": {
                width: "58.901px",
                height: "54px",
                borderRadius: "100px",
                opacity: "0.3",
                background: "{Base.primary.contrast-text}",
                padding: "0",
                boxShadow: "none"
              }
            },
            // Disabled state
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              background: "{Base.action.disabledBackground}",
              color: "{Base.action.disabled}"
            },
            // Hover state
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              background: "{Base.primary.dark}",
              color: "{Base.primary.contrast-text}"
            }
          },
          // Large Outlined Primary Button
          "&.MuiButton-sizeLarge.MuiButton-outlinedPrimary": {
            fontFeatureSettings: "'liga' off, 'clig' off",
            fontFamily: "Arial, Helvetica, Arial, sans-serif",
            fontSize: "1rem",
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight: "26px /* 162.5% */",
            letterSpacing: "0.46px",
            textTransform: "none",
            padding: "{Components.button.button-padding-vertical} {Components.button.button-padding-horizontal}",
            borderRadius: "{radii.border-radius}",
            opacity: "1",
            boxShadow: "none",
            // Enabled state
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              color: "{Base.primary.main}",
              background: "transparent",
              borderColor: "{Base.primary.states.outlinedBorder}",
              borderWidth: "1px",
              borderStyle: "solid",
              "& .MuiTouchRipple-root": {
                width: "80px",
                height: "42px",
                opacity: "0.3",
                background: "{Base.primary.main}",
                padding: "0",
                borderRadius: "0",
                boxShadow: "none"
              }
            },
            // Focus state
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              color: "{Base.primary.main}",
              background: "transparent",
              borderColor: "{Base.primary.states.outlinedBorder}",
              borderWidth: "1px",
              borderStyle: "solid",
              "& .MuiTouchRipple-root": {
                width: "58.901px",
                height: "54px",
                borderRadius: "100px",
                opacity: "0.3",
                background: "{Base.primary.main}",
                padding: "0",
                boxShadow: "none"
              }
            },
            // Hover state
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              color: "{Base.primary.contrast-text}",
              background: "{Base.primary.states.hover}",
              borderColor: "{Base.primary.states.outlinedBorder}",
              borderWidth: "1px",
              borderStyle: "solid"
            },
            // Disabled state
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              color: "{Base.action.disabled}",
              background: "transparent",
              borderColor: "{Base.action.disabledBackground}",
              borderWidth: "1px",
              borderStyle: "solid",
              "& .MuiTouchRipple-root": {
                width: "80px",
                height: "42px",
                opacity: "0.3",
                background: "{Base.action.disabled}",
                padding: "0",
                borderRadius: "0",
                boxShadow: "none"
              }
            }
          },
          // Large Text Primary Button
          "&.MuiButton-sizeLarge.MuiButton-textPrimary": {
            fontFeatureSettings: "'liga' off, 'clig' off",
            fontFamily: "Arial, Helvetica, Arial, sans-serif",
            fontSize: "1rem",
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight: "26px /* 162.5% */",
            letterSpacing: "0.46px",
            textTransform: "none",
            padding: "6px 8px", // Different padding for text buttons
            borderRadius: "{radii.border-radius}",
            opacity: "1",
            boxShadow: "none",
            // Enabled state
            "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
              color: "{Base.primary.main}",
              background: "transparent",
              "& .MuiTouchRipple-root": {
                width: "80px",
                height: "42px",
                opacity: "0.3",
                background: "{Base.primary.main}",
                padding: "0",
                borderRadius: "0",
                boxShadow: "none"
              }
            },
            // Focus state
            "&:not(.Mui-disabled).Mui-focusVisible:not(:hover)": {
              color: "{Base.primary.main}",
              background: "transparent",
              "& .MuiTouchRipple-root": {
                width: "58.901px",
                height: "54px",
                borderRadius: "100px",
                opacity: "0.3",
                background: "{Base.primary.main}",
                padding: "0",
                boxShadow: "none"
              }
            },
            // Hover state
            "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {
              color: "{Base.primary.contrast-text}",
              background: "{Base.primary.states.hover}"
            },
            // Disabled state
            "&.Mui-disabled:not(.Mui-focusVisible):not(:hover)": {
              color: "{Base.action.disabled}",
              background: "transparent",
              "& .MuiTouchRipple-root": {
                width: "80px",
                height: "42px",
                opacity: "0.3",
                background: "{Base.action.disabled}",
                padding: "0",
                borderRadius: "0",
                boxShadow: "none"
              }
            }
          }
        }
      }
    }
  }
};
