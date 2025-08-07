# Fetching Figma Variables

This directory contains scripts to fetch design tokens from Figma using the Variables API.

## How to use

1. Make sure your `.env` file at the project root has the required variables:
   - `FIGMA_PERSONAL_ACCESS_TOKEN`: Your Figma Personal Access Token
   - `FIGMA_FILE_KEY`: The ID of the Figma file containing your variables

2. Run the fetch script from the project root:
   ```
   node fetchFigmaVariables.js
   ```

3. The script will save the raw Figma variables response in this directory as JSON.

## Files

- `figma-variables-raw.json`: The raw response from the Figma Variables API
- Additional processed files will be added as the project develops
