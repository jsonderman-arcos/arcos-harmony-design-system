// Entry point for the design system package
// Export generated JSON theme/token assets for consumers.

// MUI theme options as JSON (use with MUI createTheme)
import muiThemeJson from './theme/mui-theme.json';

// Flat token JSONs
import themeFlat from './theme/theme.flat.json';
import coreFlat from './theme/core.flat.json';
import themeMuiFlat from './theme/theme.muiflat.json';
import coreMuiFlat from './theme/core.muiflat.json';

export { muiThemeJson, themeFlat, coreFlat, themeMuiFlat, coreMuiFlat };

export default {
  muiThemeJson,
  themeFlat,
  coreFlat,
  themeMuiFlat,
  coreMuiFlat,
};

// Note: CSS token files are included in the package under `theme/`.
// Consumers can import them directly via their bundler if desired.
