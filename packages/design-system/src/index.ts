import type { ThemeOptions } from '@mui/material/styles';

import muiThemeJsonRaw from './theme/mui-theme.json';
import themeFlatJson from './theme/theme.flat.json';
import coreFlatJson from './theme/core.flat.json';
import themeMuiFlatJson from './theme/theme.muiflat.json';
import coreMuiFlatJson from './theme/core.muiflat.json';

export type { ThemeOptions };

export const muiThemeJson = muiThemeJsonRaw as ThemeOptions;
export const themeFlat = themeFlatJson;
export const coreFlat = coreFlatJson;
export const themeMuiFlat = themeMuiFlatJson;
export const coreMuiFlat = coreMuiFlatJson;

export type TokenDictionary = Record<string, unknown>;

export type ThemeJsonExports = {
  muiThemeJson: ThemeOptions;
  themeFlat: TokenDictionary;
  coreFlat: TokenDictionary;
  themeMuiFlat: TokenDictionary;
  coreMuiFlat: TokenDictionary;
};
