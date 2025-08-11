# MUI Theme Generator

This script generates a Material UI theme from your design tokens. It dynamically loads token files based on the modes defined in your Figma collections.

## How It Works

1. The script reads the `figma-collections-modes.json` file to determine which modes are available.
2. It maps each mode to a corresponding token file (e.g., "Light" mode -> "lightModeTokens.json").
3. It merges the tokens appropriately and generates a complete MUI theme with TypeScript support.
4. The output includes:
   - A `theme.ts` file with light/dark theme exports and a ThemeProvider
   - A `theme.types.ts` file with TypeScript definitions for custom colors

## Usage

```bash
# Generate the MUI theme with default settings
npm run generate-mui-theme

# Generate with custom paths
node generateMUITheme.js --modesConfig "../path/to/modes.json" --tokensDir "../path/to/tokens" --outputDir "../output" 
```

## Command Line Options

- `--modesConfig`: Path to the Figma modes configuration JSON file
- `--tokensDir`: Directory containing token JSON files
- `--outputDir`: Directory where theme files will be generated
- `--themeFile`: Name of the generated theme file (default: "theme.ts")
- `--typesFile`: Name of the generated types file (default: "theme.types.ts")

## Using the Generated Theme

```tsx
import { ThemeProvider, lightMuiTheme, darkMuiTheme } from './theme';

// Option 1: Use the ThemeProvider with mode switching
function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}

// Option 2: Use a specific theme directly
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

function App() {
  return (
    <MuiThemeProvider theme={lightMuiTheme}>
      <YourApp />
    </MuiThemeProvider>
  );
}
```

## Integration with Design System Pipeline

This script is part of the UX Design System pipeline and can be run as part of the build process:

```bash
# Run the full pipeline
npm run build-all
```

The resulting theme files can be used in your React applications, ensuring consistency with your design system.
