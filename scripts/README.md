# Design System Scripts

This directory contains scripts for managing the design system tokens and generating CSS variables and Tailwind configuration.

## Scripts

- `fetchFigmaVariables.js` - Fetches variables from Figma API
- `analyzeVariables.js` - Analyzes Figma variables to understand structure
- `transformVariables.js` - Transforms Figma variables to design tokens
- `updateTheme.js` - Updates the theme file with the latest tokens
- `generateTailwindConfig.js` - Generates Tailwind CSS configuration and CSS variables theme file

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
   npm run generate-tailwind  # Generate Tailwind config and CSS theme
   ```

3. Or run the full process:
   ```
   npm run build-tokens   # Run all steps except Tailwind generation
   npm run build-all      # Run all steps including Tailwind generation
   ```

## Configuration

Make sure the `.env` file at the project root contains:
- `FIGMA_PERSONAL_ACCESS_TOKEN`: Your Figma personal access token
- `FIGMA_FILE_KEY`: The ID of the Figma file containing variables

## Generated Files

The scripts generate the following files:

- `tokens/*.json` - Design tokens in JSON format generated from Figma variables
- `theme.css` - CSS custom properties (variables) generated from design tokens
- `tailwind.config.js` - Tailwind CSS configuration that uses the CSS variables

## How It Works

1. Figma variables are fetched from the Figma API
2. Variables are transformed into design tokens (stored in `tokens/` directory)
3. Design tokens are used to generate CSS variables in `theme.css`
4. Tailwind configuration is generated that references these CSS variables
5. This approach maintains a clean reference system from core tokens to component tokens
