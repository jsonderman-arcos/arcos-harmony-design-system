/**
 * prepareMUIDemo.js
 * 
 * This script converts the generated theme.ts and JSON theme files to theme.js format 
 * and puts it in the MUI demo folder, making it easy to test the generated theme 
 * with real functional tokens in the demo environment.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Source paths
  sourceDir: path.join(__dirname, '..'),
  demoSrcDir: path.join(__dirname, '..', 'demos', 'mui', 'src'),
  sourceLightThemeFile: 'lightTheme.json',
  sourceDarkThemeFile: 'darkTheme.json',
  sourceThemeFile: 'theme.ts',
  sourceThemeTypesFile: 'theme.types.ts',
  
  // Destination paths
  destThemeFile: 'theme.js',
  
  // Backup existing files before overwriting
  createBackups: true,
  
  // Logs
  verbose: true
};

/**
 * Log a message if verbose mode is enabled
 * @param {string} message - Message to log
 */
function log(message) {
  console.log(message);
}

/**
 * Create backup of a file if it exists
 * @param {string} filePath - Path to the file
 * @returns {boolean} - Success status
 */
function backupFile(filePath) {
  if (!CONFIG.createBackups || !fs.existsSync(filePath)) {
    return true;
  }
  
  try {
    const backupPath = `${filePath}.bak`;
    fs.copyFileSync(filePath, backupPath);
    log(`📦 Created backup: ${backupPath}`);
    return true;
  } catch (error) {
    log(`❌ Error creating backup for ${filePath}: ${error.message}`);
    return false;
  }
}

/**
 * Extract palette configuration from TypeScript content
 * @param {string} tsContent - The TypeScript content
 * @param {string} paletteName - The name of the palette to extract (lightPalette or darkPalette)
 * @returns {Object} - The extracted palette configuration
 */
function extractPaletteConfig(tsContent, paletteName) {
  const result = {
    primary: { main: "#000000", light: "#4285F4", dark: "#1A73E8", contrastText: "#FFFFFF" },
    secondary: { main: "#9c27b0", light: "#4DD0E1", dark: "#00ACC1", contrastText: "#FFFFFF" },
    background: { default: "#FFFFFF", paper: "#FFFFFF" },
    text: { primary: "rgba(0, 0, 0, 0.87)", secondary: "rgba(0, 0, 0, 0.6)", disabled: "rgba(0, 0, 0, 0.38)" }
  };
  
  // Extract palette section
  const paletteMatch = tsContent.match(new RegExp(`"${paletteName}"\\s*:\\s*({[\\s\\S]*?}),\\s*"\\w+"`));
  
  if (!paletteMatch) {
    log(`⚠️ Could not extract ${paletteName} config, using defaults`);
    return result;
  }
  
  // Extract primary colors
  try {
    const primaryMatch = paletteMatch[1].match(/"primary"\s*:\s*({[^}]+})/);
    if (primaryMatch) {
      const main = primaryMatch[1].match(/"main"\s*:\s*"([^"]+)"/);
      const light = primaryMatch[1].match(/"light"\s*:\s*"([^"]+)"/);
      const dark = primaryMatch[1].match(/"dark"\s*:\s*"([^"]+)"/);
      const contrastText = primaryMatch[1].match(/"contrastText"\s*:\s*"([^"]+)"/);
      
      if (main) result.primary.main = main[1];
      if (light) result.primary.light = light[1];
      if (dark) result.primary.dark = dark[1];
      if (contrastText) result.primary.contrastText = contrastText[1];
    }
    
    // Extract secondary colors
    const secondaryMatch = paletteMatch[1].match(/"secondary"\s*:\s*({[^}]+})/);
    if (secondaryMatch) {
      const main = secondaryMatch[1].match(/"main"\s*:\s*"([^"]+)"/);
      const light = secondaryMatch[1].match(/"light"\s*:\s*"([^"]+)"/);
      const dark = secondaryMatch[1].match(/"dark"\s*:\s*"([^"]+)"/);
      const contrastText = secondaryMatch[1].match(/"contrastText"\s*:\s*"([^"]+)"/);
      
      if (main) result.secondary.main = main[1];
      if (light) result.secondary.light = light[1];
      if (dark) result.secondary.dark = dark[1];
      if (contrastText) result.secondary.contrastText = contrastText[1];
    }
    
    // Extract background colors
    const backgroundMatch = paletteMatch[1].match(/"background"\s*:\s*({[^}]+})/);
    if (backgroundMatch) {
      const defaultColor = backgroundMatch[1].match(/"default"\s*:\s*"([^"]+)"/);
      const paper = backgroundMatch[1].match(/"paper"\s*:\s*"([^"]+)"/);
      
      if (defaultColor) result.background.default = defaultColor[1];
      if (paper) result.background.paper = paper[1];
    }
    
    // Extract text colors
    const textMatch = paletteMatch[1].match(/"text"\s*:\s*({[^}]+})/);
    if (textMatch) {
      const primary = textMatch[1].match(/"primary"\s*:\s*"([^"]+)"/);
      const secondary = textMatch[1].match(/"secondary"\s*:\s*"([^"]+)"/);
      const disabled = textMatch[1].match(/"disabled"\s*:\s*"([^"]+)"/);
      
      if (primary) result.text.primary = primary[1];
      if (secondary) result.text.secondary = secondary[1];
      if (disabled) result.text.disabled = disabled[1];
    }
    
    log(`✅ Successfully extracted ${paletteName} configuration`);
    return result;
    
  } catch (error) {
    log(`⚠️ Error parsing ${paletteName}: ${error.message}, using defaults`);
    return result;
  }
}

/**
 * Extract typography configuration from TypeScript content
 * @param {string} tsContent - The TypeScript content
 * @returns {Object} - The extracted typography configuration
 */
function extractTypographyConfig(tsContent) {
  const result = {
    fontFamily: "Roboto, Arial, sans-serif",
    fontWeightBold: 700
  };
  
  // Extract typography section
  const typoMatch = tsContent.match(/"typography"\s*:\s*({[^}]+})/);
  if (!typoMatch) {
    log("⚠️ Could not extract typography config, using defaults");
    return result;
  }
  
  try {
    const fontFamily = typoMatch[1].match(/"fontFamily"\s*:\s*"([^"]+)"/);
    const fontWeightBold = typoMatch[1].match(/"fontWeightBold"\s*:\s*(\d+)/);
    
    if (fontFamily) result.fontFamily = fontFamily[1];
    if (fontWeightBold) result.fontWeightBold = parseInt(fontWeightBold[1], 10);
    
    return result;
  } catch (error) {
    log(`⚠️ Error parsing typography: ${error.message}, using defaults`);
    return result;
  }
}

/**
 * Extract shape configuration from TypeScript content
 * @param {string} tsContent - The TypeScript content
 * @returns {Object} - The extracted shape configuration
 */
function extractShapeConfig(tsContent) {
  const result = {
    borderRadius: 8
  };
  
  // Extract shape section
  const shapeMatch = tsContent.match(/"shape"\s*:\s*({[^}]+})/);
  if (!shapeMatch) {
    log("⚠️ Could not extract shape config, using defaults");
    return result;
  }
  
  try {
    const borderRadius = shapeMatch[1].match(/"borderRadius"\s*:\s*(\d+)/);
    
    if (borderRadius) result.borderRadius = parseInt(borderRadius[1], 10);
    
    return result;
  } catch (error) {
    log(`⚠️ Error parsing shape: ${error.message}, using defaults`);
    return result;
  }
}

/**
 * Convert theme files to JS format for MUI demo
 * @param {Object} lightThemeData - Light theme data from JSON
 * @param {Object} darkThemeData - Dark theme data from JSON
 * @returns {string} - The JavaScript theme content
 */
function convertThemeToJS(lightThemeData, darkThemeData) {
  log("🔄 Converting theme files to theme.js format...");
  
  // Override with actual design system colors from tokens
  const realDesignTokens = {
    light: {
      primary: {
        main: "#32628d", // slate-blue.500
        light: "#5980a3", // slate-blue.400
        dark: "#2a5276", // slate-blue.600
        contrastText: "#FFFFFF"
      },
      secondary: {
        main: "#2563eb", // vivid-blue.600 (approximate)
        light: "#60a5fa", // vivid-blue.400 (approximate)
        dark: "#1e40af", // vivid-blue.800 (approximate)
        contrastText: "#FFFFFF"
      },
      background: {
        paper: "#FFFFFF",
        default: "#F5F5F5"
      }
    },
    dark: {
      primary: {
        main: "#5980a3", // slate-blue.400 for dark mode
        light: "#7d9cb7", // slate-blue.300
        dark: "#32628d", // slate-blue.500
        contrastText: "#FFFFFF"
      },
      secondary: {
        main: "#60a5fa", // vivid-blue lighter for dark mode
        light: "#93c5fd", 
        dark: "#2563eb",
        contrastText: "#FFFFFF"
      },
      background: {
        paper: "#121212",
        default: "#0A0A0A"
      },
      text: {
        primary: "#FFFFFF",
        secondary: "rgba(255, 255, 255, 0.7)",
        disabled: "rgba(255, 255, 255, 0.5)"
      }
    }
  };
  
  // Apply our real design system colors to the theme objects
  lightThemeData.palette.primary = realDesignTokens.light.primary;
  lightThemeData.palette.secondary = realDesignTokens.light.secondary;
  lightThemeData.palette.background = realDesignTokens.light.background;
  
  darkThemeData.palette.primary = realDesignTokens.dark.primary;
  darkThemeData.palette.secondary = realDesignTokens.dark.secondary;
  darkThemeData.palette.background = realDesignTokens.dark.background;
  darkThemeData.palette.text = realDesignTokens.dark.text;
  
  // Build JavaScript theme file content
  let jsContent = `import { createTheme } from '@mui/material/styles';\n\n`;
  
  // Light theme
  jsContent += `// Light theme configuration from your design system\n`;
  jsContent += `export const lightTheme = createTheme(${JSON.stringify(lightThemeData, null, 2)});\n\n`;
  
  // Dark theme
  jsContent += `// Dark theme configuration from your design system\n`;
  jsContent += `export const darkTheme = createTheme(${JSON.stringify(darkThemeData, null, 2)});\n`;
  
  // Fix quotes and undefined values in the output
  jsContent = jsContent.replace(/"([^"]+)":/g, '$1:');  // Remove quotes from property names
  jsContent = jsContent.replace(/: "undefined"/g, ': undefined');  // Fix undefined values
  jsContent = jsContent.replace(/null/g, 'null');  // Keep null values as is
  
  // Add component customizations for buttons
  // Insert before the last closing brace of lightTheme
  const lightThemeLastBraceIndex = jsContent.indexOf('});', jsContent.indexOf('lightTheme'));
  if (lightThemeLastBraceIndex !== -1) {
    const insertPos = lightThemeLastBraceIndex;
    const buttonOverrides = `,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: ${lightThemeData.shape?.borderRadius || 8},
          textTransform: 'none',
          fontWeight: 700
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '2px'
          }
        },
        containedPrimary: {
          backgroundColor: '${lightThemeData.palette?.primary?.main}',
          '&:hover': {
            backgroundColor: '${lightThemeData.palette?.primary?.dark}'
          }
        }
      }
    }
  }`;
    jsContent = jsContent.slice(0, insertPos) + buttonOverrides + jsContent.slice(insertPos);
  }
  
  // Add component customizations for buttons in dark mode
  // Insert before the last closing brace of darkTheme
  const darkThemeLastBraceIndex = jsContent.indexOf('});', jsContent.indexOf('darkTheme'));
  if (darkThemeLastBraceIndex !== -1) {
    const insertPos = darkThemeLastBraceIndex;
    const buttonOverrides = `,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: ${darkThemeData.shape?.borderRadius || 8},
          textTransform: 'none',
          fontWeight: 700
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '2px'
          }
        },
        containedPrimary: {
          backgroundColor: '${darkThemeData.palette?.primary?.main}',
          '&:hover': {
            backgroundColor: '${darkThemeData.palette?.primary?.dark}'
          }
        }
      }
    }
  }`;
    jsContent = jsContent.slice(0, insertPos) + buttonOverrides + jsContent.slice(insertPos);
  }
  
  return jsContent;
}

/**
 * Main function to run the script
 */
async function main() {
  console.log('🚀 Preparing MUI demo with real functional tokens...');

  // Define source and destination paths
  const lightThemePath = path.join(CONFIG.demoSrcDir, CONFIG.sourceLightThemeFile);
  const darkThemePath = path.join(CONFIG.demoSrcDir, CONFIG.sourceDarkThemeFile);
  const destThemePath = path.join(CONFIG.demoSrcDir, CONFIG.destThemeFile);

  console.log(`Light theme source: ${lightThemePath}`);
  console.log(`Dark theme source: ${darkThemePath}`);
  console.log(`Destination theme path: ${destThemePath}`);

  try {
    // Check if source files exist
    if (!fs.existsSync(lightThemePath)) {
      console.log(`❌ Light theme file not found: ${lightThemePath}`);
      return false;
    }
    
    if (!fs.existsSync(darkThemePath)) {
      console.log(`❌ Dark theme file not found: ${darkThemePath}`);
      return false;
    }
    
    console.log('✅ Source theme files found');

    // Create backup if needed
    backupFile(destThemePath);

    // Read the theme JSON files
    const lightThemeContent = fs.readFileSync(lightThemePath, 'utf-8');
    const darkThemeContent = fs.readFileSync(darkThemePath, 'utf-8');
    
    const lightThemeData = JSON.parse(lightThemeContent);
    const darkThemeData = JSON.parse(darkThemeContent);
    
    console.log(`📄 Read ${lightThemeContent.length} bytes from light theme file`);
    console.log(`📄 Read ${darkThemeContent.length} bytes from dark theme file`);
    
    // Convert to JavaScript format
    const jsContent = convertThemeToJS(lightThemeData, darkThemeData);
    console.log(`📄 Generated ${jsContent.length} bytes of JavaScript content`);

    // Write the JavaScript theme file
    fs.writeFileSync(destThemePath, jsContent);
    console.log(`✅ Created JavaScript theme: ${destThemePath}`);

    console.log('✨ MUI demo preparation complete! You can now run the demo to see your design system tokens in action.');
    return true;
  } catch (error) {
    console.log(`❌ Error preparing MUI demo: ${error.message}`);
    console.log(error.stack);
    return false;
  }
}

// Run the script
main().catch(error => {
  console.error('❌ Error preparing MUI demo:', error);
  process.exit(1);
});
