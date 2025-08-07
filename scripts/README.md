# Design System Scripts

This directory contains scripts for managing the design system tokens.

## Scripts

- `fetchFigmaVariables.js` - Fetches variables from Figma API
- `analyzeVariables.js` - Analyzes Figma variables to understand structure
- `transformVariables.js` - Transforms Figma variables to design tokens
- `updateTheme.js` - Updates the theme file with the latest tokens

## How to Use

1. Install dependencies:
   ```
   npm install
   ```

2. Run scripts individually:
   ```
   npm run fetch-variables    # Fetch variables from Figma
   npm run analyze-variables  # Analyze variable structure
   npm run transform-variables # Transform to design tokens
   npm run update-theme       # Update theme file
   ```

3. Or run the full process:
   ```
   npm run build-tokens
   ```

## Configuration

Make sure the `.env` file at the project root contains:
- `FIGMA_PERSONAL_ACCESS_TOKEN`: Your Figma personal access token
- `FIGMA_FILE_KEY`: The ID of the Figma file containing variables
