# UX Design System

This repository contains the UX Design System for our projects.

## Directory Structure

- `variables/`: Raw data from Figma Variables API
- `tokens/`: Processed design tokens
- `scripts/`: Scripts for fetching, processing, and updating design tokens
- `archive/`: Archived versions of tokens and variables

## Getting Started

1. Make sure you have Node.js installed
2. Create a `.env` file with your Figma API credentials
3. Run the scripts from the `scripts` directory to build tokens:
   ```
   cd scripts
   npm install
   npm run build-tokens
   ```

## Scripts Overview

### 1. `fetchFigmaTokens.ts`
- **Purpose:** Fetches the latest design tokens from Figma using the Figma API.
- **When to use:** Run whenever you want to update your local tokens with the latest from Figma.
- **How to use:**
  1. Ensure your `.env` file contains `FIGMA_PERSONAL_TOKEN` and `FIGMA_FILE_KEY`.
  2. Run: `npx ts-node src/tokens/scripts/fetchFigmaTokens.ts`
  3. Output: `src/tokens/inputs/tokens-raw-response.json`

### 2. `build-from-figma.ts`
- **Purpose:** Processes the raw Figma tokens and generates flattened, mode-aware JSON token files for use in theming.
- **When to use:** After fetching new tokens from Figma, or when you want to regenerate the flat token files.
- **How to use:**
  1. Optionally specify collections to build via CLI or environment variable (see script for details).
  2. Run: `npx ts-node src/tokens/scripts/build-from-figma.ts`
  3. Output: Flat JSON files in `src/theme/` (e.g., `theme.muiflat.json`)

### 3. `build-mui-themes.ts`
- **Purpose:** Converts the flat JSON tokens into MUI-compatible theme objects, including all palette, shape, and component overrides.
- **When to use:** After updating or regenerating your flat theme tokens, or when you want to rebuild the MUI theme files.
- **How to use:**
  1. Run: `npx ts-node src/tokens/scripts/build-mui-themes.ts`
  2. Output: `src/theme/mui-theme.json` and `src/theme/mui-theme.ts`

## Typical Workflow
1. Run `fetchFigmaTokens.ts` to get the latest tokens from Figma.
2. Run `build-from-figma.ts` to process and flatten the tokens.
3. Run `build-mui-themes.ts` to generate the MUI theme files.

## Notes
- All scripts are intended to be run from the project root.
- You may need to install dependencies with `npm install` before running these scripts.
- For custom component overrides, see the `src/tokens/scripts/overrides/` directory.

---

For more details, see comments in each script or contact the design system maintainers.

UX Design System — Install & Usage Guide

**Overview**
- This workspace builds the published package `arcos-harmony-design-system`, which ships design tokens (CSS variables + JSON) and a fully wired MUI theme.
- You can install it into any React app (including Lovable workspaces) to get consistent theming and tokens.

**Install**
- From the packaged tarball (recommended for Lovable or testing):
  - `npm install ./arcos-harmony-design-system-1.2.0.tgz`
  - Or host the tarball somewhere Lovable can reach (e.g. S3/GitHub release) and reference the URL in `package.json` dependencies.
- From the local workspace during development: `npm install file:../ux-design-system`
- Ensure MUI + Emotion are installed in the app: `npm install @mui/material@^7 @emotion/react @emotion/styled`
- `@mui/material` remains a peer dependency, so an existing app installation is reused and a duplicate copy will not be added.

**Lovable Setup**
- Host `arcos-harmony-design-system-1.2.0.tgz` somewhere Lovable can download (public S3 bucket, GitHub release asset, or signed URL).
- In the Lovable project’s `package.json`, add the dependency pointing at that URL, for example:
  ```json
  {
    "dependencies": {
      "arcos-harmony-design-system": "https://your-host.example/arcos-harmony-design-system-1.2.0.tgz"
    }
  }
  ```
- Trigger Lovable’s dependency install (or run `npm install`) and then import the tokens/theme as shown below.

**Use In A React App**
- Import CSS tokens and build the MUI theme from JSON:
  - `import 'arcos-harmony-design-system/theme/tokens.css'`
  - `import 'arcos-harmony-design-system/theme/theme.css'`
  - `import { muiThemeJson } from 'arcos-harmony-design-system'`
  - `import { ThemeProvider, CssBaseline } from '@mui/material'`
  - `import { createTheme, type ThemeOptions } from '@mui/material/styles'`

Example `App.tsx`:
```tsx
import { ThemeProvider, CssBaseline, Button, Typography, Card, CardContent } from '@mui/material';
import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { muiThemeJson } from 'arcos-harmony-design-system';
import 'arcos-harmony-design-system/theme/tokens.css';
import 'arcos-harmony-design-system/theme/theme.css';

const theme = createTheme(muiThemeJson as ThemeOptions);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Card elevation={2} sx={{ p: 2, m: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Design System Demo</Typography>
          <Button variant="contained">Primary</Button>{' '}
          <Button variant="outlined" color="secondary">Secondary</Button>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
```

**What The Package Exposes**
- JSON exports: `muiThemeJson`, `themeFlat`, `coreFlat`, `themeMuiFlat`, `coreMuiFlat` from `arcos-harmony-design-system`.
- CSS tokens: import via subpaths `arcos-harmony-design-system/theme/tokens.css`, `arcos-harmony-design-system/theme/theme.css`, `arcos-harmony-design-system/theme/core.css`.

**ESM vs CJS**
- The package supports both ESM and CommonJS consumers.
- ESM (recommended): `import { muiThemeJson } from 'arcos-harmony-design-system'`
- CJS: `const { muiThemeJson } = require('arcos-harmony-design-system')`
- Subpath CSS imports work identically in both module systems.
- Node’s native ESM loader still requires the `--experimental-json-modules` flag for JSON imports; if you cannot enable it, fall back to the CommonJS entry (`require`).

**CSS‑Only Usage (no MUI)**
- Import the CSS files in your app entry:
  - `import 'arcos-harmony-design-system/theme/tokens.css'`
  - `import 'arcos-harmony-design-system/theme/theme.css'` (semantic theme variables)
- Use CSS variables directly in your styles:
```css
/* app.css */
.btn-primary {
  background: var(--theme-base-background-focus);
  color: var(--core-aliases-colors-white-100);
  border-radius: var(--core-geometry-radii-400, 8px);
  padding: var(--core-geometry-spacing-400, 16px) var(--core-geometry-spacing-500, 20px);
}
```

**Tailwind Quickstart (optional)**
- Prerequisites: Tailwind CSS installed in your React app.
- Add the preset to your Tailwind config:
  - CommonJS (`tailwind.config.js`):
    ```js
    // tailwind.config.js
    module.exports = {
      content: ['./src/**/*.{ts,tsx,js,jsx,html}'],
      presets: [require('arcos-harmony-design-system/tailwind/preset.cjs')],
    };
    ```
  - ESM (`tailwind.config.mjs`):
    ```js
    // tailwind.config.mjs
    import preset from 'arcos-harmony-design-system/tailwind/preset.cjs';
    export default {
      content: ['./src/**/*.{ts,tsx,js,jsx,html}'],
      presets: [preset],
    };
    ```
- Import the CSS variables (once, e.g. in your app entry):
  - `import 'arcos-harmony-design-system/theme/tokens.css'`
  - `import 'arcos-harmony-design-system/theme/theme.css'`
- Use in JSX:
  - `className="bg-background text-primary rounded md:rounded-md"`
  - Arbitrary values are also supported: `className="bg-[var(--theme-base-background-default)]"`
- Customize further by extending your Tailwind config:
  ```js
  // tailwind.config.js
  const ds = require('arcos-harmony-design-system/tailwind/preset.cjs');
  module.exports = {
    content: ['./src/**/*.{ts,tsx,js,jsx,html}'],
    presets: [ds],
    theme: {
      extend: {
        colors: {
          // Map additional design tokens as needed
          brand: 'var(--core-lighthouse-colors-brand-500)',
        },
      },
    },
  };
  ```
- Fallback behavior: If Tailwind isn’t used, nothing changes. Keep using MUI with `muiThemeJson` and CSS tokens normally.

**TypeScript Notes**
- The package ships a minimal `dist/index.d.ts`. If your TS config enforces type‑only imports, use `import { createTheme, type ThemeOptions } ...`.

**Local Development Options**
- Live link instead of tarball:
  - In `ux-design-system`: `npm link`
  - In your app: `npm link arcos-harmony-design-system`
- Rebuild the package after changes: `cd ux-design-system && npm run build && npm pack`

**Publishing (optional)**
- To publish to npm (requires auth and version bump):
  - Update version in `ux-design-system/package.json`.
  - `cd ux-design-system && npm publish`

**Troubleshooting**
- “Missing ./dist/theme/… specifier”: Import CSS via `arcos-harmony-design-system/theme/...` (subpath exports), not `dist/...`.
- “Could not find a declaration for module 'arcos-harmony-design-system'”: Ensure you’re on the latest tarball; it includes `dist/index.d.ts`.
