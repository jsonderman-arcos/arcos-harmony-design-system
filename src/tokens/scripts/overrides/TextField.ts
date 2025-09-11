import { t } from '../lib/tokenUtils';

export function MuiTextField(t: any) {
  return {
    defaultProps: {
      variant: 'outlined',
    },
    // No backgroundColor here for root or outlined
    styleOverrides: {
      root: {
        borderRadius: t.radius,
        // No backgroundColor here
      },
    },
  };
}

// --- Add this override for the input itself ---
// filepath: /Users/jsonderman/Projects/SystemAutomation/ux-design-system/src/tokens/scripts/overrides/OutlinedInput.ts


export function MuiOutlinedInput(t: any) {
  return {
    styleOverrides: {
      root: {
        backgroundColor: '#fff', // White background for the input
        '&.Mui-disabled': {
          backgroundColor: t.actionDisabledBg(),
        },
      },
    },
  };
}