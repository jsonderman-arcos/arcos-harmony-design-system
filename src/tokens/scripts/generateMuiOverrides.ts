// src/theme/buildOverrides.ts
import type { Theme } from '@mui/material/styles';
import coreTokens from '@outputs/core.flat.json';
import themeTokens from '@outputs/theme.flat.json';

// prefer themeTokens, fall back to coreTokens
const TOKENS: Record<string, string> = { ...coreTokens, ...themeTokens };

/** Return the raw value of a token key (rgba/hex/px/etc). */
export function token(key: string, fallback?: string): string {
  const v = TOKENS[key];
  if (v == null || v === 'var(undefined)') return fallback ?? '';
  // Many theme tokens are aliases like "var(--core-...)" – resolve once if present
  const alias = v.match(/^var\((--[^)]+)\)$/)?.[1];
  if (alias && TOKENS[alias.replace(/^--/, '')]) {
    return TOKENS[alias.replace(/^--/, '')];
  }
  return v;
}

/** Shorthand reads for common design tokens */
const t = {
  // Base text & surfaces
  textPrimary: () => token('lighthouse--theme-base-text-primary'),
  textSecondary: () => token('lighthouse--theme-base-text-secondary'),
  textDisabled: () => token('lighthouse--theme-base-text-disabled'),
  divider: () => token('lighthouse--theme-base-divider-default'),
  surface: () => token('lighthouse--theme-base-background-paper-elevation-0'),
  surfaceRaised: () => token('lighthouse--theme-base-background-paper-elevation-1'),
  // Primary
  primaryMain: () => token('lighthouse--theme-base-primary-main'),
  primaryLight: () => token('lighthouse--theme-base-primary-light'),
  primaryDark: () => token('lighthouse--theme-base-primary-dark'),
  onPrimary: () => token('lighthouse--theme-base-primary-contrast-text'),
  primaryHover: () => token('lighthouse--theme-base-primary-states-hover'),
  primarySelected: () => token('lighthouse--theme-base-primary-states-selected'),
  primaryFocusRing: () => token('lighthouse--theme-base-primary-states-focus-visible'),
  // Secondary (if you need it)
  secondaryMain: () => token('lighthouse--theme-base-secondary-main'),
  // Focus / generic states
  focusRing: () => token('lighthouse--theme-base-text-states-focus-visible'),
  actionHover: () => token('lighthouse--theme-base-action-hover'),
  actionSelected: () => token('lighthouse--theme-base-action-selected'),
  actionDisabled: () => token('lighthouse--theme-base-action-disabled'),
  actionDisabledBg: () => token('lighthouse--theme-base-action-disabled-background'),
  // Radius / borders (fall back to 8 if missing)
  radius: () => Number(token('core-radii-border-radius', '8')),
  borderSize: () => Number(token('lighthouse--theme-base-border-size-default', '1')),
};

/** Build `theme.components` overrides */
export function buildComponentOverrides(theme: Theme) {
  const radius = t.radius();
  const borderSize = t.borderSize();

  return {
    // BUTTON
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: radius,
          textTransform: 'none',
          '&:focus-visible': {
            outline: `${Math.max(2, borderSize)}px solid ${t.primaryFocusRing() || t.focusRing()}`,
            outlineOffset: 2,
          },
        },
        containedPrimary: {
          backgroundColor: t.primaryMain(),
          color: t.onPrimary(),
          '&:hover': { backgroundColor: t.primaryDark(), boxShadow: 'none' },
          '&:active': { backgroundColor: t.primaryDark() },
          '&.Mui-disabled': {
            color: t.actionDisabled(),
            backgroundColor: t.actionDisabledBg(),
          },
        },
        outlinedPrimary: {
          borderColor: t.primaryMain(),
          color: t.primaryMain(),
          '&:hover': { backgroundColor: t.primaryHover() },
        },
        textPrimary: {
          color: t.primaryMain(),
          '&:hover': { backgroundColor: t.primaryHover() },
        },
      },
    },

    // CHECKBOX
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: t.textSecondary(),
          '&.Mui-checked': { color: t.primaryMain() },
          '&:hover': { backgroundColor: t.primaryHover() },
          '&.Mui-disabled': { color: t.actionDisabled() },
          '&:focus-visible': {
            outline: `${Math.max(2, borderSize)}px solid ${t.primaryFocusRing() || t.focusRing()}`,
            outlineOffset: 2,
            borderRadius: radius,
          },
        },
      },
    },

    // RADIO
    MuiRadio: {
      styleOverrides: {
        root: {
          color: t.textSecondary(),
          '&.Mui-checked': { color: t.primaryMain() },
          '&:hover': { backgroundColor: t.primaryHover() },
          '&.Mui-disabled': { color: t.actionDisabled() },
          '&:focus-visible': {
            outline: `${Math.max(2, borderSize)}px solid ${t.primaryFocusRing() || t.focusRing()}`,
            outlineOffset: 2,
            borderRadius: radius,
          },
        },
      },
    },

    // SELECT (uses InputBase/OutlinedInput + Menu)
    MuiSelect: {
      styleOverrides: {
        select: { '&:focus': { backgroundColor: 'transparent' } },
        icon: { color: t.textSecondary() },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radius,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: t.primaryMain(),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: t.primaryMain(),
            boxShadow: `0 0 0 3px ${t.primaryFocusRing() || t.focusRing()}`,
          },
        },
        notchedOutline: {
          borderColor: t.divider(),
          borderWidth: borderSize,
        },
        input: {
          color: t.textPrimary(),
          '&::placeholder': { color: t.textSecondary() },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: { color: t.textSecondary() },
        asterisk: { color: t.primaryMain() },
      },
    },
    MuiFormHelperText: {
      styleOverrides: { root: { color: t.textSecondary() } },
    },

    // TEXT FIELD (wrapper)
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },

    // CHIP
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: radius,
          border: `${borderSize}px solid ${t.divider()}`,
          backgroundColor: t.surfaceRaised(),
          '&.MuiChip-colorPrimary': {
            backgroundColor: t.primarySelected(),
            color: t.primaryDark(),
          },
        },
      },
    },

    // TABLE
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: t.surfaceRaised(),
          '& .MuiTableCell-head': {
            color: t.textSecondary(),
            borderBottom: `${borderSize}px solid ${t.divider()}`,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `${borderSize}px solid ${t.divider()}`,
          color: t.textPrimary(),
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        hover: {
          '&:hover': { backgroundColor: t.actionHover() },
          '&.Mui-selected': { backgroundColor: t.actionSelected() },
        },
      },
    },

    // CARD
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: radius,
          backgroundColor: t.surfaceRaised(),
          border: `${borderSize}px solid ${t.divider()}`,
        },
      },
    },

    // PAPER
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: t.surface(),
          borderRadius: radius,
        },
        outlined: {
          border: `${borderSize}px solid ${t.divider()}`,
          backgroundColor: t.surface(),
        },
        elevation1: { backgroundColor: t.surfaceRaised() },
      },
    },

    // MENU
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: radius,
          border: `${borderSize}px solid ${t.divider()}`,
          backgroundColor: t.surface(),
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: t.actionHover() },
          '&.Mui-selected': { backgroundColor: t.actionSelected() },
        },
      },
    },

    // TABS / TAB
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: t.primaryMain(), height: 2 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          color: t.textSecondary(),
          '&.Mui-selected': { color: t.primaryMain() },
          '&:hover': { backgroundColor: t.actionHover() },
          '&:focus-visible': {
            outline: `${Math.max(2, borderSize)}px solid ${t.primaryFocusRing() || t.focusRing()}`,
            outlineOffset: 2,
            borderRadius: radius,
          },
        },
      },
    },
  } satisfies Theme['components'];
}
