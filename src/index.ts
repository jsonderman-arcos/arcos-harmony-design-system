// Entry point for the design system package
// Export generated JSON theme/token assets for consumers.

// MUI theme options as JSON (use with MUI createTheme)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - JSON module
export { default as muiThemeJson } from './theme/mui-theme.json';

// Flat token JSONs
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - JSON module
export { default as themeFlat } from './theme/theme.flat.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - JSON module
export { default as coreFlat } from './theme/core.flat.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - JSON module
export { default as themeMuiFlat } from './theme/theme.muiflat.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - JSON module
export { default as coreMuiFlat } from './theme/core.muiflat.json';

// Note: CSS token files are included in the package under `theme/`.
// Consumers can import them directly via their bundler if desired.
