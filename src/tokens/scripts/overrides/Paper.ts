import { t } from '../lib/tokenUtils';

export function MuiPaper(t:any){
  return{
    styleOverrides: {
    root: ({ ownerState }: any) => ({
      backgroundColor: t.paperBackgroundForElevation(ownerState?.elevation ?? 0),
      borderRadius: t.radius,
    }),
    outlined: {
      border: `${t.borderSize}px solid ${t.divider()}`,
      backgroundColor: t.surface(),
    },
  },
}
};