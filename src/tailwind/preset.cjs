// Tailwind preset mapping core design system CSS variables
// to Tailwind theme tokens. This is optional: include it in
// your Tailwind config if you want first‑class token names.

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Consumers should still configure `content` in their own config.
  theme: {
    extend: {
      // Map a small, stable set of variables. You can always
      // use arbitrary values like bg-[var(--theme-base-...)] too.
      colors: {
        background: 'var(--theme-base-background-default)',
        surface: 'var(--theme-base-background-paper-elevation-0)',
        primary: 'var(--theme-base-action-focus)',
        muted: 'var(--theme-base-action-disabled)',
      },
      borderRadius: {
        DEFAULT: 'var(--core-geometry-radii-400, 8px)',
        md: 'var(--core-geometry-radii-500, 12px)',
        lg: 'var(--core-geometry-radii-600, 16px)',
      },
    },
  },
};

