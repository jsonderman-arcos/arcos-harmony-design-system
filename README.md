# Arcos Harmony Design System

A hardened distribution of the Lighthouse design tokens, semantic MUI theme, Tailwind preset, and
supporting automation. This repository publishes a single consumable npm package:

```
npm install arcos-harmony-design-system
```

The package provides:

- Flattened JSON tokens (core + theme collections) ready for automation pipelines.
- Precompiled CSS custom properties for both primitive and semantic tokens.
- A typed `ThemeOptions` export compatible with MUI v5/v7.
- Optional Tailwind preset mapping Lighthouse tokens to utility aliases.
- Build scripts to fetch tokens from Figma, normalize them, and rebuild the theme overrides.

## Usage

```ts
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { muiThemeJson } from 'arcos-harmony-design-system';
import 'arcos-harmony-design-system/theme/tokens.css';
import 'arcos-harmony-design-system/theme/theme.css';

const theme = createTheme(muiThemeJson as ThemeOptions);

export function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
```

### Token JSON

```ts
import { themeFlat, coreFlat } from 'arcos-harmony-design-system';

console.log(themeFlat['theme-base-background-elevations-highest']);
```

### Tailwind preset

```js
// tailwind.config.cjs (CommonJS)
module.exports = {
  presets: [require('arcos-harmony-design-system/tailwind/preset.cjs')],
};
```

```ts
// tailwind.config.ts (ESM)
import preset from 'arcos-harmony-design-system/tailwind/preset.cjs';

export default {
  presets: [preset],
};
```

## Local Development

```bash
yarn install
# Rebuild tokens from previously fetched raw payloads
yarn tokens:build
# Re-generate ThemeOptions, CSS, and package outputs
yarn build
# Storybook (local docs)
yarn storybook
```

Token automation:

- `yarn tokens:fetch` – fetch latest variables from Figma using `FIGMA_PERSONAL_TOKEN` and
  `FIGMA_FILE_KEY`.
- `yarn tokens:build` – flatten raw payload into JSON + CSS sources under
  `packages/design-system/src/theme`.
- `yarn theme:build` – produce the typed `ThemeOptions` and component overrides.

## Release Process

This repository uses [Changesets](https://github.com/changesets/changesets).

1. Create a changeset: `yarn changeset`
2. Merge to `main`
3. GitHub Actions opens/publishes the release with `yarn release` (requires `NPM_TOKEN`).

To validate the package locally:

```bash
cd packages/design-system
npm pack
```

The generated tarball contains:

- `dist/esm`, `dist/cjs`, `dist/types`
- `dist/theme/tokens.css`, `dist/theme/theme.css`, and `dist/theme/mui-theme.json`
- `dist/tailwind/preset.cjs`

## Demos

A Vite demo is available under `demos/mui`. From the repository root:

```bash
yarn install
yarn workspace mui dev
```

The demo consumes the package directly via the workspace symlink and renders a themed MUI surface.

## Repository Layout

```
packages/design-system      # published npm package
packages/design-system/src  # generated token + theme assets
packages/design-system/scripts # figma + build automation
packages/design-system/stories # Storybook docs
.github/workflows           # CI + release automation
.tooling                    # ESLint/Prettier configs
```

