/**
 * prepareMUIDemo.js
 * 
 * This script converts theme.ts to theme.js format and puts it in the MUI demo folder,
 * making it easy to test the generated theme with real functional tokens in the demo environment.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Source paths
  sourceDir: path.join(__dirname, '..'),
  sourceThemeFile: 'theme.ts',
  sourceThemeTypesFile: 'theme.types.ts',
  
  // Destination paths
  demoDir: path.join(__dirname, '..', 'demos', 'mui', 'src'),
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
 * Convert theme.ts to theme.js
 * @param {string} tsContent - The TypeScript theme content
 * @returns {string} - The JavaScript theme content
 */
function convertThemeToJS(tsContent) {
  log("🔄 Converting theme.ts to theme.js format...");
  
  // Extract configurations
  const lightPalette = extractPaletteConfig(tsContent, "lightPalette");
  const darkPalette = extractPaletteConfig(tsContent, "darkPalette");
  const typography = extractTypographyConfig(tsContent);
  const shape = extractShapeConfig(tsContent);
  
  // Build JavaScript theme file content
  let jsContent = `import { createTheme } from '@mui/material/styles';\n\n`;
  
  // Light theme
  jsContent += `// Light theme configuration from your design system\n`;
  jsContent += `export const lightTheme = createTheme({\n`;
  jsContent += `  palette: {\n`;
  jsContent += `    mode: 'light',\n`;
  
  // Add primary colors
  jsContent += `    primary: {\n`;
  jsContent += `      main: '${lightPalette.primary.main}',\n`;
  jsContent += `      light: '${lightPalette.primary.light}',\n`;
  jsContent += `      dark: '${lightPalette.primary.dark}',\n`;
  jsContent += `      contrastText: '${lightPalette.primary.contrastText}',\n`;
  jsContent += `    },\n`;
  
  // Add secondary colors
  jsContent += `    secondary: {\n`;
  jsContent += `      main: '${lightPalette.secondary.main}',\n`;
  jsContent += `      light: '${lightPalette.secondary.light}',\n`;
  jsContent += `      dark: '${lightPalette.secondary.dark}',\n`;
  jsContent += `      contrastText: '${lightPalette.secondary.contrastText}',\n`;
  jsContent += `    },\n`;
  
  // Add background colors
  jsContent += `    background: {\n`;
  jsContent += `      default: '${lightPalette.background.default}',\n`;
  jsContent += `      paper: '${lightPalette.background.paper}',\n`;
  jsContent += `    },\n`;
  
  // Add text colors
  jsContent += `    text: {\n`;
  jsContent += `      primary: '${lightPalette.text.primary}',\n`;
  jsContent += `      secondary: '${lightPalette.text.secondary}',\n`;
  jsContent += `      disabled: '${lightPalette.text.disabled}',\n`;
  jsContent += `    },\n`;
  jsContent += `  },\n`;
  
  // Add typography
  jsContent += `  typography: {\n`;
  jsContent += `    fontFamily: '${typography.fontFamily}',\n`;
  jsContent += `    fontWeightBold: ${typography.fontWeightBold},\n`;
  jsContent += `  },\n`;
  
  // Add shape
  jsContent += `  shape: {\n`;
  jsContent += `    borderRadius: ${shape.borderRadius},\n`;
  jsContent += `  },\n`;
  
  // Add component customizations for buttons
  jsContent += `  components: {\n`;
  jsContent += `    MuiButton: {\n`;
  jsContent += `      styleOverrides: {\n`;
  jsContent += `        root: {\n`;
  jsContent += `          borderRadius: ${shape.borderRadius},\n`;
  jsContent += `          textTransform: 'none',\n`;
  jsContent += `          fontWeight: ${typography.fontWeightBold},\n`;
  jsContent += `        },\n`;
  jsContent += `        containedPrimary: {\n`;
  jsContent += `          backgroundColor: '${lightPalette.primary.main}',\n`;
  jsContent += `          '&:hover': {\n`;
  jsContent += `            backgroundColor: '${lightPalette.primary.dark}',\n`;
  jsContent += `          },\n`;
  jsContent += `        },\n`;
  jsContent += `      },\n`;
  jsContent += `    },\n`;
  jsContent += `  },\n`;
  jsContent += `});\n\n`;
  
  // Dark theme
  jsContent += `// Dark theme configuration from your design system\n`;
  jsContent += `export const darkTheme = createTheme({\n`;
  jsContent += `  palette: {\n`;
  jsContent += `    mode: 'dark',\n`;
  
  // Add primary colors
  jsContent += `    primary: {\n`;
  jsContent += `      main: '${darkPalette.primary.main}',\n`;
  jsContent += `      light: '${darkPalette.primary.light}',\n`;
  jsContent += `      dark: '${darkPalette.primary.dark}',\n`;
  jsContent += `      contrastText: '${darkPalette.primary.contrastText}',\n`;
  jsContent += `    },\n`;
  
  // Add secondary colors
  jsContent += `    secondary: {\n`;
  jsContent += `      main: '${darkPalette.secondary.main}',\n`;
  jsContent += `      light: '${darkPalette.secondary.light}',\n`;
  jsContent += `      dark: '${darkPalette.secondary.dark}',\n`;
  jsContent += `      contrastText: '${darkPalette.secondary.contrastText}',\n`;
  jsContent += `    },\n`;
  
  // Add background colors - override with standard dark theme colors for better visibility
  jsContent += `    background: {\n`;
  jsContent += `      default: '#121212', // Standard dark background\n`;
  jsContent += `      paper: '#1e1e1e', // Standard dark paper\n`;
  jsContent += `    },\n`;
  
  // Add text colors
  jsContent += `    text: {\n`;
  jsContent += `      primary: '#ffffff',\n`;
  jsContent += `      secondary: 'rgba(255, 255, 255, 0.7)',\n`;
  jsContent += `      disabled: 'rgba(255, 255, 255, 0.5)',\n`;
  jsContent += `    },\n`;
  jsContent += `  },\n`;
  
  // Add typography
  jsContent += `  typography: {\n`;
  jsContent += `    fontFamily: '${typography.fontFamily}',\n`;
  jsContent += `    fontWeightBold: ${typography.fontWeightBold},\n`;
  jsContent += `  },\n`;
  
  // Add shape
  jsContent += `  shape: {\n`;
  jsContent += `    borderRadius: ${shape.borderRadius},\n`;
  jsContent += `  },\n`;
  
  // Add component customizations for buttons in dark mode
  jsContent += `  components: {\n`;
  jsContent += `    MuiButton: {\n`;
  jsContent += `      styleOverrides: {\n`;
  jsContent += `        root: {\n`;
  jsContent += `          borderRadius: ${shape.borderRadius},\n`;
  jsContent += `          textTransform: 'none',\n`;
  jsContent += `          fontWeight: ${typography.fontWeightBold},\n`;
  jsContent += `        },\n`;
  jsContent += `        containedPrimary: {\n`;
  jsContent += `          backgroundColor: '${darkPalette.primary.light || darkPalette.primary.main}',\n`;
  jsContent += `          color: '${darkPalette.primary.contrastText}',\n`;
  jsContent += `          '&:hover': {\n`;
  jsContent += `            backgroundColor: '${darkPalette.primary.dark}',\n`;
  jsContent += `          },\n`;
  jsContent += `        },\n`;
  jsContent += `      },\n`;
  jsContent += `    },\n`;
  jsContent += `  },\n`;
  jsContent += `});\n`;
  
  return jsContent;
}

/**
 * Main function to run the script
 */
async function main() {
  console.log('🚀 Preparing MUI demo with real functional tokens...');

  // Define source and destination paths
  const sourceThemePath = path.join(CONFIG.sourceDir, CONFIG.sourceThemeFile);
  const destThemePath = path.join(CONFIG.demoDir, CONFIG.destThemeFile);

  console.log(`Source theme path: ${sourceThemePath}`);
  console.log(`Destination theme path: ${destThemePath}`);

  try {
    // Check if source file exists
    if (!fs.existsSync(sourceThemePath)) {
      console.log(`❌ Source theme file not found: ${sourceThemePath}`);
      return false;
    }
    console.log('✅ Source theme file found');

    // Create backup if needed
    backupFile(destThemePath);

    // Read the TypeScript theme file
    const tsContent = fs.readFileSync(sourceThemePath, 'utf-8');
    console.log(`📄 Read ${tsContent.length} bytes from source theme file`);
    
    // Convert to JavaScript format
    const jsContent = convertThemeToJS(tsContent);
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
