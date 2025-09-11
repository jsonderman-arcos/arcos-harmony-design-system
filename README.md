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

