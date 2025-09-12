
const v = (name: string, fallback: string) => `var(--${name}, ${fallback})`;

export function MuiPaper(t: any) {
  const variants = Array.from({ length: 7 }, (_, level) => {
    const bg = v(
      `theme-base-background-elevations-level-${level}`,
      t?.paperBackgroundForElevation ? t.paperBackgroundForElevation(level) : 'rgba(255,255,255,1)'
    );
    return {
      props: { elevation: level },
      style: {
        backgroundColor: bg,
        ['--mui-palette-background-paper' as any]: bg,
        color: v('theme-base-text-primary', 'rgba(0,0,0,0.87)'),
      },
    };
  });

  return {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {
        borderRadius: t?.radius ?? '4px',
        color: v('theme-base-text-primary', 'rgba(0,0,0,0.87)'),
      },
      outlined: {
        border: `${t?.borderSize ?? 1}px solid ${v('theme-base-divider','rgba(0,0,0,0.12)')}`,
        backgroundColor: v('theme-base-surface', 'rgba(255,255,255,1)'),
        color: v('theme-base-text-primary','rgba(0,0,0,0.87)'),
      },
    },
    variants,
  };
}