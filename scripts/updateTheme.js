/**
 * Update Theme Script
 * 
 * This script updates the theme.ts file to reflect the current token system.
 * It dynamically discovers available theme modes from the tokens directory and
 * updates imports and theme structure accordingly.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  tokensDir: path.join(__dirname, '..', 'tokens'),
  themePath: path.join(__dirname, '..', 'theme.ts'),
  backupPath: path.join(__dirname, '..', 'theme.ts.backup'),
  coreTokensFile: 'coreTokens.json',
  defaultMode: 'dark',
  modePattern: /^(\w+)ModeTokens\.json$/
};

/**
 * Get available theme modes from tokens directory
 */
function getAvailableModes() {
  const tokenFiles = fs.readdirSync(CONFIG.tokensDir)
    .filter(file => file.endsWith('.json'));
  
  console.log(`Found ${tokenFiles.length} token files in ${CONFIG.tokensDir}`);
  
  const modes = [];
  const specialFiles = new Set([CONFIG.coreTokensFile]);
  
  tokenFiles.forEach(file => {
    if (specialFiles.has(file)) return;
    
    const match = file.match(CONFIG.modePattern);
    if (match) {
      const modeName = match[1].toLowerCase();
      if (modeName === 'default' || modeName === 'large screen') return; // Skip these modes
      modes.push({
        name: modeName,
        filename: file,
        importName: `${modeName}ModeTokens`,
        varName: modeName
      });
    }
  });
  
  return modes;
}

/**
 * Generate TypeScript code for imports
 */
function generateImports(modes) {
  let imports = `import { createTheme, ThemeOptions } from '@mui/material/styles'
import coreTokens from './tokens/coreTokens.json'
`;

  modes.forEach(mode => {
    imports += `import ${mode.importName} from './tokens/${mode.filename}'\n`;
  });

  return imports;
}

/**
 * Generate TypeScript code for theme modes type
 */
function generateThemeModeType(modes) {
  const modeNames = modes.map(mode => `'${mode.name}'`).join(' | ');
  return `// Available theme modes
type ThemeMode = ${modeNames} | string;
`;
}

/**
 * Generate TypeScript code for theme tokens by mode
 */
function generateThemeTokensByMode(modes) {
  let themeTokensByMode = `// Theme tokens by mode
const themeTokensByMode: Record<ThemeMode, Record<string, unknown>> = {
`;

  modes.forEach(mode => {
    themeTokensByMode += `  '${mode.name}': ${mode.importName},\n`;
  });

  themeTokensByMode += `  // Add additional themes dynamically as they become available
}
`;

  return themeTokensByMode;
}

/**
 * Main function to update theme.ts file
 */
function updateTheme() {
  try {
    console.log('Starting theme.ts update process...');
    
    // Backup current theme.ts file
    if (fs.existsSync(CONFIG.themePath)) {
      fs.copyFileSync(CONFIG.themePath, CONFIG.backupPath);
      console.log(`Backed up current theme file to ${CONFIG.backupPath}`);
    }
    
    // Get available theme modes from tokens directory
    const modes = getAvailableModes();
    
    if (modes.length === 0) {
      console.error('No valid theme modes found in tokens directory');
      return;
    }
    
    console.log(`Found ${modes.length} theme modes: ${modes.map(m => m.name).join(', ')}`);
    
    // Read the current theme.ts file
    let themeContent = fs.readFileSync(CONFIG.themePath, 'utf8');
    
    // Generate new imports
    const newImports = generateImports(modes);
    
    // Replace imports section
    themeContent = themeContent.replace(
      /import.*from '@mui\/material\/styles'(\r?\n)((import.*from '\.\/tokens\/.*'(\r?\n))*)/, 
      newImports
    );
    
    // Generate new ThemeMode type
    const newThemeModeType = generateThemeModeType(modes);
    
    // Replace ThemeMode type
    themeContent = themeContent.replace(
      /\/\/ Available theme modes(\r?\n)type ThemeMode.*(\r?\n)/,
      newThemeModeType
    );
    
    // Generate new themeTokensByMode
    const newThemeTokensByMode = generateThemeTokensByMode(modes);
    
    // Replace themeTokensByMode
    themeContent = themeContent.replace(
      /\/\/ Theme tokens by mode(\r?\n)const themeTokensByMode[^}]*}\r?\n/s,
      newThemeTokensByMode
    );
    
    // Update default theme mode if needed
    const defaultMode = modes.find(m => m.name === CONFIG.defaultMode) ? 
      CONFIG.defaultMode : modes[0].name;
    
    themeContent = themeContent.replace(
      /let currentThemeMode: ThemeMode = '.*';/,
      `let currentThemeMode: ThemeMode = '${defaultMode}';`
    );
    
    // Write the updated file
    fs.writeFileSync(CONFIG.themePath, themeContent);
    
    console.log('✅ Successfully updated theme.ts with the latest token system!');
    console.log(`Default theme mode set to: ${defaultMode}`);
    
  } catch (error) {
    console.error('❌ Error updating theme file:', error);
    
    if (fs.existsSync(CONFIG.backupPath)) {
      console.log('Restoring from backup...');
      fs.copyFileSync(CONFIG.backupPath, CONFIG.themePath);
      console.log('Restored original theme.ts file from backup');
    }
  }
}

// Run the update
updateTheme();
