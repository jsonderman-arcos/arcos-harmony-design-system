import { t } from '../lib/tokenUtils';

export function MuiCard(t: any) {
  // Helper for CSS vars with safe fallbacks
  const v = (name: string, fallback: string) => `var(--${name}, ${fallback})`;

  const radius = t?.radius ?? '4px';
  const borderSize = Math.max(1, t?.borderSize ?? 1);

  // Divider color — prefer token var, fall back to token util, then a sensible default
  const divider = v('theme-base-divider', (typeof t?.divider === 'function' ? t.divider() : t?.divider) || 'rgba(0,0,0,0.12)');

  // Resolve background for a given elevation level using common token names
  const bgForLevel = (level: number) => {
    const util = typeof t?.paperBackgroundForElevation === 'function' ? t.paperBackgroundForElevation(level) : undefined;
    // Try background-elevations first (your requested naming), then surface-level, then util fallback, then white
    return v(
      `theme-base-background-elevations-level-${level}`,
      v(`theme-base-surface-level-${level}`,
        util || 'rgba(255,255,255,1)'
      )
    );
  };

  const defaultBackground = v('theme-base-background-elevations-highest', bgForLevel(0));

  const variants = Array.from({ length: 7 }, (_, level) => ({
    props: { elevation: level },
    style: {
      backgroundColor: bgForLevel(level),
      ['--mui-palette-background-paper' as any]: bgForLevel(level),
    },
  }));

  return {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {
        borderRadius: radius,
        border: `${borderSize}px solid ${divider}`,
        backgroundColor: defaultBackground,
        ['--mui-palette-background-paper' as any]: defaultBackground,
      },
    },
    variants,
  };
}
